import { STATUS } from '~/constants/httpStatus'
import { orderStatus } from '~/enums/orderStatus.enum'
import { OrderModel, ProductModel, TableModel } from '~/models'
import { ErrorHandler } from '~/utils/response'

const addOrder = async (orderRequest: OrderRequest) => {
  try {
    const { table_number, customer_name, customer_id, products } = orderRequest

    if (!table_number) {
      throw new ErrorHandler(STATUS.NOT_ACCEPTABLE, 'Chưa chọn bàn để đặt hàng')
    }

    const table = await TableModel.findOne({ table_number }).lean()
    if (!table) {
      throw new ErrorHandler(STATUS.NOT_ACCEPTABLE, 'Không tồn tại bàn này')
    }

    if (!customer_name) {
      throw new ErrorHandler(STATUS.NOT_ACCEPTABLE, 'Chưa có tên khách hàng')
    }

    if (!products || products.length === 0) {
      throw new ErrorHandler(STATUS.NOT_ACCEPTABLE, 'Chưa chọn sản phẩm để đặt hàng')
    }

    for (const product of products) {
      if (product.buy_count === 0 || !product.id) continue

      const newOrder = new OrderModel({
        table_number,
        customer_name,
        customer_id,
        product: product.id,
        buy_count: product.buy_count,
        status: product.status ?? orderStatus.IN_PROGRESS
      })

      await newOrder.save()

      await ProductModel.findByIdAndUpdate(product.id, {
        $inc: { sold: product.buy_count }
      })
    }

    return { message: 'Đặt hàng thành công' }
  } catch (error) {
    console.error(error)
    throw error
  }
}

const getUserOrder = async (customer_id: string, customer_name: string, table_number: number) => {
  try {
    let existOrders = await OrderModel.find({
      customer_id,
      customer_name,
      table_number
    }).populate('product')
    if (!existOrders) existOrders = []
    const response = {
      message: 'Lấy đơn hàng thành công',
      data: existOrders
    }
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

export default { addOrder, getUserOrder }
