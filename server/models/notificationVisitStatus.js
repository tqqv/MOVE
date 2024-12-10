"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class NotificationVisitStatus extends Model {
  static associate(models) {
    this.belongsTo(models.Channel, { foreignKey: "channelId" });
  }
  }
  NotificationVisitStatus.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      notificationId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'notifications', // Tên bảng trong cơ sở dữ liệu
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

      status: {
        type: DataTypes.ENUM('recieved', 'visited'),
        defaultValue: "recieved"
      },
    },
    {
      sequelize,
      modelName: "NotificationVisitStatus",
      tableName: "notificationVisitStatuses",
      timestamps: true,
  });
  return NotificationVisitStatus;
};
