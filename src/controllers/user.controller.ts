import { Request, Response } from 'express'
import userService from '~/services/user.service'

export const createUser = async (req: Request, res: Response) => {
  try {
    const user: UserRequest = req.body
    const result = await userService.createUser(user)
    return res.status(201).json(result)
  } catch (error) {
    const err = error as Error
    return res.status(404).json({
      message: err.message
    })
  }
}
