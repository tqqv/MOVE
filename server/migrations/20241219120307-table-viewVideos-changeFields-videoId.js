'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('viewVideos', 'videoId', {
      type: Sequelize.UUID,
      allowNull: true, // Cho phép NULL
      references: {
        model: 'videos',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('viewVideos', 'videoId', {
      type: Sequelize.UUID,
      allowNull: true, // Hoàn tác: Không cho phép NULL
      references: {
        model: 'videos',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
};
