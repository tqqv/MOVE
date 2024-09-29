'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('videos', 'title', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.changeColumn('videos', 'videoUrl', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.changeColumn('videos', 'duration', {
      type: Sequelize.STRING(20),
      allowNull: true,
    });

    await queryInterface.changeColumn('videos', 'levelWorkoutsId', {
      type: Sequelize.UUID,
      allowNull: true,
    });
  },
  

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
