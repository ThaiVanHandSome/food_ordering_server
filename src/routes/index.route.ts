import { Application } from 'express'
import UserRouter from './user.route'
import AuthRouter from './auth.route'
import ProductRouter from './product.route'
import TableRouter from './table.route'

const routes = (app: Application) => {
  app.use('/api/user', UserRouter)
  app.use('/api/auth', AuthRouter)
  app.use('/api/products', ProductRouter)
  app.use('/api/tables', TableRouter)
}

export default routes
