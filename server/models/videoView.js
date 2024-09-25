"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ViewVideo extends Model {
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
  ViewVideo.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUID,
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
      modelName: "ViewVideo",
      tableName: "VideoViews",
      timestamps: true,
  });
  return ViewVideo;
};
