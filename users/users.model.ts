import * as mongoose from 'mongoose'
import { validateCPF } from '../common/validators'
import * as bcrypt from 'bcrypt'
import { environment } from '../common/environment'

export interface User extends mongoose.Document {
    name: string
    email: string
    password: string
}

export interface UserModel extends mongoose.Model<User> {
    findByEmail(email: string, projection?: string): Promise<User>
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 80,
        minlength: 3
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: {
        type: String,
        select: false,
        required: true
    },
    gender: {
        type: String,
        required: false,
        enum: ['male', 'female']
    },
    cpf: {
        type: String,
        required: false,
        validate: {
            validator:  validateCPF,
            message: `{PATH}: Invalid CPF ({VALUE})`
        }
    }
})

userSchema.statics.findByEmail = function(email: string, projection: string) {
    return this.findOne({email}, projection) //{email : email}
}

userSchema.methods.matches = function(password: string) : boolean {
    return bcrypt.compareSync(password, this.password)
}

const hashpassword = (obj, next) => {

    bcrypt
        .hash(obj.password, environment.security.saltRounds)
        .then(hash => {
            obj.password = hash
            next()
        })
        .catch(next)

}

const saveMiddleware = function (next) {
    const user: User = this
    if (!user.isModified('password')) {
        next()
    } else {
        hashpassword(user, next)
    }
}

const updateMiddleware = function (next) {
    if (!this.getUpdate().password) {
        next()
    } else {
        hashpassword(this.getUpdate(), next)
    }
}

userSchema.pre('save', saveMiddleware)
userSchema.pre('findOneAndUpdate', updateMiddleware)
userSchema.pre('update', updateMiddleware)

export const User = mongoose.model<User, UserModel>('User', userSchema, 'users')