"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Định nghĩa quan hệ với Category
      // this.belongsTo(models.Category, { foreignKey: "categoryId" });
      // Định nghĩa quan hệ với TaskStatus
      // this.belongsTo(models.TaskStatus, { foreignKey: "taskStatusId" });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      googleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      facebookId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: "username",
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: "email",
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      avatar: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      REPs: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: "user",
      },
      referralCode: {
        type: DataTypes.INTEGER,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
    }
  );

  return User;
};
