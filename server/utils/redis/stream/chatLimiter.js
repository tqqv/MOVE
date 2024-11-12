const { get } = require("../base/redisBaseService");
const _redis = require("../config");

// Rate limit constants
const RATE_LIMIT_WINDOW = 60; // 1 phút
const MAX_MESSAGES_PER_WINDOW = 20; // Số tin nhắn tối đa trong 1 phút
const BLOCK_DURATION = 300; // Thời gian block nếu vượt quá limit (5 phút)

const getRateLimitKey = (userId) => {
    return `rate_limit:chat:${userId}`;
}

const getBlockedKey = (userId) => {
    return `rate_limit:blocked:${userId}`;
}

const isBlocked = async (userId) => {
    const blockedKey = getBlockedKey(userId);
    const isBlocked = await get(blockedKey);
    return !!isBlocked;
}

const blockUser = async (userId) => {
    const blockedKey = getBlockedKey(userId);
    await _redis.setex(blockedKey, BLOCK_DURATION, '1');
}

const checkRateLimit = async (userId) => {
    const rateLimitKey = getRateLimitKey(userId);

    // Kiểm tra xem user có đang bị block
    const blocked = await isBlocked(userId);
    if (blocked) {
        const ttl = await _redis.ttl(getBlockedKey(userId));
        return {
            allowed: false,
            blocked: true,
            remainingTime: ttl,
            reason: 'User is temporarily blocked due to rate limit violation'
        };
    }

    // Sử dụng pipeline để thực hiện nhiều operations
    const pipeline = _redis.pipeline();

    // Tăng counter và set expiry
    pipeline.incr(rateLimitKey);
    pipeline.expire(rateLimitKey, RATE_LIMIT_WINDOW);

    const results = await pipeline.exec();
    const messageCount = results[0][1]; // Lấy kết quả của incr

    // Nếu vượt quá giới hạn
    if (messageCount > MAX_MESSAGES_PER_WINDOW) {
        await blockUser(userId);
        return {
            allowed: false,
            blocked: true,
            remainingTime: BLOCK_DURATION,
            reason: `Exceeded limit of ${MAX_MESSAGES_PER_WINDOW} messages per ${RATE_LIMIT_WINDOW} seconds`
        };
    }

    return {
        allowed: true,
        messageCount,
        remaining: MAX_MESSAGES_PER_WINDOW - messageCount,
        resetIn: await _redis.ttl(rateLimitKey)
    };
}

const resetLimit = async (userId) => {
        const pipeline = _redis.pipeline();
        pipeline.del(getRateLimitKey(userId));
        pipeline.del(getBlockedKey(userId));
        await pipeline.exec();
}

const rateLimitMiddleware = async (userId, next) => {
    try {
        const rateLimitResult = await checkRateLimit(userId);

        if (!rateLimitResult.allowed) {
            throw new Error(rateLimitResult.reason);
        }

        return next();
    } catch (error) {
        throw error;
    }
};

module.exports = {
    rateLimitMiddleware
};
