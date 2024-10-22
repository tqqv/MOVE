"use strict";
const { Model, Sequelize } = require("sequelize");

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
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      channelId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'channels',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      targetLivestreamId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'livestreams',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      targetAccountId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      reportTypeId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'reportTypes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM('muted', 'unmuted'),
        allowNull: false,
        defaultValue: 'muted',
      },
      mutedUntil: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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
