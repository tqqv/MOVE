'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Update createdAt column
    await queryInterface.changeColumn('videos', 'status', {
        type: Sequelize.ENUM('public', 'private', 'restricted'),
        allowNull: false,
        defaultValue: 'private',
    });
  },

  async down(queryInterface, Sequelize) {
  }
};
