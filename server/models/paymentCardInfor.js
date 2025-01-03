"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PaymentCardInfor extends Model {
    static associate(models) {
        this.belongsTo(models.User);
    }
  }
  PaymentCardInfor.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        cardNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cardOwnerName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expirationDate: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cardType: {
            type: DataTypes.ENUM('visa', 'mastercard'),
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        paymentMethodId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
      sequelize,
      modelName: "PaymentCardInfor",
      tableName: "paymentCardInfors",
      timestamps: true,
  });
  return PaymentCardInfor;
};
