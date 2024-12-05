const express = require("express");
const { verifyAdmin, verifyStreamer } = require("../middlewares/verifyToken");
const { createFeatureContentController, getAllFeatureContentController, createBookingFeatureContentController, getBookingFeatureContentController, getBookDateDetailController } = require("../controllers/featuredContentController");
const featuredContentRouter = express.Router();


featuredContentRouter.get('/', getAllFeatureContentController);
featuredContentRouter.post('/', verifyAdmin, createFeatureContentController);
featuredContentRouter.post('/booking', verifyStreamer, createBookingFeatureContentController);
featuredContentRouter.get('/bookedStatus', verifyStreamer, getBookingFeatureContentController);
featuredContentRouter.get('/getBookedByDate', verifyStreamer, getBookDateDetailController);

module.exports = featuredContentRouter;
