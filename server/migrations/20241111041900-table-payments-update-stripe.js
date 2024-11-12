'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('payments', 'paymentIntentId', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('payments', 'paymentMethodId', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('payments', 'repPackageId', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'repPackages',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    });

    await queryInterface.removeColumn('payments', 'paymentAction');
    await queryInterface.removeColumn('payments', 'paymentMethod');


  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('payments', 'paymentIntentId');
    await queryInterface.removeColumn('payments', 'paymentMethodId');
    await queryInterface.removeColumn('payments', 'repPackageId');
  }
};
