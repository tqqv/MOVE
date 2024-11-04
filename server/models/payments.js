"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
        this.belongsTo(models.User);
    }
  }
  Payment.init(
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
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        rep: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        paymentMethod: {
            type: DataTypes.ENUM('creditCard', 'debitCard', 'onlineBanking', 'other'),
            allowNull: false,
        },
        paymentStatus: {
            type: DataTypes.ENUM('pending', 'completed', 'failed'),
            allowNull: false,
            defaultValue: 'pending'
        },
        paymentAction: {
            type: DataTypes.ENUM('payIn', 'withdraw'),
            allowNull: false,
        },
    },
    {
      sequelize,
      modelName: "Payment",
      tableName: "payments",
      timestamps: true,
  });
  return Payment;
};
