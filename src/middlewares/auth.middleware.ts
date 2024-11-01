import { NextFunction, Request, Response } from 'express'
import { body } from 'express-validator'
import { STATUS } from '~/constants/httpStatus'
import { ROLE } from '~/enums/role.enum'
import { verifyToken } from '~/utils/jwt'
import { ErrorHandler } from '~/utils/response'

const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = await req.headers.authorization?.replace('Bearer ', '')

  if (accessToken) {
    try {
      const decoded = (await verifyToken(accessToken)) as PayloadToken
      if (decoded) return next()
      throw new ErrorHandler(STATUS.UNAUTHORIZED, 'Không tồn tại token')
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  throw new ErrorHandler(STATUS.UNAUTHORIZED, 'Token chưa được gửi đi')
}

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = await req.headers.authorization?.replace('Bearer ', '')
  if (accessToken) {
    try {
      const decoded = (await verifyToken(accessToken)) as PayloadToken
      if (decoded.role === ROLE.ADMIN || decoded.role === ROLE.EMPLOYEE) return next()
      throw new ErrorHandler(STATUS.UNAUTHORIZED, 'Bạn không có quyền')
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  throw new ErrorHandler(STATUS.UNAUTHORIZED, 'Token chưa được gửi đi')
}

const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = await req.headers.authorization?.replace('Bearer ', '')
  if (accessToken) {
    try {
      const decoded = (await verifyToken(accessToken)) as PayloadToken
      console.log(decoded)

      if (decoded.role === 'ADMIN') return next()
      throw new ErrorHandler(STATUS.UNAUTHORIZED, 'Bạn không có quyền')
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  throw new ErrorHandler(STATUS.UNAUTHORIZED, 'Token chưa được gửi đi')
}

const authUserRules = () => {
  return [
    body('email')
      .isEmail()
      .withMessage('Email không đúng định dạng')
      .isLength({ min: 5, max: 160 })
      .withMessage('Email phải từ 5-160 kí tự'),
    body('password')
      .exists({ checkFalsy: true })
      .withMessage('Mật khẩu không được để trống')
      .isLength({ min: 6, max: 160 })
      .withMessage('Mật khẩu phải từ 6-160 kí tự')
  ]
}

export default { authUserRules, verifyAccessToken, verifyAdmin, verifyUser }
