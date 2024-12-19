const { Sequelize, Op } = require("sequelize");
const db = require("../models/index.js");
const { getAllCategoryWithView } = require("./categoryService.js");
const { listSubscribeOfChannel } = require("./channelService.js");
const { listSubscribeOfUser } = require("./userService.js");
const { NotificationRoomSetting, NotificationEntity } = db;


async function updateNotificationRoomSetting(userNotifierId, channelNotifierId, data) {
    try {
      // Lấy danh sách notification entities
      const notificationEntities = await NotificationEntity.findAll({
        attributes: ['id', 'entityName']
      });

      if (notificationEntities.length === 0) {
        return {
          status: 404,
          data: null,
          message: 'No matching notification entities found'
        };
      }

      // Lấy danh sách entityId
      const entityIds = notificationEntities.map(entity => entity.dataValues.id);
      console.log(userNotifierId, channelNotifierId);

      console.log("nè: ", userNotifierId);
      console.log("nè: ", channelNotifierId);

      // Lấy settings hiện tại từ NotificationRoomSetting
      const existingSettings = await NotificationRoomSetting.findAll({
        where: {
          userNotifierId: channelNotifierId ? null : userNotifierId,
          channelNotifierId,
          notificationEntityId: { [Op.in]: entityIds }
        }
      });

      const existingSettingsMap = Object.fromEntries(
        existingSettings.map(setting => [setting.dataValues.notificationEntityId, setting])
      );

      // Chuẩn bị dữ liệu để cập nhật và thêm mới
      const settingsToUpdate = [];
      const settingsToInsert = [];

      // Kiểm tra logic "all"
      const allSetting = data.find(item => item.all !== undefined);
      const allValue = allSetting ? allSetting.all : null;

      notificationEntities.forEach(entity => {
        // Nếu "all" có giá trị, tất cả các entity sẽ được đặt giá trị theo "all"
        const isEnabled = allValue !== null
          ? allValue
          : data.find(item => Object.keys(item)[0] === entity.entityName)?.[entity.entityName];

        const existingSetting = existingSettingsMap[entity.id];

        if (existingSetting) {
          // Nếu đã tồn tại, kiểm tra cần cập nhật không
          if (existingSetting.isEnabled !== isEnabled) {
            settingsToUpdate.push({
              id: existingSetting.id,
              isEnabled,
              updatedAt: new Date()
            });
          }
        } else {
          // Nếu chưa tồn tại, thêm vào danh sách để tạo mới
          settingsToInsert.push({
            userNotifierId: channelNotifierId ? null : userNotifierId,
            channelNotifierId,
            notificationEntityId: entity.id,
            isEnabled,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      });

      // Cập nhật các settings đã tồn tại
      if (settingsToUpdate.length > 0) {
        await Promise.all(
          settingsToUpdate.map(setting =>
            NotificationRoomSetting.update(
              { isEnabled: setting.isEnabled, updatedAt: setting.updatedAt },
              { where: { id: setting.id } }
            )
          )
        );
      }

      // Thêm mới các settings chưa tồn tại
      if (settingsToInsert.length > 0) {
        await NotificationRoomSetting.bulkCreate(settingsToInsert);
      }

      return {
        status: 200,
        data: {
          updated: settingsToUpdate,
          inserted: settingsToInsert
        },
        message: 'Notification settings updated successfully'
      };
    } catch (error) {
      console.log(error);

      return {
        status: 500,
        data: null,
        message: error.message
      };
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
};const getNotificationSettingStatus = async (userNotifierId, channelNotifierId) => {
  try {
    let notifierCondition = {};
    let roleNotifierCondition = {};
    if (channelNotifierId) {
      notifierCondition.channelNotifierId = channelNotifierId;
    } else if (userNotifierId) {
      notifierCondition.userNotifierId = userNotifierId;
      roleNotifierCondition.role = "user"
    }

    // Lấy danh sách tất cả các entityName từ bảng NotificationEntity (DISTINCT)
    const allEntities = await NotificationEntity.findAll({
      attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("entityName")), "entityName"]],
      where: roleNotifierCondition
    });

    // Lấy danh sách các thiết lập đã lưu từ NotificationRoomSetting
    const savedSettings = await NotificationRoomSetting.findAll({
      where: notifierCondition,
      include: [
        {
          model: NotificationEntity,
          attributes: ["entityName"],
          as: "notificationEntity",
        },
      ],
    });

    // Chuyển savedSettings thành object để dễ truy cập
    const savedSettingsMap = savedSettings.reduce((acc, item) => {
      const entityName = item.notificationEntity.entityName;
      acc[entityName] = item.isEnabled; // Gán giá trị isEnabled
      return acc;
    }, {});

    // Kết hợp dữ liệu từ allEntities và savedSettings
    const result = allEntities.map(entity => {
      const entityName = entity.entityName;
      return {
        entityName,
        isEnabled: savedSettingsMap[entityName] !== undefined
          ? savedSettingsMap[entityName] // Sử dụng giá trị đã lưu
          : true, // Mặc định là true nếu không tồn tại
      };
    });

    // Kiểm tra nếu có bất kỳ isEnabled = true
    const hasEnabled = result.some(item => item.isEnabled);

    // Thêm {"all": true/false} vào phản hồi
    return {
      status: 200,
      data: [...result, { all: hasEnabled }],
      message: "Get list setting noti status success",
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
  updateNotificationRoomSetting,
  getNotificationSettingStatus
}
