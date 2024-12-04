'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('featuredContents', 'livestreamId');
    await queryInterface.removeColumn('featuredContents', 'startAt');
    await queryInterface.removeColumn('featuredContents', 'expireAt');

    await queryInterface.addColumn('featuredContents', 'featuredContentBaseId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'featuredContentBases',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addColumn('featuredContents', 'featuredContentAbnormalId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'featuredContentAbnormals',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('featuredContents', 'livestreamId');
  },
};