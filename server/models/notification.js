"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
  static associate(models) {
    this.hasMany(models.NotificationVisitStatus, {
      foreignKey: 'notificationId',
      as: 'visitStatus', // Alias cho mối quan hệ này
    });

    this.belongsTo(models.NotificationEntity, {
      foreignKey: 'notificationEntityId',
      as: 'notificationEntity',
  });

  this.belongsTo(models.User, {
    foreignKey: 'userActorId',
    as: 'userActor',
  });

  this.belongsTo(models.Channel, {
    foreignKey: 'channelActorId',
    as: 'channelActor',
  });

  this.belongsTo(models.Comment, {
    foreignKey: 'targetCommentId',
    as: 'targetComment',
  });

  this.belongsTo(models.Video, {
    foreignKey: 'targetVideoId',
    as: 'targetVideo',
  });

  }
  }
  Notification.init(
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
      userActorId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users', // Tên bảng trong cơ sở dữ liệu
          key: 'id',          // Tên cột bạn muốn tham chiếu đến
        },
        onDelete: 'CASCADE', // Đặt categoryId thành NULL nếu category bị xóa
      },
      channelActorId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'channels', // Tên bảng trong cơ sở dữ liệu
          key: 'id',          // Tên cột bạn muốn tham chiếu đến
        },
        onDelete: 'CASCADE', // Đặt categoryId thành NULL nếu category bị xóa
      },
      roomName: {
        type: DataTypes.STRING,
      },
      targetCommentId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'comments',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      targetVideoId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'videos',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: "Notification",
      tableName: "notifications",
      timestamps: true,
  });
  return Notification;
};
