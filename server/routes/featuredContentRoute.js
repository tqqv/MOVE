const express = require("express");
const { verifyAdmin, verifyStreamer } = require("../middlewares/verifyToken");
const { createFeatureContentController, getAllFeatureContentController, createBookingFeatureContentController, getBookingFeatureContentController, cancelBookingFeatureContentController, getBookDateDetailController, getBookingHistoryController } = require("../controllers/featuredContentController");
const featuredContentRouter = express.Router();


featuredContentRouter.get('/', getAllFeatureContentController);
featuredContentRouter.post('/', verifyAdmin, createFeatureContentController);
featuredContentRouter.post('/booking', verifyStreamer, createBookingFeatureContentController);
featuredContentRouter.post('/cancelBooking', verifyStreamer, cancelBookingFeatureContentController);
featuredContentRouter.get('/bookedStatus', verifyStreamer, getBookingFeatureContentController);
featuredContentRouter.get('/getBookedByDate', verifyStreamer, getBookDateDetailController);
featuredContentRouter.get('/getBookingHistory', verifyStreamer, getBookingHistoryController);

module.exports = featuredContentRouter;
