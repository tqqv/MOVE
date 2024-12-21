'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('paymentCardInfors', 'country', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('paymentCardInfors', 'expirationDate', {
      type: Sequelize.STRING,
      allowNull: false,
    });


  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('paymentCardInfors', 'country');
    await queryInterface.changeColumn('paymentCardInfors', 'expirationDate');
  }
};
