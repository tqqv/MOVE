'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('channels', 'livestreamStatus', {
      type: Sequelize.ENUM('beforePublished', 'published', 'streamChats'),
      defaultValue: 'beforePublished',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('channels', 'livestreamStatus', {
        type: Sequelize.ENUM('beforePublished', 'published', 'streamChats'),
        defaultValue: 'beforePublished',
    });
  }
};
