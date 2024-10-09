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

      // Mối quan hệ 1-n với Channel (Người tạo video)
      this.belongsTo(models.Channel, {
          foreignKey: 'channelId',
          as: 'channel',
      });

      // Mối quan hệ n-1 với Category (Video thuộc nhiều danh mục)
      this.belongsTo(models.Category, {
          foreignKey: 'categoryId',
          as: 'category',
      });

      // models/Video.js
      this.hasMany(models.Comment, { foreignKey: 'videoId' , as: "videoComment"});

      this.hasMany(models.Rating, { foreignKey: 'videoId', as: 'ratings' });

      // many to many video to User - view video
      this.belongsToMany(models.User, {
        through: models.ViewVideo,
        foreignKey: 'videoId',
        otherKey: 'viewerId',
        as: 'videoViewVideo',
      });

      // many to many video to User - rating
      this.belongsToMany(models.User, {
        through: models.Rating,
        foreignKey: 'videoId',
        otherKey: 'userId',
        as: 'videoRating',
      });
    }
  }
  Video.init(
    {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
        },
        channelId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        categoryId: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        title: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        videoUrl: {
          type: DataTypes.STRING(255),
          allowNull: true,
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
          allowNull: true,
        },
        levelWorkoutsId: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM('public', 'private', 'restricted'),
          allowNull: false,
          defaultValue: 'private',
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
