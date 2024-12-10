const { Sequelize } = require("sequelize");
const db = require("../models/index.js");
const { NotificationVisitStatus } = db;


const createNotificationVisitStatus = async(userNotifierId, notifications) => {

    try {
        if (!notificationEntityId || !translations || !Array.isArray(translations)) {
          return {
            status: 400,
            data: null,
            message: 'Invalid input: notificationEntityId and translations array are required',
          };
        }

        const newVisitStatuss = translations.map((translation) => ({
          notificationEntityId,
          languageCode: translation.languageCode,
          translatedContent: translation.translatedContent,
        }));

        const createdVisitStatuss = await NotificationVisitStatus.bulkCreate(newVisitStatuss);

        return {
          status: 200,
          data: createdVisitStatuss,
          message: 'Created notification translations successfully',
        };
      } catch (error) {
        console.log(error);
        return {
          status: 500,
          data: null,
          message: error.message,
        };
      }
    };


const getAllNotificationVisitStatus = async(page, pageSize) => {
  try {
    const notiEntities = await NotificationVisitStatus.findAll({
      offset: (page - 1) * pageSize,
      limit: pageSize * 1,
    })

    return {
      status: 200,
      data: notiEntities,
      message: 'Get list notificaiton VisitStatus successfully'
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
  createNotificationVisitStatus,
  getAllNotificationVisitStatus
}
