'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('donations', 'donatorChannelId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'channels',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('donations', 'donatorChannelId');
  }
};
