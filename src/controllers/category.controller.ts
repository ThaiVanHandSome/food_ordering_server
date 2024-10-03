import { Request, Response } from 'express'
import categoryService from '~/services/category.service'
import { responseSuccess } from '~/utils/response'

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const result = await categoryService.getAllCategories()
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}
