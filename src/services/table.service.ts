import { STATUS } from '~/constants/httpStatus'
import { tableStatus } from '~/enums/tableStatus.enum'
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

const checkAvailableTable = async (table_number: number, token: string) => {
  try {
    const existTable = await TableModel.findOne({
      table_number,
      token
    }).lean()
    if (!existTable) {
      throw new ErrorHandler(STATUS.NOT_FOUND, 'Bàn không tồn tại')
    }
    if (existTable.current === existTable.capacity) {
      throw new ErrorHandler(STATUS.NOT_ACCEPTABLE, 'Bàn hiện tại đã đầy')
    }
    if (existTable.status === tableStatus.BOOKED) {
      throw new ErrorHandler(STATUS.NOT_ACCEPTABLE, 'Bàn đã được đặt trước')
    }
    await TableModel.findOneAndUpdate(
      {
        table_number,
        token
      },
      {
        $inc: { current: 1 }
      },
      {
        new: true
      }
    )
    const response = {
      message: 'Đăng nhập bàn thành công'
    }
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

export default { addTable, checkAvailableTable }
