'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('videos', 'livestreamId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'livestreams',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('videos', 'livestreamId');
  },
};
