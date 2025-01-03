"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Subscribe extends Model {
    static associate(models) {
        // Define relationships if necessary
        this.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'subscribeUser',
            onDelete: 'CASCADE',
        });
        this.belongsTo(models.Channel, {
            foreignKey: 'channelId',
            as: 'followChannel',
            onDelete: 'CASCADE',
        });
    }
  }
  Subscribe.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      userId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'users', // Reference to the users table
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
      },
      channelId: {
          type: DataTypes.UUID,
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
      tableName: "subscribes",
      timestamps: true,
  });
  return Subscribe;
};
