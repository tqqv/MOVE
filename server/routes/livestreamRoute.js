const express = require('express');
const { verifyStreamer } = require('../middlewares/verifyToken');
const { createLivestreamController, getLivestreamStatisticController, endLivestreamController, updateLivestreamController, getLivestreamController} = require('../controllers/livestreamController');
const livestreamRouter = express.Router();


livestreamRouter.get('/:livestreamId', verifyStreamer, getLivestreamController)
livestreamRouter.post('/', verifyStreamer, createLivestreamController)
livestreamRouter.post('/endStream/:livestreamId', verifyStreamer, endLivestreamController)
livestreamRouter.get('/stats', getLivestreamStatisticController)
livestreamRouter.patch('/update', updateLivestreamController)

module.exports = livestreamRouter;
