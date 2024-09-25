'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.removeColumn('users', 'isLive',)

    await queryInterface.addColumn('channels', 'isLive', {
      type: Sequelize.BOOLEAN,
      allowNull: true, // hoặc false nếu bạn muốn bắt buộc
      defaultValue: 0,
    });


  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('channels', 'isLive');
  }
};
