"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Channel extends Model {
        static associate(models) {
            this.belongsTo(models.User, { foreignKey: "userId" });

            this.belongsToMany(models.User, {
                through: models.Subscribe,
                foreignKey: 'userId',
                as: 'channelUser', // Alias for the users that follow this category
              });
        }
    }
    Channel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: true
                }
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: true,
                unique: true,
                references: {
                    model: "User",
                    key: "id",
                }
            },
            channelName: {
                type: DataTypes.STRING(255),
                allowNull: false,
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
