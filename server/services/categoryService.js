const db = require("../models/index.js");
const { Category } = db;

const createCategory = async(data) => {
  try {
    if(!data.title || !data.imgUrl){
      return {
        status: 400,
        data: null,
        message: 'Cannot be empty'
      }
    }

    const newCate = await Category.create(data)

    return {
      status: 200,
      data: newCate,
      message: 'Created successfully'
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const getAllCategory = async() => {
  try {
    const listCate = await Category.findAll()

    return {
      status: 200,
      data: listCate,
      message: "Get list successfully."
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const getCateById = async(cateId) => {
  try {
    const category = await Category.findByPk(cateId)

    if(!category) {
      return {
        status: 400,
        data: null,
        message: "Category not found"
      }
    }

    return {
      status: 200,
      data: category,
      message: "Get cate successfully."
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const editCategory = async(cateId, data) => {
  try {
    // Tìm cate trong DB
    const category = await Category.findByPk(cateId)
    if(!category) {
      return {
        status: 400,
        data: null,
        message: "Category not found"
      }
    }
    // update cate trong db
    const updateCate = await user.update(data)
    if(!updateCate) {
      return {
        status: 400,
        data: null,
        message: "Edit failed." // update fail
      }
    }

    return {
      status: 200,
      data: updateCate,
      message: "Category edit successfully."
    }

  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const deleteCategory = async (cateId) => {
  try {
    const category = await Category.findByPk(cateId);
    if (!category) {
      return {
        status: 404,
        data: null,
        message: "Category not found."
      };
    }

    await category.destroy();

    return {
      status: 200,
      data: null,
      message: "Category deleted successfully."
    };

  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    };
  }
};

module.exports = {
  createCategory,
  getAllCategory,
  getCateById,
  editCategory,
  deleteCategory
}