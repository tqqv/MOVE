"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Subscribe extends Model {
    static associate(models) {
        // Define relationships if necessary
        this.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
            onDelete: 'CASCADE',
        });
        this.belongsTo(models.Channel, {
            foreignKey: 'channelId',
            as: 'category',
            onDelete: 'CASCADE',
        });
    }
  }
  Subscribe.init(
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
        channelId: {
            type: DataTypes.INTEGER,
            primaryKey: true, // Part of composite primary key
            allowNull: false,
            references: {
                model: 'channels', // Reference to the categories table
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    },
    {
      sequelize,
      modelName: "Subscribe",
      tableName: "categories",
      timestamps: true,
  });
  return Subscribe;
};
