'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn('featuredContentBases', 'maxBookings', {
      type: Sequelize.INTEGER,
    })

    await queryInterface.removeColumn('featuredContentBases', 'maxStreams')
    await queryInterface.removeColumn('featuredContentBases', 'maxVideos')


    await queryInterface.addColumn('featuredContentAbnormals', 'maxBookings', {
      type: Sequelize.INTEGER,
    })

    await queryInterface.removeColumn('featuredContentAbnormals', 'maxStreams')
    await queryInterface.removeColumn('featuredContentAbnormals', 'maxVideos')

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('featuredContentBases', 'maxBookings');
    await queryInterface.removeColumn('featuredContentAbnormals', 'maxBookings');
  },
};
