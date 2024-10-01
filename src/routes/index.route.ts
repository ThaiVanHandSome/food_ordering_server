import { Application } from 'express'
import UserRouter from './user.route'

const routes = (app: Application) => {
  app.use('/api/user', UserRouter)
}

export default routes
