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

        this.hasMany(models.CategoryFollow, {
          foreignKey: 'categoryId',
          as: 'cateFollow',
        });

        // One-to-many  - livestream
        this.hasMany(models.Livestream, {
          foreignKey: 'categoryId',
          as: 'categoryLivestreams',
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
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            isUUID: true
        }
      },
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
