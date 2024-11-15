"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ViewVideo extends Model {
    static associate(models) {
        // Define relationships if necessary
      this.belongsTo(models.User, {
        as: 'viewVideoUser',
        foreignKey: 'viewerId'
      });

      this.belongsTo(models.Video, {
          as: 'viewVideosVideo',
          foreignKey: 'videoId'
      });

      this.belongsTo(models.Livestream, {
        as: 'viewStream',
        foreignKey: 'livestreamId'
      });
    }
  }
  ViewVideo.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      viewerId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'users', // Reference to the users table
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
      },
      videoId: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
              model: 'videos', // Reference to the categories table
              key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
      },
      livestreamId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'livestreams', // Reference to the categories table
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      viewTime: {
        type:DataTypes.INTEGER,
        defaultValue: 0
      },
      ip: {
        type:DataTypes.STRING,
      },
      country: {
        type:DataTypes.STRING,
      },
      city: {
        type:DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "ViewVideo",
      tableName: "viewVideos",
      timestamps: true,
  });
  return ViewVideo;
};
