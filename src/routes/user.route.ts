import express from 'express'
import { createUser, getUsers, updateUser } from '~/controllers/user.controller'
import authMiddleware from '~/middlewares/auth.middleware'
import { upload, uploadImageToCloudinary } from '~/middlewares/upload.middleware'
import { wrapAsync } from '~/utils/response'
const router = express.Router()

router.post(
  '/',
  authMiddleware.authUserRules(),
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  upload.single('avatar'),
  uploadImageToCloudinary,
  wrapAsync(createUser)
)
router.get('/', authMiddleware.verifyAccessToken, authMiddleware.verifyAdmin, wrapAsync(getUsers))
router.patch(
  '/:id',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  upload.single('avatar'),
  uploadImageToCloudinary,
  wrapAsync(updateUser)
)

export default router
