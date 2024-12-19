"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class NotificationRoomSetting extends Model {
  static associate(models) {
  }
  }
  NotificationRoomSetting.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },

      notificationEntityId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'notificationEntities', // Tên bảng trong cơ sở dữ liệu
          key: 'id',          // Tên cột bạn muốn tham chiếu đến
        },
        onDelete: 'CASCADE', // Đặt categoryId thành NULL nếu category bị xóa
      },

      userNotifierId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users', // Tên bảng trong cơ sở dữ liệu
          key: 'id',          // Tên cột bạn muốn tham chiếu đến
        },
        onDelete: 'CASCADE', // Đặt categoryId thành NULL nếu category bị xóa
      },

      channelNotifierId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'channels', // Tên bảng trong cơ sở dữ liệu
          key: 'id',          // Tên cột bạn muốn tham chiếu đến
        },
        onDelete: 'CASCADE', // Đặt categoryId thành NULL nếu category bị xóa
      },

      isEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: "NotificationRoomSetting",
      tableName: "notificationRoomSettings",
      timestamps: true,
  });
  return NotificationRoomSetting;
};
