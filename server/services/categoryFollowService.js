const { Model } = require("sequelize");
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
                attributes: ['id', 'title']
            }
        ],
        order: [[sortCondition.sortBy, sortCondition.order]],
        offset: (page - 1) * pageSize,
        limit: pageSize * 1,
      });
    return {
      status: 200,
      data: {
        followedCateList,
        totalPages: Math.ceil(followedCateList.count / pageSize)
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
    getCateFollowByUserIdService
}
