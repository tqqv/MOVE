"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Channel extends Model {
        static associate(models) {
            this.belongsTo(models.User, { foreignKey: "userId" });

            // Mối quan hệ 1-n với Video (Người dùng có nhiều video)
            this.hasMany(models.Video, {
                foreignKey: 'channelId',
                as: 'channelVideos', // Alias cho videos của người dùng
            });

            // Mối quan hệ 1-n với Livestream (Người dùng có nhiều video)
            this.hasMany(models.Livestream, {
                foreignKey: 'streamerId',
                as: 'channelLivestreams', // Alias cho videos của người dùng
            });

            this.hasMany(models.ChannelMute, { foreignKey: 'channelId', as: 'channelChannelMute' });

            this.hasMany(models.Report, { foreignKey: 'targetChannelId', as: 'channelReport' });


            this.belongsToMany(models.User, {
                through: models.Subscribe,
                foreignKey: 'userId',
                as: 'channelUser', // Alias for the users that follow this category
              });

              this.hasMany(models.Subscribe, {
                foreignKey: 'channelId',
                as: 'subscribe', // Alias cho videos của người dùng
            });
        }
    }
    Channel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
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
            isLive: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            popularCheck: {
                type: DataTypes.BOOLEAN,
                allowNull: true, // hoặc false nếu bạn muốn bắt buộc
                defaultValue: 0,
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
