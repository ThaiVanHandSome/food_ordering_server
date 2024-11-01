import { STATUS } from '~/constants/httpStatus'
import { TokenModel, UserModel } from '~/models'
import { compareValue } from '~/utils/crypt'
import { signToken, verifyToken } from '~/utils/jwt'
import { ErrorHandler } from '~/utils/response'
import dotenv from 'dotenv'
import { omit } from 'lodash'
import { tokenTypes } from '~/enums/token.enum'
import { v4 as uuidv4 } from 'uuid'

dotenv.config()

const login = async (loginData: Login) => {
  try {
    const { email, password } = loginData
    const existUser = await UserModel.findOne({ email }).lean()
    if (!existUser) {
      throw new ErrorHandler(STATUS.NOT_FOUND, {
        email: 'Email không tồn tại trong hệ thống'
      })
    }
    const match = compareValue(password, existUser.password)
    if (!match) {
      throw new ErrorHandler(STATUS.NOT_FOUND, {
        password: 'Password không chính xác'
      })
    }
    const payloadToken: PayloadToken = {
      email,
      role: existUser.role
    }
    const accessToken = await signToken(payloadToken, process.env.EXPIRE_ACCESS_TOKEN as string)
    const refreshToken = uuidv4()
    await new TokenModel({
      token: refreshToken,
      user: existUser._id,
      type: tokenTypes.REFRESH
    }).save()

    const response = {
      message: 'Đăng nhập thành công',
      data: {
        accessToken,
        refreshToken,
        user: omit(existUser, ['password'])
      }
    }
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

const refreshToken = async (refreshToken: string) => {
  try {
    const existRefreshToken = await TokenModel.findOne({
      token: refreshToken
    })
    if (!existRefreshToken) {
      throw new ErrorHandler(STATUS.UNAUTHORIZED, 'Token không tồn tại')
    }
    const decoded = (await verifyToken(refreshToken)) as PayloadToken
    const user = await UserModel.findOne({
      email: decoded.email
    })
    if (user) {
      const payload: PayloadToken = {
        email: user.email,
        role: user.role
      }
      const newAccessToken = await signToken(payload, process.env.EXPIRE_ACCESS_TOKEN as string)
      const response = {
        message: 'Refresh token thành công',
        data: {
          accessToken: newAccessToken
        }
      }
      return response
    }
    throw new ErrorHandler(STATUS.UNAUTHORIZED, 'Refresh Token không tồn tại')
  } catch (error) {
    console.log(error)
    throw error
  }
}

export default { login, refreshToken }
