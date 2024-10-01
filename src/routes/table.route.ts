import express from 'express'
import { addTable } from '~/controllers/table.controller'
import { wrapAsync } from '~/utils/response'

const router = express.Router()

router.post('/create', wrapAsync(addTable))

export default router
