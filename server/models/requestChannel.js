"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RequestChannel extends Model {
    static associate(models) {
        this.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  RequestChannel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true, // Part of composite primary key
            allowNull: false,
            unique: true,
            references: {
              model: 'users', // Reference to the users table
              key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        status: {
            type: DataTypes.STRING(255),
        },
        text: {
            type: DataTypes.STRING(255),
        }
    },
    {
      sequelize,
      modelName: "RequestChannel",
      tableName: "requestChannel",
      timestamps: true,
  });
  return RequestChannel;
};
