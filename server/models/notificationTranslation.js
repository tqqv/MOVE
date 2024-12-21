"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class NotificationTranslation extends Model {
  static associate(models) {
    this.belongsTo(models.Channel, { foreignKey: "channelId" });
  }
  }
  NotificationTranslation.init(
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
      languageCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      translatedContent: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "NotificationTranslation",
      tableName: "notificationTranslations",
      timestamps: true,
  });
  return NotificationTranslation;
};
