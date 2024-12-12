const { Sequelize, Op } = require("sequelize");
const db = require("../models/index.js");
const { getAllNotificationRoomSetting } = require("./notificationRoomSettingService.js");
const { NotificationVisitStatus, Notification } = db;


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

const markAllNotiAsRecievied = async(userNotifierId, channelNotifierId) => {
  try {
    console.log(userNotifierId, channelNotifierId);

    const notifierRoom = (await getAllNotificationRoomSetting(userNotifierId, channelNotifierId)).data;

    if (notifierRoom.length == 0 ) {
      return {
        status: 200,
        data: [],
        message: 'This account unmuted all notification'
      }
    }

    // Lấy createdAt mới nhất từ NotificationVisitStatus
    const latestVisit = await NotificationVisitStatus.findOne({
      where: { userNotifierId: (channelNotifierId ?  null: userNotifierId), channelNotifierId },
      order: [['createdAt', 'DESC']],
    });

    const lastClickedAt = latestVisit ? latestVisit.createdAt : null;
    // Lấy danh sách notification thỏa mãn điều kiện
    const notificationsToMark = await Notification.findAll({
      where: {
        roomName: { [Op.in]: notifierRoom }, // Lọc roomName dựa trên notifierRooms
        ...(lastClickedAt && { createdAt: { [Op.gt]: lastClickedAt } }), // Nếu có lastClickedAt
      },
    });

    if (notificationsToMark.length === 0) {
      return {
        status: 200,
        data: [],
        message: 'No new notifications to mark as received.',
      };
    }

    // Tạo bản ghi mới trong NotificationVisitStatus
    const visitStatusData = notificationsToMark.map((notification) => ({
      notificationId: notification.id,
      userNotifierId: (channelNotifierId ?  null: userNotifierId),
      channelNotifierId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await NotificationVisitStatus.bulkCreate(visitStatusData);

    return {
      status: 200,
      message: 'Mark notificaiton VisitStatus successfully'
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

const markAllNotiAsRead = async (userNotifierId, channelNotifierId) => {
  try {
    // Cập nhật trạng thái thành 'read' trong NotificationVisitStatus
    await NotificationVisitStatus.update(
      { status: 'visited' }, // Trạng thái mới
      {
        where: {
          userNotifierId: channelNotifierId ? null : userNotifierId,
          channelNotifierId,
        },
      }
    );

    return {
      status: 200,
      message: "Marked notifications as read successfully."
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

const markOneNotiAsRead = async (notificationId) => {
   try {
    // Cập nhật trạng thái thành 'read' trong NotificationVisitStatus
    await NotificationVisitStatus.update(
      { status: 'visited' }, // Trạng thái mới
      {
        where: {
          notificationId,
        },
      }
    );

    return {
      status: 200,
      message: "Marked notifications as read successfully."
      };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      data: null,
      message: error.message,
    };
  }
}


const getUnReceiveNumOfNotification = async(userNotifierId, channelNotifierId) => {
  try {
    const notifierRoom =  (await getAllNotificationRoomSetting(userNotifierId, channelNotifierId)).data

    let whereClause;

    if(channelNotifierId) {
      whereClause = channelNotifierId
      ? `channelNotifierId = '${channelNotifierId}'`
      : `userNotifierId IS NULL`;
    } else {
      whereClause = `userNotifierId = '${userNotifierId}'`
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

    return {
      status: 200,
      data: {
        unRecievedCount,
      },
      message: 'Get unRecievedCount successfully'
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
  createNotificationVisitStatus,
  getAllNotificationVisitStatus,
  markAllNotiAsRecievied,
  markAllNotiAsRead,
  markOneNotiAsRead,
  getUnReceiveNumOfNotification
}
