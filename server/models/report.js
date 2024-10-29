"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "reporterId" });
      this.belongsTo(models.Comment, { foreignKey: "targetCommentId" });
      this.belongsTo(models.Video, { foreignKey: "targetVideoId" });
      this.belongsTo(models.Livestream, { foreignKey: "targetLivestreamId" });
      this.belongsTo(models.User, { foreignKey: "targetAccountId" });
      this.belongsTo(models.Channel, { foreignKey: "targetChannelId" });
      this.belongsTo(models.ReportType, { foreignKey: "reportTypeId" });
    }
  }
  Report.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      reporterId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      targetCommentId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'comments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      targetVideoId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'videos',
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
      targetChannelId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'channels',
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
      chatMessagesContent: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('pending', 'banned', 'rejected', 'suspended', 'closed'),
        allowNull: false,
        defaultValue: 'pending',
      },
      suspendedUntil: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      sequelize,
      modelName: "Report",
      tableName: "reports",
      timestamps: true,
  });
  return Report;
};
