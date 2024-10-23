"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ChannelMute extends Model {
    static associate(models) {
      this.belongsTo(models.Channel, { foreignKey: "channelId" });
      this.belongsTo(models.Livestream, { foreignKey: "targetLivestreamId" });
      this.belongsTo(models.User, { foreignKey: "targetAccountId" });
      this.belongsTo(models.ReportType, { foreignKey: "reportTypeId" });
    }
  }
  ChannelMute.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      channelId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'channels',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      targetLivestreamId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'livestreams',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      targetAccountId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      reportTypeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'reportTypes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: DataTypes.ENUM('muted', 'unmuted'),
        allowNull: false,
        defaultValue: 'muted',
      },
      mutedUntil: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      sequelize,
      modelName: "ChannelMute",
      tableName: "channelMutes",
      timestamps: true,
  });
  return ChannelMute;
};
