"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      // Define relationships if necessary
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'userComments'
      });

      this.belongsTo(models.Channel, {
        foreignKey: 'channelId',
        as: 'channelComments'
      });
      this.belongsTo(models.Video, { foreignKey: 'videoId' });
      this.belongsTo(models.Comment, {
        foreignKey: 'parentId',
        as: 'parent',
      });

      this.belongsTo(models.DonationItem, {
        foreignKey: 'donationItemId',
        as: 'commentDonationItem'
      });

      this.hasMany(models.Comment, {
        foreignKey: 'parentId',
        as: 'replies',
      });
      this.hasMany(models.Report, { foreignKey: 'targetCommentId', as: 'commentReport' });
      this.hasMany(models.ReactionComment, { foreignKey: 'commentId', as: 'commentReaction' });
    }
  }
  Comment.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        // validate: {
        //   isUUID: true
        // }
      },
      userId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
      },
      channelId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'channels',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      videoId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
              model: 'videos',
              key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      rep: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      donationItemId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'donationItems', // Tên bảng users
          key: 'id',      // Khóa chính từ bảng users
        },
        onDelete: 'CASCADE', // Xóa follow khi user bị xóa
        onUpdate: 'CASCADE', // Cập nhật khi user thay đổi
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      parentId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'comments',
          key: 'id',
        },
        // validate: {
        //   isUUID: true
        // },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      isBanned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Comment",
      tableName: "comments",
      timestamps: true,
  });
  return Comment;
};
