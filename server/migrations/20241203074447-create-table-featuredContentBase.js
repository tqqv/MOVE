'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Tạo bảng ChannelMutes
    await queryInterface.createTable('featuredContentBases', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      pricePerDay: {
        type: Sequelize.INTEGER,
        defaultValue: 5000
      },
      maxStreams: {
        type: Sequelize.INTEGER,
      },
      maxVideos: {
        type: Sequelize.INTEGER,
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
    // Xóa bảng channelMutes
    await queryInterface.dropTable('featuredContentBases');
  },
};
