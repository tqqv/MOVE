'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('comments', 'donationItemId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'donationItems',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addColumn('comments', 'quantity', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('comments', 'donationItemId');
    await queryInterface.removeColumn('comments', 'quantity');
  }
};
