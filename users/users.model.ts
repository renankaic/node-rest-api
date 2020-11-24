import * as mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    passwrod: {
        type: String,
        select: false
    }
})

export const User = mongoose.model('User', userSchema, 'users')