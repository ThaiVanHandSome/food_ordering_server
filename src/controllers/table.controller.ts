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

export const checkAvailableTable = async (req: Request, res: Response) => {
  try {
    const { table_number, token } = req.query
    console.log(table_number, token)

    const result = await tableService.checkAvailableTable(parseInt(table_number as string), token as string)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}
