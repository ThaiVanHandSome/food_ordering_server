import { STATUS } from '~/constants/httpStatus'
import { ProductModel } from '~/models'
import { ErrorHandler } from '~/utils/response'

const addProduct = async (product: ProductRequest) => {
  try {
    const { name } = product
    const existProduct = await ProductModel.findOne({ name })
    if (!existProduct) {
      const newProduct = await ProductModel.create({
        ...product,
        image: product.cloudinaryUrl
      })
      const response = {
        message: 'Tạo sản phẩm thành công',
        data: newProduct
      }
      return response
    }
    throw new ErrorHandler(STATUS.UNPROCESSABLE_ENTITY, {
      name: 'Tên sản phẩm này đã tồn tại'
    })
  } catch (error) {
    console.log(error)
    throw error
  }
}

const getProducts = async (query: ProductQuery) => {
  try {
    let { page = 1, limit = 6, name, categoryId, priceMax, priceMin, sortBy = 'createdAt', order = 'asc' } = query
    page = Number(page)
    limit = Number(limit)
    let condition: any = {}
    if (categoryId) {
      condition.category = categoryId
    }
    if (priceMax) {
      condition.price = {
        $lte: priceMax
      }
    }
    if (priceMin) {
      condition.price = condition.price
        ? {
            ...condition.price,
            $gte: priceMin
          }
        : {
            $gte: priceMin
          }
    }
    if (name) {
      condition.name = {
        $regex: name,
        $options: 'i'
      }
    }

    let [products, totalProducts]: [products: any, totalProducts: any] = await Promise.all([
      ProductModel.find(condition)
        .populate({
          path: 'category'
        })
        .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
        .skip(page * limit - limit)
        .limit(limit)
        .select({
          __v: 0
        })
        .lean(),
      ProductModel.find(condition).countDocuments().lean()
    ])
    const page_size = Math.ceil(totalProducts / limit) || 1
    const response = {
      message: 'Lấy sản phẩm thành công',
      data: {
        content: products,
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

const increaseView = async (productId: string) => {
  try {
    const existProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        $inc: { view: 1 }
      },
      { new: true }
    )
    if (!existProduct) {
      throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy sản phẩm')
    }
    const response = {
      message: 'Tăng view cho sản phẩm thành công',
      data: existProduct
    }
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

export default { addProduct, getProducts, increaseView }
