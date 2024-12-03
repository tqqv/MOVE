'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn('featuredContents', 'date', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('featuredContents', 'date');
  },
};
