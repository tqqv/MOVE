const db = require("../models/index.js");
const { Category, CategoryFollow, Video, Livestream, sequelize } = db;

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
    const updateCate = await category.update(data)
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

    const video = await Video.findOne({where: {categoryId: cateId}})
    const livestream = await Livestream.findOne({where: {categoryId: cateId}})

    if(video || livestream){
      return {
        status: 400,
        message: "This category is in use by a video or livestream."
      }
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

const getAllCategoryWithView = async() => {
  try {
    const listCate = await Category.findAll({
      attributes: [
        'imgUrl',
        'title',
        'description',
        'createdAt',
        'updatedAt',
        'id',
        [sequelize.fn('SUM', sequelize.col('categoryVideos.viewCount')), 'totalViews']
      ],
      include: [
        {
          model: Video,
          as: 'categoryVideos',
          attributes: [],
        }
      ],
      group: ['Category.id'],
      order: [[sequelize.col('totalViews'), 'DESC']],
    })

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

const getCateByTitle = async (title) => {
  try {
    const cate = await Category.findAll({
      where: { title: title },
      attributes: [
        'id',
        'imgUrl',
        'title',
        [sequelize.fn('SUM', sequelize.fn('DISTINCT', sequelize.col('categoryVideos.viewCount'))), 'totalViews'],
        [
          sequelize.literal(`(
            SELECT Count(categoryId)
            FROM categoryFollows
            WHERE categoryFollows.categoryId = Category.id
          )`),
          'followerCount'
        ],
      ],
      include: [
        {
          model: Video,
          as: 'categoryVideos',
          attributes: [],
        },
        {
          model: CategoryFollow,
          as: 'cateFollow',
          attributes: [],
        },
      ],
      group: ['Category.id', 'Category.imgUrl', 'Category.title'],
    });

    if (!cate || cate.length < 1) {
      return {
        status: 404,
        data: null,
        message: "Category not found."
      };
    }

    return {
      status: 200,
      data: cate,
      message: "Get infor cate successfully."
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const getAllCategoryAdmin = async(page, pageSize) => {
  try {
    const listCate = await Category.findAndCountAll({
      attributes: [
        'id',
        'imgUrl',
        'title',
        'description',
        'createdAt',
        'updatedAt',
        [sequelize.literal(`(
          SELECT COUNT(*)
          FROM videos
          WHERE videos.categoryId = Category.id
        )`), 'videoCount'],
        [sequelize.literal(`(
          SELECT COUNT(*)
          FROM livestreams
          WHERE livestreams.categoryId = Category.id
        )`), 'livestreamCount'],
        [sequelize.literal(`(
          SELECT SUM(viewCount)
          FROM videos
          WHERE videos.categoryId = Category.id
        )`), 'totalViews'],
      ],
      order: [[sequelize.col('totalViews'), 'DESC']],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    return {
      status: 200,
      data: {
        listCate,
        totalPages: Math.ceil(listCate.count/pageSize)
      },
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

module.exports = {
  createCategory,
  getAllCategory,
  getCateById,
  editCategory,
  deleteCategory,
  getAllCategoryWithView,
  getCateByTitle,
  getAllCategoryAdmin
}
