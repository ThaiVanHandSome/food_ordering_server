import { Request, Response } from 'express'
import orderService from '~/services/order.service'
import { responseSuccess } from '~/utils/response'

export const addOrder = async (req: Request, res: Response) => {
  try {
    const orderRequest: OrderRequest = req.body
    const result = await orderService.addOrder(orderRequest)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getUserOrder = async (req: Request, res: Response) => {
  try {
    const { customer_id, customer_name, table_number } = req.query
    const result = await orderService.getUserOrder(
      customer_id as string,
      customer_name as string,
      parseInt(table_number as string)
    )
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}