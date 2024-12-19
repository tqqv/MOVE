const { Model, Sequelize } = require("sequelize");
const db = require("../models/index.js");
const { Category, CategoryFollow } = db;

const getCateFollowByUserIdService = async(userId) => {
  try {
    const followedCateList = await CategoryFollow.findAndCountAll({
        where: { userId },
        attributes: ["id", "createdAt"],
        include: [
            {
                model: Category,
                as: 'category',
                attributes: [
                  'id', 'title', 'imgUrl', 
                  [
                    Sequelize.literal(`(
                    SELECT SUM(viewCount) 
                    FROM videos 
                    WHERE videos.categoryId = category.id && status = 'public'
                    )`), 'totalViews'
                  ]
                ]
            }
        ],
        order: [["createdAt", "desc"]],
      });
    return {
      status: 200,
      data: followedCateList,
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
    getCateFollowByUserIdService
}
