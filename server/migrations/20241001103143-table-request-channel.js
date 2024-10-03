'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Update createdAt column
    await queryInterface.changeColumn('requestChannel', 'userId', {
      type: Sequelize.UUID,
      allowNull: true,
      unique: false,
      references: {
        model: 'users', // Tên bảng trong cơ sở dữ liệu
        key: 'id'       // Tên cột bạn muốn tham chiếu đến
      },
    });
  },
  async down(queryInterface, Sequelize) {
  }
};