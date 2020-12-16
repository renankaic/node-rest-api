import "jest"
import * as request from 'supertest'

let address: string = (<any>global).address

test('get /reviews', () => {
    return request(address)
        .get('/reviews')
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
        })
        .catch(fail)
})

test('post /reviews', () => {
    const date = new Date()
    let userId
    let restaurantId

    request(address)
        .post('/users')
        .send({
            name: 'usuario-review',
            email: 'usuario-review@email.com',
            password: '123456'
        })
        .then(response => {
            userId = response.body._id
            return request(address)
                    .post('/restaurants')
                    .send({
                        name: "Review Restaurant"
                    })
        })
        .then(response => {
            restaurantId = response.body._id
            return request(address)
                .post('/reviews')
                .send({
                    date: date,
                    rating: 3,
                    comments: "OK",
                    restaurant: restaurantId,
                    user: userId
                })
                .then(response => {
                    expect(response.status).toBe(200)
                    expect(response.body._id).toBeDefined()
                    expect(response.body.date).toBe(date)
                    expect(response.body.rating).toBe(3)
                    expect(response.body.comments).toBe('OK')
                    expect(response.body.restaurant).toBe(restaurantId)
                    expect(response.body.user).toBe(userId)
                })

        })
        .catch(fail)
    
})

// test('get /reviews/aaaaa - not found', () => {
//     return request(address)
//         .get('/reviews/aaaaa')
//         .then(response => {
//             expect(response.status).toBe(404)
//         })
//         .catch(fail)
// })

// test('patch /reviews/:id', () => {
//     return request(address)
//         .post('/reviews')
//         .send({
//             name: 'usuario2',
//             email: 'usuario2@email.com',
//             password: '123456'
//         })
//         .then(response => {
//             return request(address)
//                 .patch(`/reviews/${response.body._id}`)
//                 .send({
//                     name: 'usuario2 - patch'
//                 })
//         })
//         .then(response => {
//             expect(response.status).toBe(200)
//             expect(response.body._id).toBeDefined()
//             expect(response.body.name).toBe('usuario2 - patch')
//             expect(response.body.email).toBe('usuario2@email.com')
//             expect(response.body.password).toBeUndefined()
//         })
//         .catch(fail)
// })