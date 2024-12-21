"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Livestream extends Model {
    static associate(models) {

      this.hasMany(models.ChannelMute, { foreignKey: 'targetLivestreamId', as: 'livestreamChannelMute' });

      this.hasMany(models.Report, { foreignKey: 'targetLivestreamId', as: 'livestreamReport' });
      this.hasMany(models.Donation, { foreignKey: 'livestreamId', as: 'streamDonator' });
      this.hasMany(models.Rating, { foreignKey: 'livestreamId', as: 'streamRator' });

      // Mối quan hệ 1-n với levelWorkout
      this.belongsTo(models.LevelWorkout, {
          foreignKey: 'levelWorkoutsId',
          as: 'livestreamLevelWorkout',
      });

      // Mối quan hệ 1-n với Channel (Người tạo livestream)
      this.belongsTo(models.Channel, {
          foreignKey: 'streamerId',
          as: 'livestreamChannel',
      });

      // Mối quan hệ n-1 với Category (Video thuộc nhiều danh mục)
      this.belongsTo(models.Category, {
          foreignKey: 'categoryId',
          as: 'category',
      });

      // many to many livestream to User - rating
      this.belongsToMany(models.User, {
        through: models.Rating,
        foreignKey: 'livestreamId',
        otherKey: 'userId',
        as: 'livestreamRating',
      });

      // many to many livestream to User - donation
      this.belongsToMany(models.User, {
        through: models.Donation,
        foreignKey: 'livestreamId',
        otherKey: 'userId',
        as: 'livestreamDonation',
      });
    }
  }
  Livestream.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      streamerId: {
        type: DataTypes.UUIDV4,
        allowNull: true,
        references: {
          model: 'channels', // Tên bảng trong cơ sở dữ liệu
          key: 'id',          // Tên cột bạn muốn tham chiếu đến
        },
        onDelete: 'CASCADE',
      },
      streamKey: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'categories', // Tên bảng trong cơ sở dữ liệu
          key: 'id',          // Tên cột bạn muốn tham chiếu đến
        },
        onDelete: 'CASCADE', // Đặt categoryId thành NULL nếu category bị xóa
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      thumbnailUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      highestViewAtSameTime: {
        type: DataTypes.INTEGER,
      },
      totalView: {
        type: DataTypes.INTEGER,
      },
      totalShare: {
        type: DataTypes.INTEGER,
      },
      duration: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      levelWorkoutsId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      isLive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
      {
        sequelize,
        modelName: "Livestream",
        tableName: "livestreams",
        timestamps: true,
      }
    );

    return Livestream;
  };
