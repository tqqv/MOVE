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
      const roomName = notificationEntity.roomNamePattern.replace("{selfId}", recieverId).replace("{channelId}", recieverId)

      const newNotification = await Notification.create({notificationEntityId: notificationEntity.id, userActorId, channelActorId, roomName, targetCommentId, targetVideoId});

      const fullNotification = await Notification.findOne({
        where: {
          id: newNotification.dataValues.id
        },
        attributes: [
          "createdAt", "id"
        ],
        include: [
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
            attributes: ["channelName", "avatar"],
            include: [
              {
                model: User,
                attributes: ['username']
              }
            ]
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
        ]
      })

      /// Luồng realtime
      _io.to(roomName).emit('notifications', formatNotificationData(fullNotification));

      return {
          status: 200,
          data: fullNotification,
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

const formatNotificationData = (item) => {
  let notificationTranslation = item.notificationEntity?.notificationTranslation.map(translation => {
    return {
      translatedContent: translation.dataValues.translatedContent,
      languageCode: translation.dataValues.languageCode
    }
  })

  return ({
      id: item.id,
      createdAt: item.createdAt,
      visitStatus: [],
      notificationEntity: {
          id: item.notificationEntity?.dataValues?.id || null,
          entityName: item.notificationEntity?.dataValues?.entityName || null,
          notificationTranslation: [...notificationTranslation]
      },
      userActor: item.userActor ? {
        username: item.userActor.dataValues.username,
        avatar: item.userActor.dataValues.avatar
      } : null, // Assuming no data available for userActor

      channelActor: item.channelActor ? {
          channelName: item.channelActor.dataValues.channelName,
          avatar: item.channelActor.dataValues.avatar,
          User: {
              username: item.channelActor.dataValues.User?.dataValues?.username || null
          }
      } : null,
      targetComment: item.targetComment || null,
      targetVideo: item.targetVideo ? {
          id: item.targetVideo.dataValues.id,
          title: item.targetVideo.dataValues.title,
          thumbnailUrl: item.targetVideo.dataValues.thumbnailUrl
      } : null
  });
}

const getAllNotification = async(userNotifierId, channelNotifierId, page, pageSize) => {
  try {
    // điều kiện
    const notifierRoom =  (await getAllNotificationRoomSetting((channelNotifierId ? null : userNotifierId) , channelNotifierId)).data
    console.log(notifierRoom);
    
    let notifierCondition = {};

    if (channelNotifierId) {
      // Nếu có channelNotifierId, chỉ tìm theo channelNotifierId
      notifierCondition.channelNotifierId = channelNotifierId;
    } else if (userNotifierId) {
      // Nếu không có channelNotifierId, tìm theo userNotifierId
      notifierCondition.userNotifierId = userNotifierId;
    }

    const roomConditions = {
      [Op.or]: [
        { roomName: { [Op.in]: notifierRoom.isOn } }, // Active rooms
        notifierRoom.muted.length > 0
          ? {
              [Op.and]: [
                { roomName: { [Op.in]: notifierRoom.muted.map((room) => room.roomName) } }, // Muted rooms
                { 
                  updatedAt: { 
                    [Op.lt]: Math.min(...notifierRoom.muted.map((room) => new Date(room.updatedAt))) 
                  } 
                } // Notifications older than the muted room's updatedAt
              ]
            }
          : null // No muted conditions if muted is empty
      ].filter(Boolean) // Remove null conditions
    };

    // Lấy danh sách thông báo
    const notifications = await Notification.findAndCountAll({
      distinct: true,
      where: roomConditions,
      attributes: [
        "id",
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
          attributes: ["channelName", "avatar"],
          include: [
            {
              model: User,
              attributes: ['username']
            }
          ]
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
        totalPages: Math.ceil(notifications.count/pageSize),
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

const getUnReadNotification = async(userNotifierId, channelNotifierId, page, pageSize) => {
  try {

    // điều kiện
    const notifierRoom =  (await getAllNotificationRoomSetting((channelNotifierId ? null : userNotifierId), channelNotifierId)).data
    const roomConditions = {
      [Op.or]: [
          { roomName: { [Op.in]: notifierRoom.isOn } }, // Các phòng đang bật
          {
              [Op.and]: [
                  { roomName: { [Op.in]: notifierRoom.muted.map((room) => room.roomName) } }, // Các phòng bị muted
                  { updatedAt: { [Op.in]: notifierRoom.muted.map((room) => room.updatedAt) } } // Với updatedAt tương ứng
              ]
          }
      ]
    };

    let userOrChannelCondition;
    if (channelNotifierId) {
      userOrChannelCondition = {
        channelNotifierId,
      };
    } else {
      userOrChannelCondition = {
        userNotifierId: userNotifierId,
      };
    }

    const unReadNoti = await Notification.findAndCountAll({
      distinct: true,
      where: roomConditions,
      attributes: [
        "id",
        "createdAt",
      ],
      include: [
        {
          model: NotificationVisitStatus,
          as: "visitStatus",
          attributes: ["status"],
          where: {
            status: "recieved",
            ...userOrChannelCondition
          }
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
          attributes: ["channelName", "avatar"],
          include: [
            {
              model: User,
              attributes: ['username']
            }
          ]
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
    })
    return {
      status: 200,
      data: {notifications: unReadNoti,
        totalPages: Math.ceil(unReadNoti.count / pageSize),
        page,
        pageSize,
      },
      message: "Get unread notification succeesfully!"
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
  getAllNotification,
  getUnReadNotification
}
