"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      // Define relationships if necessary
      this.belongsTo(models.User, {});
      this.belongsTo(models.Video, {});
      this.belongsTo(models.Comment, {
        foreignKey: 'parentCommentId',
        as: 'parent',
      });
      this.hasMany(models.Comment, {
        foreignKey: 'parentCommentId',
        as: 'replies',
      });
    }
  }
  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
      },
      videoId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
              model: 'videos',
              key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
      },
      commentContent: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      rep: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      parentCommentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'comments',
          key: 'id',
        },
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
