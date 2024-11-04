'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('livestreams', 'isLive', {
      type: Sequelize.BOOLEAN,
      allowNull: false, // hoặc false nếu bạn muốn bắt buộc
      defaultValue: true,
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('livestreams', 'isLive');
  }
};
