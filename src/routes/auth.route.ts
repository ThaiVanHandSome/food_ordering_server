import express from 'express'
import { login, refreshToken } from '~/controllers/auth.controller'
import authMiddleware from '~/middlewares/auth.middleware'
import { wrapAsync } from '~/utils/response'

const router = express.Router()

router.use('/login', authMiddleware.authUserRules(), wrapAsync(login))
router.use('/refresh-token', wrapAsync(refreshToken))

export default router
