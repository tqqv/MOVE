'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'isLive', {
      type: Sequelize.BOOLEAN,
      allowNull: true, // hoặc false nếu bạn muốn bắt buộc
      defaultValue: 0,
    });

    await queryInterface.removeColumn('users', 'bio');

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'isLive');
  }
};
