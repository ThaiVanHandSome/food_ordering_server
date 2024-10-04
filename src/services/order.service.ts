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

const getStatisticsOrder = async (query: StatisticOrderQuery) => {
  try {
    let { page = 1, limit = 6, customer_name, table_number, status } = query
    console.log(customer_name)

    page = Number(page)
    limit = Number(limit)
    table_number = parseInt(table_number as string)
    let condition = {}
    if (customer_name) {
      condition = {
        ...condition,
        customer_name
      }
    }
    if (table_number) {
      condition = {
        ...condition,
        table_number
      }
    }
    const res = {
      tables: [],
      orders: [],
      cntInprogressOrder: 0,
      cntCookingOrder: 0,
      cntRejectedOrder: 0,
      cntServedOrder: 0,
      cntPaidOrder: 0
    }
    const tables = await TableModel.find().lean()
    for (const table of tables) {
      const cntInprogressOrder = await OrderModel.find({
        table_number: table.table_number,
        status: orderStatus.IN_PROGRESS
      })
        .countDocuments()
        .lean()

      const cntCookingOrder = await OrderModel.find({
        table_number: table.table_number,
        status: orderStatus.COOKING
      })
        .countDocuments()
        .lean()

      const cntRejectedOrder = await OrderModel.find({
        table_number: table.table_number,
        status: orderStatus.REJECTED
      })
        .countDocuments()
        .lean()

      const cntServedOrder = await OrderModel.find({
        table_number: table.table_number,
        status: orderStatus.SERVED
      })
        .countDocuments()
        .lean()

      const cntPaidOrder = await OrderModel.find({
        table_number: table.table_number,
        status: orderStatus.SERVED
      })
        .countDocuments()
        .lean()
      const tableRes = {
        tableNumber: table.table_number,
        cntInprogressOrder,
        cntCookingOrder,
        cntRejectedOrder,
        cntServedOrder,
        cntPaidOrder
      }
      res.tables.push(tableRes as never)
    }

    res.cntInprogressOrder = await OrderModel.find({
      status: orderStatus.IN_PROGRESS,
      ...condition
    })
      .countDocuments()
      .lean()

    res.cntCookingOrder = await OrderModel.find({
      status: orderStatus.COOKING,
      ...condition
    })
      .countDocuments()
      .lean()

    res.cntRejectedOrder = await OrderModel.find({
      status: orderStatus.REJECTED,
      ...condition
    })
      .countDocuments()
      .lean()

    res.cntServedOrder = await OrderModel.find({
      status: orderStatus.SERVED,
      ...condition
    })
      .countDocuments()
      .lean()

    res.cntPaidOrder = await OrderModel.find({
      status: orderStatus.PAID,
      ...condition
    })
      .countDocuments()
      .lean()

    if (status) {
      condition = {
        ...condition,
        status
      }
    }
    const orders = await OrderModel.find(condition)
      .populate('product')
      .sort({ createdAt: -1 })
      .skip(page * limit - limit)
      .limit(limit)
    const totalProducts = await OrderModel.find(condition).countDocuments().lean()
    const page_size = Math.ceil(totalProducts / limit) || 1
    res.orders = orders as never
    const response = {
      message: 'Lọc đơn hàng thành công',
      data: {
        content: res,
        pagination: {
          page,
          limit,
          pageSize: page_size,
          total: totalProducts
        }
      }
    }
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

export default { addOrder, getUserOrder, getStatisticsOrder }
