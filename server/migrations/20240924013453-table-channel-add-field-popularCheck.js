'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn('channels', 'popularCheck', {
      type: Sequelize.BOOLEAN,
      allowNull: true, // hoặc false nếu bạn muốn bắt buộc
      defaultValue: 0,
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('channels', 'popularCheck');
  }
};
