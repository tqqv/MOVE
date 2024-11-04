// redis/config.js
const Redis = require('ioredis');

const redisConfig = {
    host: process.env.REDIS_HOST,   // Địa chỉ Redis container trên Docker Desktop
    port: 6379
};

const _redis = new Redis(redisConfig);

module.exports = _redis;
