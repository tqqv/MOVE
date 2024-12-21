const express = require('express');
const { verifyUser } = require('../middlewares/verifyToken');
const { createRatingOnVideoController, createRatingOnStreamController, getRatingOfVideoController, getRatingOfLivestreamController } = require('../controllers/ratingController');
const ratingRouter = express.Router();


ratingRouter.post('/rateVideo', verifyUser, createRatingOnVideoController)
ratingRouter.post('/rateStream', verifyUser, createRatingOnStreamController)
ratingRouter.get('/getRatingOfVideo/:videoId', verifyUser, getRatingOfVideoController)
ratingRouter.get('/getRatingOfStream/:livestreamId', verifyUser, getRatingOfLivestreamController)


module.exports = ratingRouter;
