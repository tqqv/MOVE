"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CardPaymentInfor extends Model {
    static associate(models) {
        this.belongsTo(models.User);
    }
  }
  CardPaymentInfor.init(
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
            type: DataTypes.DATE,
            allowNull: false,
        },
        cardType: {
            type: DataTypes.ENUM('creditCard', 'debitCard'),
            allowNull: false,
        },
    },
    {
      sequelize,
      modelName: "CardPaymentInfor",
      tableName: "cardPaymentInfors",
      timestamps: true,
  });
  return CardPaymentInfor;
};
