'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('comments', 'channelId', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: true,
      references: {
        model: 'channels', // Tên bảng trong cơ sở dữ liệu
        key: 'id'       // Tên cột bạn muốn tham chiếu đến
      },
    });
  },

  async down (queryInterface, Sequelize) {
  }
};
