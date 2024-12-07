const express = require("express");
const { verifyAdmin } = require("../middlewares/verifyToken");
const { createFeatureContentAbnormalController, getFeatureContentAbnormalController } = require("../controllers/featuredContentAbnormalController.js");
const featuredContentAbnormalRouter = express.Router();


featuredContentAbnormalRouter.get('/', getFeatureContentAbnormalController);
featuredContentAbnormalRouter.post('/', verifyAdmin, createFeatureContentAbnormalController);

module.exports = featuredContentAbnormalRouter;
