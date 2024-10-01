import express, { Application } from 'express'
import cors from 'cors'
import routes from '~/routes/index.route'

const app: Application = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

routes(app)

export default app
