const { Sequelize } = require("sequelize");
const db = require("../models/index.js");
const { getAllCategoryWithView } = require("./categoryService.js");
const { listSubscribeOfChannel } = require("./channelService.js");
const { listSubscribeOfUser } = require("./userService.js");
const { NotificationRoomSetting, NotificationEntity } = db;


const updateNotificationRoomSetting = async(data) => {
  try {
    if(!data){
      return {
        status: 400,
        data: null,
        message: 'Req data cannot be empty'
      }
    }

    const newNotiRoomSetting = await NotificationRoomSetting.create(data)

    return {
      status: 200,
      data: newNotiRoomSetting,
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

const getAllNotificationRoomSetting = async (userId, channelId) => {
  try {
      let defaultRoomCondition = {};
      let disableRoomCondition = {};

      // Xác định điều kiện cho defaultRoom
      if (!channelId && userId) {
          defaultRoomCondition.role = 'user';
      } else if (channelId) {
          defaultRoomCondition.role = ['user', 'streamer'];
      }

      // Xác định điều kiện cho disableRoom
      if (userId) {
          disableRoomCondition = { userNotifierId: userId, isEnabled: false };
      } else if (channelId) {
          disableRoomCondition = { channelNotifierId: channelId, isEnabled: false };
      }

      // Lấy danh sách defaultRoom từ NotificationEntity
      const defaultRoom = await NotificationEntity.findAll({
          where: defaultRoomCondition,
          attributes: ["id", "role", "isDynamicRoomName", "roomNamePattern"]
      });

      // Lấy danh sách disableRoom từ NotificationRoomSetting
      const disableRoom = await NotificationRoomSetting.findAll({
          where: disableRoomCondition,
          attributes: ['notificationEntityId', 'updatedAt'], // Lấy thêm updatedAt
      });

      // Tạo danh sách các notificationEntityId bị disable
      const disabledIds = disableRoom.map((room) => room.dataValues.notificationEntityId);
      const disabledMap = new Map(
          disableRoom.map((room) => [room.dataValues.notificationEntityId, room.dataValues.updatedAt])
      );

      // Lọc defaultRoom để phân loại
      const isOnRooms = defaultRoom.filter((room) => !disabledIds.includes(room.id));
      const mutedRooms = defaultRoom.filter((room) => disabledIds.includes(room.id));

      // Lấy danh sách channelId
      const followedChannel = (await listSubscribeOfChannel(channelId)).data || (await listSubscribeOfUser(userId)).data;
      const channelIds = followedChannel.map(item => item.channelId);

      const isOnSet = new Set(); // Danh sách các phòng không bị tắt
      const mutedList = []; // Danh sách các phòng bị muted kèm updatedAt

      // Xử lý các phòng không bị tắt
      isOnRooms.forEach((room) => {
          let roomName = room.roomNamePattern;
          if (roomName.includes("{channelId}")) {
              channelIds.forEach(channel => {
                  let updatedRoomName = roomName.replace("{channelId}", channel);
                  isOnSet.add(updatedRoomName);
              });
          } else {
              let updatedRoomName = roomName.replace("{selfId}", channelId || userId || "");
              isOnSet.add(updatedRoomName);
          }
      });

      // Xử lý các phòng bị muted
      mutedRooms.forEach((room) => {
          let roomName = room.roomNamePattern;
          if (roomName.includes("{channelId}")) {
              channelIds.forEach(channel => {
                  let updatedRoomName = roomName.replace("{channelId}", channel);
                  mutedList.push({
                      roomName: updatedRoomName,
                      updatedAt: disabledMap.get(room.id)
                  });
              });
          } else {
              let updatedRoomName = roomName.replace("{selfId}", channelId || userId || "");
              mutedList.push({
                  roomName: updatedRoomName,
                  updatedAt: disabledMap.get(room.id)
              });
          }
      });

      return {
          status: 200,
          data: {
              isOn: Array.from(isOnSet), // Chuyển Set thành mảng
              muted: mutedList, // Trả về danh sách muted có updatedAt
          },
          message: 'Get list notification room names successfully',
      };
  } catch (error) {
      return {
          status: 500,
          data: null,
          message: error.message,
      };
  }
};


module.exports = {
  getAllNotificationRoomSetting,
  updateNotificationRoomSetting
}
