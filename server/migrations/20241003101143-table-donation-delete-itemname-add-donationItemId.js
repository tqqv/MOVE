'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('donations', 'donationItemId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'donationItems', // Tên bảng trong cơ sở dữ liệu
        key: 'id'       // Tên cột bạn muốn tham chiếu đến
      },
    });

    await queryInterface.removeColumn('donations', 'itemName');

  },

  async down (queryInterface, Sequelize) {
  }
};
