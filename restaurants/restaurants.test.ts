import "jest"
import * as request from 'supertest'

let address: string = (<any>global).address

test('get /restaurants', () => {
    return request(address)
        .get('/restaurants')
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
        })
})

test('post /restaurants', () => {
    return request(address)
        .post('/restaurants')
        .send({
            name: "Restaurant POST test"
        })
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe("Restaurant POST test")
            expect(response.body.menu).toBeInstanceOf(Array)
        })
        .catch(fail)
})

test('get /restaurants/aaaa - not found', () => {
    return request(address)
        .get('/restaurants/aaaa')
        .then(response => {
            expect(response.status).toBe(404)
        })
        .catch(fail)
})

test('patch /restaurants', () => {
    let restaurantId
    return request(address)
        .post('/restaurants')
        .send({
            name: "Restaurant PATCH test"
        })
        .then(response => {
            restaurantId = response.body._id
            return request(address)
                .patch(`/restaurants/${restaurantId}`)
                .send({
                    name: "Restaurant PATCH OK"
                })
        })
        .then(response => {
            expect(response.body._id).toBe(restaurantId)
            expect(response.body.name).toBe("Restaurant PATCH OK")
        })
        .catch(fail)
})

test('add menu item to restaurant and checks its menu', () => {
    let restaurantId
    return request(address)
        .post('/restaurants')
        .send({
            name: "Restaurant with menu items"
        })
        .then(response => {
            restaurantId = response.body._id
            expect(response.body.menu.length).toBe(0)

            return request(address)
                .put(`/restaurants/${restaurantId}/menu`)
                .send([
                    { name: 'X-Burger', price: 12.50 },
                    { name: 'X-Salad', price: 15.90 }
                ])
        })
        .then(response => {
            expect(response.body).toBeInstanceOf(Array)
            expect(response.body.length).toBe(2)

            return request(address)
                .get(`/restaurants/${restaurantId}/menu`)                
        })
        .then(response => {
            expect(response.body).toBeInstanceOf(Array)
            expect(response.body.length).toBe(2)
        })
        .catch(fail)
})