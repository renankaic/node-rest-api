import * as restify from 'restify'
import * as mongoose from 'mongoose'
import { ModelRouter } from '../common/model-router'
import { Review } from './reviews.model'
import { authorize } from '../security/authz.handler'

class ReviewsRouter extends ModelRouter<Review>{
    
    constructor() {
        super(Review)
    }

    protected prepareOne(query: mongoose.DocumentQuery<Review, Review>): mongoose.DocumentQuery<Review, Review> {
        return query
                .populate('user', ['name', 'email'])
                .populate('restaurant')
    }

    envelope(document) {
        let resource = super.envelope(document)
        const restaurantId = document.restaurant._id ? document.restaurant._id : document.restaurant
        resource._links.restaurant = `/restaurants/${restaurantId}`
        return resource
    }

    applyRoutes(application: restify.Server) {
        application.get(`${this.basePath}`, this.findAll)
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById])

        application.post(`${this.basePath}`, [
            authorize('user'),
            this.save
        ])
        
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete])
    }
}

export const reviewsRouter = new ReviewsRouter()

