"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CategoryFollow extends Model {
    static associate(models) {
      // Define relationships if necessary
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category',
        onDelete: 'CASCADE',
      });
    }
  }
  
  CategoryFollow.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Part of composite primary key
        allowNull: false,
        references: {
          model: 'users', // Reference to the users table
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      categoryId: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Part of composite primary key
        allowNull: false,
        references: {
          model: 'categories', // Reference to the categories table
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: "CategoryFollow",
      tableName: "categoryFollows",
      timestamps: true, // Automatically add createdAt and updatedAt
    }
  );

  return CategoryFollow;
};
