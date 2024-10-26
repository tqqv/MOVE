'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Update createdAt column
    await queryInterface.changeColumn('videos', 'viewCount', {
      type: Sequelize.INTEGER,
      defaultValue: 1
    });
  },

  async down(queryInterface, Sequelize) {
    // Rollback changes for createdAt column
    await queryInterface.changeColumn('videos', 'viewCount', {
      type: Sequelize.INTEGER,
      defaultValue: 1
    });

  }
};
