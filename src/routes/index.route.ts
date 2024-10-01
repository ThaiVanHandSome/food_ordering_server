import { Application } from 'express'
import UserRouter from './user.route'
import AuthRouter from './auth.route'

const routes = (app: Application) => {
  app.use('/api/user', UserRouter)
  app.use('/api/auth', AuthRouter)
}

export default routes
