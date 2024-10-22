"use strict";

const { DataTypes } = require('sequelize');
const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("videoKeywords", {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
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
    await queryInterface.dropTable("videoKeywords");
  },
};
