const express = require('express');
const { verifyUser } = require('../middlewares/verifyToken');
const { createRatingOnVideoController, createRatingOnStreamController } = require('../controllers/ratingController');
const ratingRouter = express.Router();


ratingRouter.post('/rateVideo', verifyUser, createRatingOnVideoController)
ratingRouter.post('/rateStream', verifyUser, createRatingOnStreamController)


module.exports = ratingRouter;
