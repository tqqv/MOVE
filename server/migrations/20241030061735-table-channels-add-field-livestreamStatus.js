'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('channels', 'livestreamStatus', {
      type: Sequelize.ENUM('beforePublished', 'published', 'ended'),
      defaultValue: 'beforePublished',
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('channels', 'livestreamStatus');
  }
};
