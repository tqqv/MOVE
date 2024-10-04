const db = require("../models/index.js");
const { LevelWorkout } = db;

const createLevelWorkout = async(data) => {
  try {
    if(!data.levelWorkout){
      return {
        status: 400,
        data: null,
        message: 'Cannot be empty'
      }
    }

    const newLvWorkout = await LevelWorkout.create(data)

    return {
      status: 200,
      data: newLvWorkout,
      message: 'Created successfully'
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const getAllLevelWorkout = async() => {
  try {
    const listLvWorkout = await LevelWorkout.findAll()

    return {
      status: 200,
      data: listLvWorkout,
      message: "Get list successfully."
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const getLvWorkoutById = async(lvWorkoutId) => {
  try {
    const levelWorkout = await LevelWorkout.findByPk(lvWorkoutId)

    if(!levelWorkout) {
      return {
        status: 400,
        data: null,
        message: "Level Workout not found"
      }
    }

    return {
      status: 200,
      data: levelWorkout,
      message: "Get Level Workout successfully."
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const editLevelWorkout = async(lvWorkoutId, data) => {
  try {
    // Tìm LvWorkout trong DB
    const LevelWorkout = await LevelWorkout.findByPk(lvWorkoutId)
    if(!LevelWorkout) {
      return {
        status: 400,
        data: null,
        message: "Level Workout not found"
      }
    }
    // update LvWorkout trong db
    const updateLvWorkout = await user.update(data)
    if(!updateLvWorkout) {
      return {
        status: 400,
        data: null,
        message: "Edit failed." // update fail
      }
    }

    return {
      status: 200,
      data: updateLvWorkout,
      message: "Level Workout edit successfully."
    }

  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const deleteLevelWorkout = async (lvWorkoutId) => {
  try {
    const LevelWorkout = await LevelWorkout.findByPk(lvWorkoutId);
    if (!LevelWorkout) {
      return {
        status: 404,
        data: null,
        message: "Level Workout not found."
      };
    }

    await LevelWorkout.destroy();

    return {
      status: 200,
      data: null,
      message: "Level Workout deleted successfully."
    };

  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    };
  }
};

module.exports = {
  createLevelWorkout,
  getAllLevelWorkout,
  getLvWorkoutById,
  editLevelWorkout,
  deleteLevelWorkout
}
