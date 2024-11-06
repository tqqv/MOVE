'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Update createdAt column
    await queryInterface.changeColumn('paymentCardInfors', 'cardType', {
      type: Sequelize.ENUM('visa', 'mastercard'),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Rollback changes for createdAt column
    await queryInterface.changeColumn('paymentCardInfors', 'cardType', {});

  }
};
