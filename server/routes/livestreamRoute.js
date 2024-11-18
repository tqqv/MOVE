const express = require('express');
const { verifyStreamer } = require('../middlewares/verifyToken');
const { createLivestreamController, getLivestreamStatisticController, endLivestreamController, updateLivestreamController, getLivestreamController, getLivestreamByUserController, getAllLivestreamController, getAllLivestreamSessionController, getLivestreamSessionDetailController} = require('../controllers/livestreamController');
const { getStreamStats, clearStreamStats } = require('../utils/redis/stream/redisStreamService');
const _redis = require('../utils/redis/config');
const { set } = require('../utils/redis/base/redisBaseService');

const livestreamRouter = express.Router();

livestreamRouter.post('/chat', async (req, res) => {
    try {
        // Hard code test data
        const channelId = '3';
        const messageData = {
            userId: '9898',
            avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            username: 'hieu_ne ',
            message: 'Lorem ipsum dolor ',
            timestamp: Date.now()
        };

        const messagesKey = `channelStreamId:${channelId}:messages`;
        const pipeline = _redis.pipeline();

        // Thực hiện các operations Redis
        pipeline.lpush(messagesKey, JSON.stringify(messageData));
        pipeline.ltrim(messagesKey, 0, 100 - 1);
        pipeline.expire(messagesKey, 60*60);

        // Execute pipeline
        const results = await pipeline.exec();
        console.log('Pipeline results:', results);

        // Kiểm tra kết quả lưu trữ
        const savedMessages = await _redis.lrange(messagesKey, 0, -1);
        console.log('Saved messages:', savedMessages);

        res.json({
            success: true,
            message: 'Message saved successfully',
            data: {
                messageKey: messagesKey,
                savedMessage: messageData
            }
        });

    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save message',
            error: error.message
        });
    }
});

livestreamRouter.get('/chat', async (req, res) => {
});

livestreamRouter.get('/chatHistory', async () => {
    let messages = await getChatHistory("65");
    console.log("messages: ", messages);
})
livestreamRouter.post('/clearChatRoom', async () => {
    await remove("channelStreamId:3:messages");
})


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
livestreamRouter.get('/streamSessions', verifyStreamer, getAllLivestreamSessionController)
livestreamRouter.get('/streamDetails/:livestreamId', verifyStreamer, getLivestreamSessionDetailController)
livestreamRouter.get('/:username', getLivestreamByUserController)
livestreamRouter.get('/info/:username', verifyStreamer, getLivestreamController)
livestreamRouter.post('/', verifyStreamer, createLivestreamController)
livestreamRouter.post('/endStream/:livestreamId', verifyStreamer, endLivestreamController)
// livestreamRouter.get('/stats', getLivestreamStatisticController)
livestreamRouter.patch('/update', updateLivestreamController)

module.exports = livestreamRouter;
