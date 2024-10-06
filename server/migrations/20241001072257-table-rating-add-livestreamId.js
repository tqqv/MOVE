'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('ratings', 'livestreamId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'livestreams', // Tên bảng trong cơ sở dữ liệu
        key: 'id',            // Tên cột bạn muốn tham chiếu đến
      },
      onDelete: 'CASCADE', // Xóa video khi levelWorkout bị xóa
    });
  },

  async down (queryInterface, Sequelize) {
  }
};
