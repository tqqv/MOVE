const { Sequelize } = require("sequelize");
const db = require("../models/index.js");
const { NotificationEntity } = db;


const createNotificationEntity = async(data) => {
  try {
    if(!data){
      return {
        status: 400,
        data: null,
        message: 'Req data cannot be empty'
      }
    }

    const newNotiEntity = await NotificationEntity.create(data)

    return {
      status: 200,
      data: newNotiEntity,
      message: 'Created notificaiton entity successfully'
    }
  } catch (error) {
    console.log(error);

    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const getAllNotificationEntity = async(page, pageSize) => {
  try {
    const notiEntities = await NotificationEntity.findAll({
      offset: (page - 1) * pageSize,
      limit: pageSize * 1,
    })

    return {
      status: 200,
      data: notiEntities,
      message: 'Get list notificaiton entity successfully'
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
  createNotificationEntity,
  getAllNotificationEntity
}
