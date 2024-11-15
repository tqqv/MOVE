'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('viewVideos', 'livestreamId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'livestreams',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });

    await queryInterface.changeColumn('viewVideos', 'videoId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'videos',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('viewVideos', 'livestreamId')
  }
};
