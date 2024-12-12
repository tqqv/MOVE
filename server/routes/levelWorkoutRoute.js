const express = require("express");
const { verifyAdmin } = require("../middlewares/verifyToken");
const { createLevelWorkoutController, getAllLevelWorkoutController, getLvWorkoutByIdController, editLevelWorkoutController, deleteLevelWorkoutController, getAllLevelWorkoutAdminController } = require("../controllers/levelWorkoutController");
const lvWorkoutRouter = express.Router();


lvWorkoutRouter.post('/', verifyAdmin, createLevelWorkoutController);
lvWorkoutRouter.get('/getAllLevelWorkoutAdmin', verifyAdmin, getAllLevelWorkoutAdminController);
lvWorkoutRouter.get('/getLvWorkoutById/:lvWorkoutId', getLvWorkoutByIdController);
lvWorkoutRouter.get('/', getAllLevelWorkoutController);
lvWorkoutRouter.patch('/:lvWorkoutId', verifyAdmin, editLevelWorkoutController);
lvWorkoutRouter.delete('/:lvWorkoutId', verifyAdmin, deleteLevelWorkoutController);

module.exports = lvWorkoutRouter;
