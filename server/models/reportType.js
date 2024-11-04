"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ReportType extends Model {
    static associate(models) {
      this.hasMany(models.ChannelMute, { foreignKey: 'reportTypeId', as: 'channelMuteReportTypeId' });
      this.hasMany(models.Report, { foreignKey: 'reportTypeId', as: 'reportReportTypeId' });
    }
  }
  ReportType.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM('comments', 'videos', 'livestreams', 'accounts', 'channels', 'streamChats'),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: "ReportType",
      tableName: "reportTypes",
      timestamps: true,
  });
  return ReportType;
};
