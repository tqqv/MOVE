"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {

        // Many-to-many relationship through CategoryFollow
        this.hasMany(models.Video, {
          foreignKey: 'videoId',
          as: 'categoryVideos', // Alias for the users that follow this category
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
