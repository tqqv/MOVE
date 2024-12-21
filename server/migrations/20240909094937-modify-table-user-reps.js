'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Update createdAt column
    await queryInterface.changeColumn('users', 'REPs', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
  },

  async down(queryInterface, Sequelize) {
    // Rollback changes for createdAt column
    await queryInterface.changeColumn('user', 'REPs', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });

  }
};