const responseHandler = require("../middlewares/responseHandler");
const { createLevelWorkout, getAllLevelWorkout, getLvWorkoutById, editLevelWorkout, deleteLevelWorkout } = require("../services/levelWorkoutService");


const createLevelWorkoutController = async (req, res, next) => {
  const data = req.body;
  const result = await createLevelWorkout(data);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getAllLevelWorkoutController = async(req, res, next) => {
  const result = await getAllLevelWorkout()

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const getLvWorkoutByIdController = async(req, res, next) => {
  const lvWorkoutId = req.params.lvWorkoutId
  const result = await getLvWorkoutById(lvWorkoutId)

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const editLevelWorkoutController = async (req, res, next) => {
  const data = req.body;
  const result = await editLevelWorkout(data);

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

const deleteLevelWorkoutController = async (req, res, next) => {
  const lvWorkoutId = req.params.lvWorkoutId
  const result = await deleteLevelWorkout(lvWorkoutId)

  responseHandler(result.status, result.data, result.message)(req, res, next);
}

module.exports = {
  createLevelWorkoutController,
  getAllLevelWorkoutController,
  getLvWorkoutByIdController,
  editLevelWorkoutController,
  deleteLevelWorkoutController,
}