"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    static associate(models) {

      // Mối quan hệ 1-n với levelWorkout
      this.belongsTo(models.LevelWorkout, {
          foreignKey: 'levelWorkoutsId',
          as: 'levelWorkout',
      });

      // Mối quan hệ 1-n với User (Người tạo video)
      this.belongsTo(models.User, {
          foreignKey: 'userId',
          as: 'userVideos',
      });

      // Mối quan hệ n-1 với Category (Video thuộc nhiều danh mục)
      this.belongsTo(models.Category, {
          foreignKey: 'categoryId',
          as: 'category',
      });

      // models/Video.js
      this.hasMany(models.Comment, { foreignKey: 'videoId' });

      // many to many video to User - view video
      this.belongsToMany(models.User, {
        through: models.ViewVideo,
        foreignKey: 'videoId',
        as: 'videoViewVideo',
      });

      // many to many video to User - rating
      this.belongsToMany(models.User, {
        through: models.Rating,
        foreignKey: 'videoId',
        as: 'videoRating',
      });
    }
  }
  Video.init(
    {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        categoryId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        title: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        videoUrl: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        thumbnailUrl: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        isCommentable: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        viewCount: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        duration: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        levelWorkoutsId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM('public', 'private', 'restricted'),
          allowNull: false,
          defaultValue: 'public',
        },
      },
      {
        sequelize,
        modelName: "Video",
        tableName: "videos",
        timestamps: true,
      }
    );

    return Video;
  };
