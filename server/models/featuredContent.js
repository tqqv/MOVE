"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class FeaturedContent extends Model {
    static associate(models) {
        this.belongsTo(models.Video, {
          foreignKey: 'videoId',
          as: 'video'
        });
        this.belongsTo(models.Channel, {
          foreignKey: 'channelId',
          as: 'channelBooking'
        });
        this.belongsTo(models.FeaturedContentBase, {
          foreignKey: 'featuredContentBaseId',
          as: 'featuredBase'
        });
        this.belongsTo(models.FeaturedContentAbnormal, {
          foreignKey: 'featuredContentAbnormalId',
          as: 'featuredAbnormal'
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

      channelId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'channels',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      featuredContentBaseId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'featuredContentBases',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      featuredContentAbnormalId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'featuredContentAbnormals',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      date: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
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
      clickCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      viewIncrease: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {
      sequelize,
      modelName: "FeaturedContent",
      tableName: "featuredContents",
      timestamps: true,
  });
  return FeaturedContent;
};
