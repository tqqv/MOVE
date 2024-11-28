'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Tạo bảng ChannelMutes
    await queryInterface.createTable('withdrawInfors', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      channelId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'channels',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      stripeBankId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bankName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bankHolderName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bankNumber: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      routingNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable('withdrawInfors');
  },
};
