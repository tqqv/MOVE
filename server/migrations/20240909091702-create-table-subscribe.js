"use strict";

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("subscribes", {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users', // Tên bảng users
          key: 'id',      // Khóa chính từ bảng users
        },
        onDelete: 'CASCADE', // Xóa follow khi user bị xóa
        onUpdate: 'CASCADE', // Cập nhật khi user thay đổi
        primaryKey: true,    // Phần của khóa chính tổng hợp
      },
      channelId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'channels', // Tên bảng categories
          key: 'id',           // Khóa chính từ bảng categories
        },
        onDelete: 'CASCADE',  // Xóa follow khi category bị xóa
        onUpdate: 'CASCADE',  // Cập nhật khi category thay đổi
        primaryKey: true,     // Phần của khóa chính tổng hợp
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("subscribes");
  },
};
