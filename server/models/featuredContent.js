"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class FeaturedContent extends Model {
    static associate(models) {
        this.belongsTo(models.Livestream, {
          foreignKey: 'livestreamId',
          as: 'livestream'
        });
        this.belongsTo(models.Video, {
          foreignKey: 'videoId',
          as: 'video'
        });
    }
  }
  FeaturedContent.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      livestreamId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'livestreams',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      videoId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'videos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      startAt: {
        type: DataTypes.DATE,
      },
      expireAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "FeaturedContent",
      tableName: "featuredContents",
      timestamps: true,
  });
  return FeaturedContent;
};
