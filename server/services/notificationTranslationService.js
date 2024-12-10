const { Sequelize } = require("sequelize");
const db = require("../models/index.js");
const { NotificationTranslation } = db;


const createNotificationTranslation = async(notificationEntityId, translations) => {

    try {
        if (!notificationEntityId || !translations || !Array.isArray(translations)) {
          return {
            status: 400,
            data: null,
            message: 'Invalid input: notificationEntityId and translations array are required',
          };
        }

        const newTranslations = translations.map((translation) => ({
          notificationEntityId,
          languageCode: translation.languageCode,
          translatedContent: translation.translatedContent,
        }));

        const createdTranslations = await NotificationTranslation.bulkCreate(newTranslations);

        return {
          status: 200,
          data: createdTranslations,
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


const getAllNotificationTranslation = async(page, pageSize) => {
  try {
    const notiEntities = await NotificationTranslation.findAll({
      offset: (page - 1) * pageSize,
      limit: pageSize * 1,
    })

    return {
      status: 200,
      data: notiEntities,
      message: 'Get list notificaiton Translation successfully'
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
  createNotificationTranslation,
  getAllNotificationTranslation
}
