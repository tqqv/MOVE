"use strict";
const { Model, Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ReportType extends Model {
    static associate(models) {
    }
  }
  ReportType.init(
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      type: {
        type: Sequelize.ENUM('comments', 'videos', 'livestreams', 'accounts', 'channels', 'streamChats'),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      sequelize,
      modelName: "ReportType",
      tableName: "reportTypes",
      timestamps: true,
  });
  return ReportType;
};
