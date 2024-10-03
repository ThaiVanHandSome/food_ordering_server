import express from 'express'
import { addOrder, getUserOrder } from '~/controllers/order.controller'
import { wrapAsync } from '~/utils/response'

const router = express.Router()

router.post('/add', wrapAsync(addOrder))
router.get('/', wrapAsync(getUserOrder))

export default router
