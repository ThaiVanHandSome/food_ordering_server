import express from 'express'
import { getAllCategories } from '~/controllers/category.controller'
import { wrapAsync } from '~/utils/response'

const router = express.Router()

router.get('/', wrapAsync(getAllCategories))

export default router
