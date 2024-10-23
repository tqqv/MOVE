"use strict";
const { Model, Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class VideoKeyword extends Model {
    static associate(models) {
    }
  }
  VideoKeyword.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      videoId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'videos', // Tên bảng trong cơ sở dữ liệu
          key: 'id'       // Tên cột bạn muốn tham chiếu đến
        },
      },
      keywordId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'keywords', // Tên bảng trong cơ sở dữ liệu
          key: 'id'       // Tên cột bạn muốn tham chiếu đến
        },
      },
    },
    {
      sequelize,
      modelName: "VideoKeyword",
      tableName: "videoKeywords",
      timestamps: true,
  });
  return VideoKeyword;
};
