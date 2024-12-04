
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class FeaturedContentAbnormal extends Model {
    static associate(models) {
    }
  }
  FeaturedContentAbnormal.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      date: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
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
      modelName: "FeaturedContentAbnormal",
      tableName: "featuredContentAbnormals",
      timestamps: true,
  });
  return FeaturedContentAbnormal;
};
