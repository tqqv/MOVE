'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('livestreams', 'duration', {
      type: Sequelize.STRING(20),
      allowNull: false,
    });

    await queryInterface.addColumn('livestreams', 'levelWorkoutsId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'levelWorkouts', // Tên bảng trong cơ sở dữ liệu
        key: 'id',            // Tên cột bạn muốn tham chiếu đến
      },
      onDelete: 'CASCADE', // Xóa video khi levelWorkout bị xóa
    });
  },

  async down (queryInterface, Sequelize) {
  }
};
