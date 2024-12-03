'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('donations', 'livestreamId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'livestreams',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.changeColumn('donations', 'content', {
      type: Sequelize.TEXT,
      allowNull: true
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('donations', 'content', {
      type: Sequelize.TEXT,
      allowNull: false,
    });

    await queryInterface.changeColumn('donations', 'livestreamId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'livestreams',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
};
