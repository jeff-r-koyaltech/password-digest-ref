import express from 'express'
import digestMiddleware from './digest-middleware'

const app = express()

// password digest authentication
digestMiddleware.useAuth(app)

// RESTful / JSON body support
app.use(express.json())

// routing setup
// const payments = require('./payments')
// payments.registerRoutes(app)

let server = app.listen(process.env.SERVER_PORT || 8081)

appDebug('Running...')

export default server
