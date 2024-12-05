"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class FeaturedContentBase extends Model {
    static associate(models) {
    }
  }
  FeaturedContentBase.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      pricePerDay: {
        type: DataTypes.INTEGER,
        defaultValue: 5000
      },

      maxBookings: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "FeaturedContentBase",
      tableName: "featuredContentBases",
      timestamps: true,
  });
  return FeaturedContentBase;
};
