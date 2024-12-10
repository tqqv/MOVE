"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class NotificationEntity extends Model {

  }
  NotificationEntity.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      entityName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roomNamePattern: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isDynamicRoomName: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      action: {
        type: DataTypes.STRING,
        defaultValue: false
      },
      role: {
        type: DataTypes.ENUM('user', 'streamer', 'admin'),
        defaultValue: 'user',
      },
    },
    {
      sequelize,
      modelName: "NotificationEntity",
      tableName: "notificationEntities",
      timestamps: true,
  });
  return NotificationEntity;
};
