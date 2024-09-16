"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove the composite primary keys
    await queryInterface.removeColumn('subscribes', 'userId');
    await queryInterface.removeColumn('subscribes', 'channelId');

    // Add a new 'id' field and set it as the primary key
    await queryInterface.addColumn('subscribes', 'id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    });

    // Re-add the 'userId' and 'channelId' fields as foreign keys
    await queryInterface.addColumn('subscribes', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Table 'users'
        key: 'id',      // Primary key from 'users'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addColumn('subscribes', 'channelId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'channels', // Table 'channels'
        key: 'id',         // Primary key from 'channels'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    // Rollback: Remove the new 'id' field
    await queryInterface.removeColumn('subscribes', 'id');

    // Re-add composite primary keys (userId, channelId)
    await queryInterface.addColumn('subscribes', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      primaryKey: true, // Part of composite primary key
    });

    await queryInterface.addColumn('subscribes', 'channelId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'channels',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      primaryKey: true, // Part of composite primary key
    });
  },
};
