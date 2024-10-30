import express from 'express'
import { login, refreshToken } from '~/controllers/auth.controller'
import { wrapAsync } from '~/utils/response'

const router = express.Router()

router.post('/login', wrapAsync(login))
router.post('/refresh-token', wrapAsync(refreshToken))

export default router
