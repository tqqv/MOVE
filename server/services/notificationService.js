const { Sequelize } = require("sequelize");
const db = require("../models/index.js");
const { getAllNotificationRoomSetting } = require("./notificationRoomSettingService.js");
const { Notification, NotificationTranslation, User, Channel, NotificationEntity } = db;

const createNotification = async( entityName, entityAction, userActorId, channelActorId, recieverId ) => {
    try {
      // Luồng update db
      const notificationEntity = await NotificationEntity.findOne({
        where: {
          entityName,
          action: entityAction
        },
        attributes: ["id", "roomNamePattern"]
      });
      const roomName = notificationEntity.roomNamePattern.replace("{selfId}", recieverId)

      const newNotification = await Notification.create({notificationEntityId: notificationEntity.id, userActorId, channelActorId, roomName});

      const newNotificationWithFullData = await NotificationTranslation.findOne(
        {
          where: {
            notificationEntityId: notificationEntity.id,
            languageCode: "en"
          },
          attributes: ["languageCode", "translatedContent"]
        }
      );

      let actorInfo = {};
      if (userActorId) {
          actorInfo.user = await User.findOne({
              where: { id: userActorId },
              attributes: ["avatar", "username"]
          });
      }

      // Lấy thông tin của channelActorId từ bảng Channels (nếu có)
      if (channelActorId) {
          actorInfo.channel = await Channel.findOne({
              where: { id: channelActorId },
              attributes: ["avatar", "channelName"]
          });
      }
      const fullData = {
        ...(newNotificationWithFullData?.dataValues || {}),
        ...(newNotification?.dataValues || {}),
        ...(actorInfo.user ? { user: actorInfo.user.dataValues } : {}),
        ...(actorInfo.channel ? { channel: actorInfo.channel.dataValues } : {}),
      };

      console.log(fullData);

      /// Luồng realtime
      _io.to(roomName).emit('notifications', fullData);

      return {
          status: 200,
          data: newNotification,
          message: 'Created notification successfully',
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


const getAllNotification = async(userNotifierId, channelNotifierId, page, pageSize) => {
  try {
    // điều kiện
    const recievedRooms =  await getAllNotificationRoomSetting(userNotifierId, channelNotifierId)

    const notifications = await Notification.findAll({

      offset: (page - 1) * pageSize,
      limit: pageSize * 1,
    })

    return {
      status: 200,
      data: notifications,
      message: 'Get list notificaiton successfully'
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
  createNotification,
  getAllNotification
}
