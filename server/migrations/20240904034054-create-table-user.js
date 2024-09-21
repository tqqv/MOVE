"use strict";

const { DataTypes } = require('sequelize');
const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUID,
        allowNull: false,
      },
      googleId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      facebookId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: true,
        unique: "username",
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: "email",
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: 0,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      avatar: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      gender: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      dob: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      REPs: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      role: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: "user",
      },
      referralCode: {
        type: Sequelize.STRING(6),        defaultValue: DataTypes.UUID,
        unique: true,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
