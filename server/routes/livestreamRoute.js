const express = require('express');
const { verifyStreamer } = require('../middlewares/verifyToken');
const { createLivestreamController, getLivestreamStatisticController, endLivestreamController} = require('../controllers/livestreamController');
const livestreamRouter = express.Router();


livestreamRouter.post('/', verifyStreamer, createLivestreamController)
livestreamRouter.post('/endStream/:livestreamId', verifyStreamer, endLivestreamController)
livestreamRouter.get('/stats', getLivestreamStatisticController)

module.exports = livestreamRouter;
