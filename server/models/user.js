"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {

      // one-to-many channel
      this.hasOne(models.Channel, {
        foreignKey: 'userId'
      });

      this.hasOne(models.RequestChannel, {
        foreignKey: 'userId'
      });

      // one to many comment
      this.hasMany(models.Comment, {
        foreignKey: 'userId',
        as: 'userComments', // Alias cho rating của người dùng
      });

      // Many-to-many Category - CategoryFollow
      this.belongsToMany(models.Category, {
        through: models.CategoryFollow,
        foreignKey: 'userId',
        as: 'followedCategories', // Alias for the categories the user follows
      });

      // many to many channel - subcribe
      this.belongsToMany(models.Channel, {
        through: models.Subscribe,
        foreignKey: 'userId',
        as: 'userSubscribe',
      });

      // many to many video - video view
      this.belongsToMany(models.Video, {
        through: models.ViewVideo,
        foreignKey: 'viewerId',
        as: 'userViewVideo',
      });

      // many to many video - rating
      this.belongsToMany(models.Video, {
      through: models.Rating,
      foreignKey: 'userId',
      as: 'userRating',
      });

    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
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
        type: DataTypes.STRING(6),
        unique: true,
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
