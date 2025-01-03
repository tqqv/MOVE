"use strict";
const { Model } = require("sequelize");
const { Sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  class Keyword extends Model {
    static associate(models) {
      this.hasMany(models.VideoKeyword, { foreignKey: 'keywordId', as: 'keywordVideoKeyword' });
    }
  }
  Keyword.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Keyword",
    tableName: "keywords",
    timestamps: true,
});
  return Keyword;
};
