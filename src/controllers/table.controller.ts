import { Request, Response } from 'express'
import tableService from '~/services/table.service'
import { responseSuccess } from '~/utils/response'

export const addTable = async (req: Request, res: Response) => {
  try {
    const table: TableRequest = req.body
    const result = await tableService.addTable(table)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}
