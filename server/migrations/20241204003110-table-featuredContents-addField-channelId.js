'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn('featuredContents', 'channelId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'channels',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('featuredContents', 'channelId');
  },
};
