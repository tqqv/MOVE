'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('donations', 'commentId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'comments',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('donations', 'commentId');
  }
};
