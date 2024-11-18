const express = require("express");
const { verifyAdmin } = require("../middlewares/verifyToken");
const { createFeatureContentController, getAllFeatureContentController } = require("../controllers/featuredContentController");
const featuredContentRouter = express.Router();


featuredContentRouter.get('/', getAllFeatureContentController);
featuredContentRouter.post('/', verifyAdmin, createFeatureContentController);

module.exports = featuredContentRouter;
