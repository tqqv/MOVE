"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ReactionComment extends Model {
    static associate(models) {
    }
  }
  ReactionComment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      commentId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'comments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      reactionType: {
        type: DataTypes.ENUM('like', 'dislike'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ReactionComment",
      tableName: "reactionComments",
      timestamps: true,
  });
  return ReactionComment;
};
