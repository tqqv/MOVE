"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Withdraw extends Model {
  static associate(models) {
    this.belongsTo(models.Channel, { foreignKey: "channelId" });
  }
  }
  Withdraw.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        channelId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'Channels',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed', 'failed'),
            allowNull: false,
            defaultValue: 'pending'
        },
        arrivalDate: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
    },
    {
      sequelize,
      modelName: "Withdraw",
      tableName: "withdraws",
      timestamps: true,
  });
  return Withdraw;
};
