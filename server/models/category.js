"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {

        // One-to-many  - video
        this.hasMany(models.Video, {
          foreignKey: 'categoryId',
          as: 'categoryVideos',
        });

        // Many-to-many relationship through CategoryFollow
        this.belongsToMany(models.User, {
          through: models.CategoryFollow,
          foreignKey: 'categoryId',
          as: 'followers', // Alias for the users that follow this category
        });

      }
  }
  Category.init(
    {
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      imgUrl: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Category",
      tableName: "categories",
      timestamps: true,
  });
  return Category;
};
