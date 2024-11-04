const express = require('express');
const { verifyStreamer } = require('../middlewares/verifyToken');
const { createLivestreamController, getLivestreamStatisticController, endLivestreamController, updateLivestreamController, getLivestreamController, getLivestreamByUserController} = require('../controllers/livestreamController');

const livestreamRouter = express.Router();

livestreamRouter.get('/test', () => {
    _redis.del('channel_3_live_status')
})
livestreamRouter.get('/:username', getLivestreamByUserController)
livestreamRouter.get('/info/:username', verifyStreamer, getLivestreamController)
livestreamRouter.post('/', verifyStreamer, createLivestreamController)
livestreamRouter.post('/endStream/:livestreamId', verifyStreamer, endLivestreamController)
livestreamRouter.get('/stats', getLivestreamStatisticController)
livestreamRouter.patch('/update', updateLivestreamController)

module.exports = livestreamRouter;
