"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class LevelWorkout extends Model {
    static associate(models) {
        // Mối quan hệ 1-n với Video
        this.hasMany(models.Video, {
            foreignKey: 'levelWorkoutsId',
            as: 'levelWorkoutVideos',
        });
    }
  }
  LevelWorkout.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUID,
        allowNull: false,
      },
      levelWorkout: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "LevelWorkout",
      tableName: "levelWorkouts",
      timestamps: true,
  });
  return LevelWorkout;
};
