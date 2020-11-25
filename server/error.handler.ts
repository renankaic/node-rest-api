import * as restify from 'restify'

export const handleError = (req: restify.Request, resp: restify.Response, err, done) => {

    err.toJSON = () => {
        return {
            message: err.message
        }
    }

    done()

}