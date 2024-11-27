"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class WithdrawInfor extends Model {
  static associate(models) {
    this.belongsTo(models.Channel, { foreignKey: "channelId" });
  }
  }
  WithdrawInfor.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        channelId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Channels',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        stripeBankId: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        bankName: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        bankHolderName: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        bankNumber: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        routingNumber: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: true,
        }
    },
    {
      sequelize,
      modelName: "WithdrawInfor",
      tableName: "withdrawInfors",
      timestamps: true,
  });
  return WithdrawInfor;
};
