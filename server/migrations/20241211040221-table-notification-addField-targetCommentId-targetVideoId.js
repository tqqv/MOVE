'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('notifications', 'targetCommentId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'comments',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addColumn('notifications', 'targetVideoId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'videos',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('notifications', 'targetCommentId');
    await queryInterface.removeColumn('notifications', 'targetVideoId');
  }
};
