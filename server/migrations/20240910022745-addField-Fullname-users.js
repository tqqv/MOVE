'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'fullName', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });

    await queryInterface.addColumn('channels', 'channelName', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'fullName', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });

    await queryInterface.addColumn('channels', 'channelName', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
  }
};
