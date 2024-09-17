"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    static associate(models) {
        this.belongsTo(models.User);
    }
  }
  Rating.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
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
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'videos', // Tên bảng users
          key: 'id',      // Khóa chính từ bảng users
        },
        onDelete: 'CASCADE', // Xóa follow khi user bị xóa
        onUpdate: 'CASCADE', // Cập nhật khi user thay đổi
      },
      // livestreamId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      //   references: {
      //     model: 'livestreams', // Tên bảng users
      //     key: 'id',      // Khóa chính từ bảng users
      //   },
      //   onDelete: 'CASCADE', // Xóa follow khi user bị xóa
      //   onUpdate: 'CASCADE', // Cập nhật khi user thay đổi
      // },
    },
    {
      sequelize,
      modelName: "Rating",
      tableName: "ratingss",
      timestamps: true,
  });
  return Rating;
};
