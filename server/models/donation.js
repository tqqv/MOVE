"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Donation extends Model {
    static associate(models) {
        this.belongsTo(models.User);

        this.belongsTo(models.Livestream, {
          foreignKey: 'livestreamId',
          as: 'livestream'
        });
    }
  }
  Donation.init(
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
      livestreamId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'livestreams', // Tên bảng users
          key: 'id',      // Khóa chính từ bảng users
        },
        onDelete: 'CASCADE', // Xóa follow khi user bị xóa
        onUpdate: 'CASCADE', // Cập nhật khi user thay đổi
      },
      donationItemId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'donationItems', // Tên bảng users
          key: 'id',      // Khóa chính từ bảng users
        },
        onDelete: 'CASCADE', // Xóa follow khi user bị xóa
        onUpdate: 'CASCADE', // Cập nhật khi user thay đổi
      },
      REPs: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "Donation",
      tableName: "donations",
      timestamps: true,
  });
  return Donation;
};
