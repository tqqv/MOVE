"use strict";
const { Model, Sequelize } = require("sequelize");

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
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      reporterId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      targetCommentId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'comments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      targetVideoId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'videos',
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
      targetChannelId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'channels',
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
        type: Sequelize.ENUM('pending', 'banned', 'rejected', 'suspended', 'closed'),
        allowNull: false,
        defaultValue: 'pending',
      },
      suspendedUntil: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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
