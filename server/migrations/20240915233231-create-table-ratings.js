'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ratings', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        unique: true,
        references: {
          model: 'users', // Tên bảng trong cơ sở dữ liệu
          key: 'id'       // Tên cột bạn muốn tham chiếu đến
        },
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      videoId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'videos', // Tên bảng users
          key: 'id',      // Khóa chính từ bảng users
        },
        onDelete: 'CASCADE', // Xóa follow khi user bị xóa
        onUpdate: 'CASCADE', // Cập nhật khi user thay đổi
      },
      // contentType: {
      //   type: Sequelize.ENUM({
      //     values: ['videos', 'livestreams']
      //   }),
      //   allowNull: false
      // },
      // contentId: {
      //   type: Sequelize.STRING(255),
      //   allowNull: false
      // },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
