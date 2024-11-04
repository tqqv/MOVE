"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CommentReaction extends Model {
    static associate(models) {
    }
  }
  CommentReaction.init(
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
      reactionType: {
        type: DataTypes.ENUM('like', 'dislike'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "CommentReaction",
      tableName: "commentReactions",
      timestamps: true,
  });
  return CommentReaction;
};
