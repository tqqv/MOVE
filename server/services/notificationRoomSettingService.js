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
            attributes: ['notificationEntityId'], // Chỉ lấy notificationEntityId
        });

        // Tạo danh sách các notificationEntityId bị disable
        const disabledIds = disableRoom.map((room) => room.notificationEntityId);

        // Lọc defaultRoom để loại bỏ các phòng bị disable
        const filteredRooms = defaultRoom.filter(
            (room) => !disabledIds.includes(room.id)
        );

        // Lấy danh sách channelId
        const followedChannel = (await listSubscribeOfChannel(channelId)).data || (await listSubscribeOfUser(userId)).data;
        const channelIds = followedChannel.map(item => item.channelId);

        const roomNameSet = new Set(); // Dùng Set để loại bỏ trùng lặp
        filteredRooms.forEach((room) => {
            let roomName = room.roomNamePattern;

            // Nếu roomNamePattern chứa {channelId}, mới tiếp tục xử lý
            if (roomName.includes("{channelId}")) {
                // Lặp qua các channelIds và thay thế {channelId} trong roomNamePattern
                channelIds.forEach(channel => {
                    let updatedRoomName = roomName.replace("{selfId}", userId || "");
                    updatedRoomName = updatedRoomName.replace("{channelId}", channel);
                    roomNameSet.add(updatedRoomName); // Thêm vào Set để tự động loại bỏ trùng lặp
                });
            } else {
                // Nếu roomNamePattern không chứa {channelId}, chỉ thay thế {selfId}
                let updatedRoomName = roomName.replace("{selfId}", channelId || userId || "");
                roomNameSet.add(updatedRoomName); // Thêm vào Set
            }
        });

        return {
            status: 200,
            data: Array.from(roomNameSet), // Chuyển Set thành mảng
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
