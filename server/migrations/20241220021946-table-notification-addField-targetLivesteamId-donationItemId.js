'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('notifications', 'targetLivestreamId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'livestreams',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addColumn('notifications', 'donationItemId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'donationItems',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('notifications', 'targetLivestreamId');
    await queryInterface.removeColumn('notifications', 'donationItemId');
  }
};
