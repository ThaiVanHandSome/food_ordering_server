import express from 'express'
import { addTable, checkAvailableTable } from '~/controllers/table.controller'
import { wrapAsync } from '~/utils/response'

const router = express.Router()

router.post('/create', wrapAsync(addTable))
router.post('/check-available-table', wrapAsync(checkAvailableTable))

export default router
