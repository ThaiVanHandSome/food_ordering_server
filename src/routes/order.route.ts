import express from 'express'
import { addOrder, getStatisticsOrder, getUserOrder } from '~/controllers/order.controller'
import { wrapAsync } from '~/utils/response'

const router = express.Router()

router.post('/add', wrapAsync(addOrder))
router.get('/', wrapAsync(getUserOrder))
router.get('/statistics', wrapAsync(getStatisticsOrder))

export default router
