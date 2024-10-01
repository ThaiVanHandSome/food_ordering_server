import { body } from 'express-validator'

const createUserRules = () => {
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

export default { createUserRules }
