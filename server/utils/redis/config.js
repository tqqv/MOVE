const Redis = require('ioredis');

const redisConfig = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined, // nếu không đặt pass thì để undefined
  tls: process.env.REDIS_TLS === "true" ? {} : undefined // nếu sau này dùng AWS ElastiCache có TLS
};

const _redis = new Redis(redisConfig);

_redis.on('connect', () => {
  console.log('✅ Connected to Redis');
});

_redis.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

module.exports = _redis;
