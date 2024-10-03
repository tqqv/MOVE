'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Update createdAt column
    await queryInterface.changeColumn('videos', 'duration', {
        type: Sequelize.INTEGER,
        allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
  }
};
