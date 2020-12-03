import * as restify from 'restify'
import * as mongoose from 'mongoose'
import { ModelRouter } from '../common/model-router'
import { Review } from './reviews.model'

class ReviewsRouter extends ModelRouter<Review>{
    
    constructor() {
        super(Review)
    }

    findById = (req, resp, next) => {
        this.model
            .findById(req.params.id)
            .populate('user', 'name')
            .populate('restaurant')
            .then(this.render(resp, next))
            .catch(next)
    }

    applyRoutes(application: restify.Server) {
        application.get('/reviews', this.findAll)
        application.get('/reviews/:id', [this.validateId, this.findById])
        application.post('/reviews', this.save)
        application.del('/reviews/:id', [this.validateId, this.delete])
    }
}

export const reviewsRouter = new ReviewsRouter()

