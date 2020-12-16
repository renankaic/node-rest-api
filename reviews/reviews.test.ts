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
    const date: Date = new Date()
    let userId
    let restaurantId

    return request(address)
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
                    comments: "Nice restaurant",
                    restaurant: restaurantId,
                    user: userId
                })
                .then(response => {
                    expect(response.status).toBe(200)
                    expect(response.body._id).toBeDefined()
                    expect(response.body.date).toBe(date.toISOString())
                    expect(response.body.rating).toBe(3)
                    expect(response.body.comments).toBe("Nice restaurant")
                    expect(response.body.restaurant).toBe(restaurantId)
                    expect(response.body.user).toBe(userId)
                })

        })
        .catch(fail)
    
})

test('get /reviews/aaaaa - not found', () => {
    return request(address)
        .get('/reviews/aaaaa')
        .then(response => {
            expect(response.status).toBe(404)
        })
        .catch(fail)
})

test('patch /reviews/:id - not allowed', () => {
    let date: Date = new Date()
    let userId
    let restaurantId
    let reviewId

    return request(address)
        .post('/users')
        .send({
            name: 'usuario-review-patch',
            email: 'usuario-review-patch@email.com',
            password: '123456'
        })
        .then(response => {
            userId = response.body._id
            return request(address)
                .post('/restaurants')
                .send({
                    name: "Review Restaurant Patch Test"
                })
        })
        .then(response => {
            restaurantId = response.body._id
            return request(address)
                .post('/reviews')
                .send({
                    date: date,
                    rating: 4,
                    comments: "Review Patch Not Allowed",
                    restaurant: restaurantId,
                    user: userId
                })
                .then(response => {
                    reviewId = response.body._id
                    date = new Date()

                    return request(address)
                        .patch(`/reviews/${reviewId}`)
                        .send({
                            date,
                            comments: "Patch Not Allowed",
                            rating: 5
                        })
                })
                .then(response => {
                    expect(response.status).toBe(405) //Not allowed
                })

        })
        .catch(fail)
})