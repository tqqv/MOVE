"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {

      // one-to-many channel
      this.hasOne(models.Channel, {
        foreignKey: 'userId'
      });

      // Mối quan hệ 1-n với Video (Người dùng có nhiều video)
      this.hasMany(models.Video, {
        foreignKey: 'userId',
        as: 'userVideos', // Alias cho videos của người dùng
      });

      // Many-to-many relationship through CategoryFollow
      this.belongsToMany(models.Category, {
        through: models.CategoryFollow,
        foreignKey: 'userId',
        as: 'followedCategories', // Alias for the categories the user follows
      });
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
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      facebookId: {
        type: DataTypes.STRING(255),
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
      fullName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
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
        allowNull: false,
        defaultValue: 0,
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
      isLive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
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
