import express from 'express'
import { addTable, checkAvailableTable, deleteTable, getAllTables, updateTable } from '~/controllers/table.controller'
import { wrapAsync } from '~/utils/response'

const router = express.Router()

router.post('/', wrapAsync(addTable))
router.post('/check-available-table', wrapAsync(checkAvailableTable))
router.get('/', wrapAsync(getAllTables))
router.put('/:id', wrapAsync(updateTable))
router.delete('/:id', wrapAsync(deleteTable))

export default router
