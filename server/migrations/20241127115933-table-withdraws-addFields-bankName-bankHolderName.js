'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('withdraws', 'bankName', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('withdraws', 'bankHolderName', {
      type: Sequelize.STRING,
      allowNull: true,
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('withdraws', 'bankName');
    await queryInterface.removeColumn('withdraws', 'bankHolderName');
  },
};
