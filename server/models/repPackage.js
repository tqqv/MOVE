"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RepPackage extends Model {
    static associate(models) {
        this.hasMany(models.Payment, { foreignKey: 'repPackageId', as: 'payment' });
    }
}
  RepPackage.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        rep: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        discount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
    },
    {
      sequelize,
      modelName: "RepPackage",
      tableName: "repPackages",
      timestamps: true,
  });
  return RepPackage;
};
