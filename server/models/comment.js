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
      // models/Comment.js
      this.belongsTo(models.Video, { foreignKey: 'videoId' });
      this.belongsTo(models.Comment, {
        foreignKey: 'parentId',
        as: 'parent',
      });
      this.hasMany(models.Comment, {
        foreignKey: 'parentId',
        as: 'replies',
      });
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
      }
    },
    {
      sequelize,
      modelName: "Comment",
      tableName: "Comments",
      timestamps: true,
  });
  return Comment;
};
