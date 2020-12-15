import "jest"
import * as request from 'supertest'

test('get /users', () => {
    return request('http://localhost:3000')
        .get('/users')
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
        })
        .catch(fail)
})