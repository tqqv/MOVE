const express = require("express");
const { verifyAdmin } = require("../middlewares/verifyToken");
const { createFeatureContentBaseController, getFeatureContentBaseController } = require("../controllers/featuredContentBaseController");
const featuredContentBaseRouter = express.Router();


featuredContentBaseRouter.get('/', getFeatureContentBaseController);
featuredContentBaseRouter.post('/', verifyAdmin, createFeatureContentBaseController);

module.exports = featuredContentBaseRouter;
