import express from 'express'
import { createUser } from '~/controllers/user.controller'
import { upload, uploadImageToCloudinary } from '~/middlewares/upload.middleware'
import userMiddleware from '~/middlewares/user.middleware'
import { wrapAsync } from '~/utils/response'
const router = express.Router()

router.post(
  '/create',
  userMiddleware.createUserRules(),
  upload.single('avatar'),
  uploadImageToCloudinary,
  wrapAsync(createUser)
)

export default router
