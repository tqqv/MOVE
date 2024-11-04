'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Update createdAt column
    await queryInterface.changeColumn('reports', 'status', {
        type: Sequelize.ENUM('pending', 'banned', 'rejected', 'suspended', 'approved', 'closed'),
        allowNull: false,
        defaultValue: 'pending',
    });
  },

  async down(queryInterface, Sequelize) {
  }
};
