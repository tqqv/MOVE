"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class VideoView extends Model {
    static associate(models) {
        // Define relationships if necessary
        this.belongsTo(models.User, {
            as: 'videoViewUser',
            onDelete: 'CASCADE',
        });
        this.belongsTo(models.Video, {
            as: 'videoViewVideo',
            onDelete: 'CASCADE',
        });
    }
  }
  VideoView.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      viewerId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'users', // Reference to the users table
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
      },
      videoId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
              model: 'videos', // Reference to the categories table
              key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: "videoView",
      tableName: "VideoViews",
      timestamps: true,
  });
  return VideoView;
};
