import { UserModel } from '~/models'
import bcrypt from 'bcrypt'

const createUser = (userData: UserRequest) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email, password } = userData
      const existUser = await UserModel.findOne({ email })
      if (existUser)
        reject({
          message: 'User already exist'
        })

      const encryptPassword = bcrypt.hashSync(password, 12)
      const newUser = await UserModel.create({
        ...userData,
        password: encryptPassword,
        avatar: userData.cloudinaryUrl
      })
      resolve({
        message: 'Create user successfully',
        data: newUser
      })
    } catch (err) {
      reject(err)
    }
  })
}

export default { createUser }
