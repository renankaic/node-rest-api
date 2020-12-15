import "jest"
import * as request from 'supertest'

import {Server} from '../server/server'
import {environment} from '../common/environment'
import {usersRouter} from './users.router'
import {User} from './users.model'

let server: Server

beforeAll(() => {
    environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db'
    environment.server.port = process.env.SERVER_PORT || 3001
    server = new Server()
    return server
        .bootstrap([usersRouter])
        .then(() => User.remove({}).exec())
        .catch(console.error)                 
})

test('get /users', () => {
    return request('http://localhost:3001')
        .get('/users')
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
        })
        .catch(fail)
})

test('post /users', () => {
    return request('http://localhost:3001')
        .post('/users')
        .send({
            name: 'usuario1',
            email: 'usuario1@email.com',
            password: '123456',
            cpf: '597.719.810-80'
        })
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe('usuario1')
            expect(response.body.email).toBe('usuario1@email.com')
            expect(response.body.cpf).toBe('597.719.810-80')
            expect(response.body.password).toBeUndefined()
        })
        .catch(fail)
})

afterAll(() => {
    return server.shutdown()
})