const express = require("express");
const { verifyAdmin } = require("../middlewares/verifyToken");
const { createLevelWorkoutController, getAllLevelWorkoutController, getLvWorkoutByIdController, editLevelWorkoutController, deleteLevelWorkoutController } = require("../controllers/levelWorkoutController");
const lvWorkoutRouter = express.Router();


lvWorkoutRouter.post('/create', verifyAdmin, createLevelWorkoutController);
lvWorkoutRouter.get('/getAllCate', getAllLevelWorkoutController);
lvWorkoutRouter.get('/getCateById/:cateId', getLvWorkoutByIdController);
lvWorkoutRouter.patch('/edit', verifyAdmin, editLevelWorkoutController);
lvWorkoutRouter.delete('/delete/:cateId', verifyAdmin, deleteLevelWorkoutController);

module.exports = lvWorkoutRouter;
