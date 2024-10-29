const express = require('express');
const { verifyStreamer } = require('../middlewares/verifyToken');
const { createLivestreamController, getLivestreamStatisticController} = require('../controllers/livestreamController');
const livestreamRouter = express.Router();


livestreamRouter.post('/', verifyStreamer, createLivestreamController)
livestreamRouter.get('/stats', getLivestreamStatisticController)

module.exports = livestreamRouter;
