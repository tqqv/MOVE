'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.removeColumn('videos', 'userId');

    await queryInterface.addColumn('videos', 'channelId', {
      type: DataTypes.UUID,
      allowNull: false, // Đã định nghĩa là NOT NULL
      references: {
        model: 'channels', // Tên bảng trong cơ sở dữ liệu
        key: 'id',      // Tên cột bạn muốn tham chiếu đến
      },
    });


  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('vidoes', 'channelId');
  }
};
