import express from 'express'
import { addProduct, getProducts, increaseView } from '~/controllers/product.controller'
import { upload, uploadImageToCloudinary } from '~/middlewares/upload.middleware'
import { wrapAsync } from '~/utils/response'

const router = express.Router()

router.post('/create', upload.single('image'), uploadImageToCloudinary, wrapAsync(addProduct))
router.get('/', wrapAsync(getProducts))
router.post('/:id/increase-view', wrapAsync(increaseView))

export default router
