import { CategoryModel } from '~/models'

const getAllCategories = async () => {
  try {
    const categories = await CategoryModel.find().lean()
    const response = {
      message: 'Lấy tất cả danh mục thành công',
      data: categories
    }
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

export default { getAllCategories }
