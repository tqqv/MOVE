const { lpush, lrange, ltrim, increment, get } = require("../base/redisBaseService.js");
const chatKeys = require("../key/chatKey.js");
const _redis = require("../config.js");
const { isValidUUID } = require('../../formatChecker.js');
const { rateLimitMiddleware } = require("./chatLimiter.js");

const MESSAGE_LIMIT = 100;
const MESSAGE_EXPIRY = 60 * 60; // 1 hours

const handleChatMessage = async (channelId, messageData) => {
    try {
        // Validate channelId
        if (!isValidUUID(channelId)) {
            throw new Error('Invalid channel ID');
        }

        // Check rate limit trước khi xử lý message
        await rateLimitMiddleware(messageData.userId, async () => {
            const messagesKey = chatKeys.messages(channelId);
            const pipeline = _redis.pipeline();

            // Lưu message
            pipeline.lpush(messagesKey, JSON.stringify(messageData));
            pipeline.ltrim(messagesKey, 0, MESSAGE_LIMIT - 1);
            pipeline.expire(messagesKey, MESSAGE_EXPIRY);

            await pipeline.exec();
        });


        // Trả về messageData để broadcast
        return messageData;

    } catch (error) {
        if (error.message.includes('rate limit')) {
            // Xử lý rate limit error
            throw {
                code: 'RATE_LIMIT_EXCEEDED',
                message: error.message
            };
        }
        console.log(`Error handling chat message for ${channelId}:`, error);
        throw error;
    }
};

const getChatHistory = async (channelId) => {
    try {
        if (!isValidUUID(channelId)) {
            throw new Error('Invalid channel ID');
        }

        const messagesKey = chatKeys.messages(channelId);

        // Lấy tin nhắn gần nhất
        const messages = await lrange(messagesKey, 0, MESSAGE_LIMIT - 1);

        // Parse JSON messages
        return messages.map(msg => JSON.parse(msg));

    } catch (error) {
        console.log(`Error getting chat history for ${channelId}:`, error);
        throw error;
    }
};

const getChatStats = async (channelId) => {
    try {
        if (!isValidUUID(channelId)) {
            throw new Error('Invalid channel ID');
        }

        const pipeline = _redis.pipeline();

        // Lấy các stats cần thiết
        Object.values(chatKeys).forEach(keyFn => {
            pipeline.get(keyFn(channelId));
        });

        const results = await pipeline.exec();

        return {
            // totalMessages: parseInt(results[1][1] || '0'),
            // Thêm các stats khác nếu cần
        };

    } catch (error) {
        console.log(`Error getting chat stats for ${channelId}:`, error);
        throw error;
    }
};

const clearChatData = async (channelId) => {
    try {
        if (!isValidUUID(channelId)) {
            throw new Error('Invalid channel ID');
        }

        const pipeline = _redis.pipeline();

        // Xóa tất cả keys liên quan đến chat của channel
        Object.values(chatKeys).forEach(keyFn => {
            pipeline.del(keyFn(channelId));
        });

        await pipeline.exec();

    } catch (error) {
        console.log(`Error clearing chat data for ${channelId}:`, error);
        throw error;
    }
};

// Middleware để validate message (nếu cần)
const validateMessage = (message) => {
    // Thêm validation logic
    if (!message || !message.trim()) {
        throw new Error('Message cannot be empty');
    }
    // Thêm các validation khác: length, content, etc.
    return true;
};

module.exports = {
    handleChatMessage,
    getChatHistory,
    getChatStats,
    clearChatData,
    validateMessage
};
