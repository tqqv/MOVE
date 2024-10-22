'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Tạo bảng ReportTypes
    await queryInterface.createTable('ReportTypes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      type: {
        type: Sequelize.ENUM('comments', 'videos', 'livestreams', 'accounts', 'channels', 'streamChats'),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Xóa bảng ReportTypes
    await queryInterface.dropTable('ReportTypes');

    // Xóa enum Reports_type_enum
    await queryInterface.sequelize.query('DROP TYPE "Reports_type_enum"');
  },
};
