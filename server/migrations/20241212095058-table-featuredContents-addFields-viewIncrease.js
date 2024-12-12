'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('featuredContents', 'viewIncrease', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('featuredContents', 'viewIncrease');
  }
};
