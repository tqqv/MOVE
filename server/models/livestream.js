"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  class Livestream extends Model {
    static associate(models) {

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
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUID,
        allowNull: false,
      },
      streamerId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'channels', // Tên bảng trong cơ sở dữ liệu
          key: 'id',          // Tên cột bạn muốn tham chiếu đến
        },
        onDelete: 'CASCADE',
      },
      streamKey: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      categoryId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'categories', // Tên bảng trong cơ sở dữ liệu
          key: 'id',          // Tên cột bạn muốn tham chiếu đến
        },
        onDelete: 'CASCADE', // Đặt categoryId thành NULL nếu category bị xóa
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      thumbnailUrl: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      highestViewAtSameTime: {
        type: Sequelize.INTEGER,
      },
      totalView: {
        type: Sequelize.INTEGER,
      },
      totalShare: {
        type: Sequelize.INTEGER,
      },
      duration: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      levelWorkoutsId: {
        type: Sequelize.UUID,
        allowNull: true,
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
