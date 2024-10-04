const express = require("express");
const { verifyAdmin } = require("../middlewares/verifyToken");
const { createLevelWorkoutController, getAllLevelWorkoutController, getLvWorkoutByIdController, editLevelWorkoutController, deleteLevelWorkoutController } = require("../controllers/levelWorkoutController");
const lvWorkoutRouter = express.Router();


lvWorkoutRouter.post('/', verifyAdmin, createLevelWorkoutController);
lvWorkoutRouter.get('/', getAllLevelWorkoutController);
lvWorkoutRouter.get('/getLvWorkoutById/:lvWorkoutId', getLvWorkoutByIdController);
lvWorkoutRouter.patch('/', verifyAdmin, editLevelWorkoutController);
lvWorkoutRouter.delete('/:lvWorkoutId', verifyAdmin, deleteLevelWorkoutController);

module.exports = lvWorkoutRouter;
