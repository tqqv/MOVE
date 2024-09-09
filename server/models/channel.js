"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Channel extends Model {
        static associate(models) {
            this.belongsTo(models.User, { foreignKey: "userId" });
        }
    }
    Channel.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                unique: true,
                references: {
                    model: "User",
                    key: "id",
                }
            },
            bio: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            avatar: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            streamKey: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            facebookUrl: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            youtubeUrl: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            instaUrl: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },

  },
  {
    sequelize,
    modelName: "Channel",
    tableName: "channels",
    timestamps: true,
  });
  return Channel;
};
