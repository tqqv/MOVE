const express = require('express');
const { verifyStreamer } = require('../middlewares/verifyToken');
const { createLivestreamController, getLivestreamStatisticController, endLivestreamController, updateLivestreamController, getLivestreamController, getLivestreamByUserController, getAllLivestreamController} = require('../controllers/livestreamController');
const { getStreamStats, clearStreamStats } = require('../utils/redis/stream/redisStreamService');
const { set } = require('../utils/redis/base/redisBaseService');

const livestreamRouter = express.Router();

livestreamRouter.get('/test', () => {
    _redis.del('channel_3_live_status')
})

livestreamRouter.get('/set', async () => {
    await set(`channelStreamId:4:currentViews`, 40000)
})

livestreamRouter.get('/stats', async () => {
    console.log(getStreamStats(4));
})
livestreamRouter.get('/clear', async () => {
    console.log(clearStreamStats(3));
})
livestreamRouter.get('/all', getAllLivestreamController)
livestreamRouter.get('/:username', getLivestreamByUserController)
livestreamRouter.get('/info/:username', verifyStreamer, getLivestreamController)
livestreamRouter.post('/', verifyStreamer, createLivestreamController)
livestreamRouter.post('/endStream/:livestreamId', verifyStreamer, endLivestreamController)
// livestreamRouter.get('/stats', getLivestreamStatisticController)
livestreamRouter.patch('/update', updateLivestreamController)

module.exports = livestreamRouter;
