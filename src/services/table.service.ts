import { STATUS } from '~/constants/httpStatus'
import { TableModel } from '~/models'
import { ErrorHandler } from '~/utils/response'

const addTable = async (table: TableRequest) => {
  try {
    const { table_number } = table
    const existTable = await TableModel.findOne({ table_number })
    if (!existTable) {
      const newTable = await TableModel.create(table)
      const response = {
        message: 'Tạo bàn thành công',
        data: newTable
      }
      return response
    }
    throw new ErrorHandler(STATUS.NOT_ACCEPTABLE, 'Bàn đã tồn tại')
  } catch (error) {
    console.log(error)
    throw error
  }
}

export default { addTable }
