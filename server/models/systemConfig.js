"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SystemConfig extends Model {
    static associate(models) {

    }
  }
  SystemConfig.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,

      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: {
        type: DataTypes.FLOAT,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: "SystemConfig",
      tableName: "systemConfigs",
      timestamps: true,
    }
  );
  return SystemConfig;
};
