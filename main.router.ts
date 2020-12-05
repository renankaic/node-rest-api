import * as restify from "restify";
import { Router } from "./common/router";
import { Restaurant } from "./restaurants/restaurants.model";
import { Review } from "./reviews/reviews.model";
import { User } from "./users/users.model";

class MainRouter extends Router {

    showHypermediaLinks = (req, resp, next) => {
        resp.json({
            users: `/${User.collection.name}`,
            restaurants: `/${Restaurant.collection.name}`,
            reviews: `/${Review.collection.name}`
        })
    }

    applyRoutes(application: restify.Server) {
        application.get('/', this.showHypermediaLinks)
    }    
}

export const mainRouter = new MainRouter()