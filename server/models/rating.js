"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    static associate(models) {
        this.belongsTo(models.User);

        this.belongsTo(models.Video, {
          foreignKey: 'videoId',
          as: 'video'
        });
    }
  }
  Rating.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users', // Tên bảng users
          key: 'id',      // Khóa chính từ bảng users
        },
        onDelete: 'CASCADE', // Xóa follow khi user bị xóa
        onUpdate: 'CASCADE', // Cập nhật khi user thay đổi
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      videoId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'videos', // Tên bảng users
          key: 'id',      // Khóa chính từ bảng users
        },
        onDelete: 'CASCADE', // Xóa follow khi user bị xóa
        onUpdate: 'CASCADE', // Cập nhật khi user thay đổi
      },
      livestreamId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'livestreams', // Tên bảng users
          key: 'id',      // Khóa chính từ bảng users
        },
        onDelete: 'CASCADE', // Xóa follow khi user bị xóa
        onUpdate: 'CASCADE', // Cập nhật khi user thay đổi
      },
    },
    {
      sequelize,
      modelName: "Rating",
      tableName: "ratings",
      timestamps: true,
  });
  return Rating;
};
