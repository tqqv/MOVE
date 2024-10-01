"use strict";

const { DataTypes } = require('sequelize');
const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("livestreams", {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUID,
        allowNull: false,
      },
      streamerId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'channels', // Tên bảng trong cơ sở dữ liệu
          key: 'id',          // Tên cột bạn muốn tham chiếu đến
        },
        onDelete: 'CASCADE',
      },
      streamKey: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'categories', // Tên bảng trong cơ sở dữ liệu
          key: 'id',          // Tên cột bạn muốn tham chiếu đến
        },
        onDelete: 'CASCADE', // Đặt categoryId thành NULL nếu category bị xóa
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      thumbnailUrl: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      highestViewAtSameTime: {
        type: Sequelize.INTEGER,
      },
      totalView: {
        type: Sequelize.INTEGER,
      },
      totalShare: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("livestreams");
  },
};
