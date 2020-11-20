import { Router } from '../common/router'
import * as restify from 'restify'

class UsersRouter extends Router {

    applyRoutes(application: restify.Server ) {
        application.get('/users', (req, resp, next) => {
            resp.json({ message: 'users router'})
        })
    }

}

export const usersRouter = new UsersRouter()