const { Op } = require("sequelize");
const db = require("../models/index.js");
const { getAllNotificationRoomSetting } = require("./notificationRoomSettingService.js");
const { Notification, NotificationTranslation, User, Channel, NotificationEntity, NotificationVisitStatus, Comment, Video, Sequelize} = db;

const createNotification = async( entityName, entityAction, userActorId, channelActorId, recieverId, targetCommentId, targetVideoId ) => {
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

      const newNotification = await Notification.create({notificationEntityId: notificationEntity.id, userActorId, channelActorId, roomName, targetCommentId, targetVideoId});

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
    const notifierRoom =  (await getAllNotificationRoomSetting(userNotifierId, channelNotifierId)).data

    const whereClause = channelNotifierId
  ? `channelNotifierId = ${channelNotifierId}`
  : `userNotifierId IS NULL`;

  let notifierCondition = {};

  if (channelNotifierId) {
    // Nếu có channelNotifierId, chỉ tìm theo channelNotifierId
    notifierCondition.channelNotifierId = channelNotifierId;
  } else if (userNotifierId) {
    // Nếu không có channelNotifierId, tìm theo userNotifierId
    notifierCondition.userNotifierId = userNotifierId;
  }

    // 1. Đếm số thông báo chưa được nhận
    const unRecievedCount = await Notification.count({
      where: {
        roomName: { [Op.in]: notifierRoom },
        id: {
          [Op.notIn]: Sequelize.literal(`
            (
              SELECT notificationId
              FROM notificationVisitStatuses
              WHERE ${whereClause}
            )
          `),
        },
      },
    });
    // 2. Lấy danh sách thông báo
    const notifications = await Notification.findAll({
      where: {
        roomName: { [Op.in]: notifierRoom },
      },
      attributes: [
        "createdAt",
      ],
      include: [
        {
          model: NotificationVisitStatus,
          as: "visitStatus",
          where: {
            ...notifierCondition
          },
          attributes: ['status'],
          required: false, // LEFT JOIN
        },
        {
          model: NotificationEntity,
          as: "notificationEntity",
          attributes: ["id", "entityName"],
          include: [
            {
              model: NotificationTranslation,
              as: "notificationTranslation",
              attributes: ["translatedContent", "languageCode"]
            }
          ]
        },
        {
          model: User,
          as: "userActor",
          attributes: ["username", "avatar"]
        },
        {
          model: Channel,
          as: "channelActor",
          attributes: ["channelName", "avatar"]
        },
        {
          model: Comment,
          as: "targetComment",
          attributes: ["id", "content"]
        },
        {
          model: Video,
          as: "targetVideo",
          attributes: ["id", "title", "thumbnailUrl"]
        }
      ],
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: pageSize * 1,
    });

    return {
      status: 200,
      data: {
        notifications,
        unRecievedCount,
        pageSize,
        page,
      },
      message: 'Get list notificaiton successfully'
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


module.exports = {
  createNotification,
  getAllNotification
}
