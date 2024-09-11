'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Update createdAt column
    await queryInterface.changeColumn('users', 'googleId', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.changeColumn('users', 'facebookId', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

  },

  async down(queryInterface, Sequelize) {
    // Rollback changes for createdAt column
    await queryInterface.changeColumn('users', 'googleId', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.changeColumn('users', 'facebookId', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  }
};
