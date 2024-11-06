const { renewTopVideos } = require("../../../services/videoService");
const { set } = require("../base/redisBaseService");
const _redis = require("../config");
const cron = require('node-cron');

const getFilteredSortedTopVideos = async (criteria, sortBy, page = 1, limit = 10, sortDirection = 'desc') => {
    try {
        const { category, level } = criteria;

        // Input validation
        if (!['score', 'views', 'duration'].includes(sortBy)) {
            return { status: 400, message: 'Invalid sortBy parameter' };
        }

        // Calculate pagination
        const start = (page - 1) * limit;
        const stop = start + limit - 1;

        // Generate cache key for the filtered result
        const cacheKey = `temp:filtered:${category || 'all'}:${level || 'all'}:${sortBy}:${sortDirection}`;

        // Check if we have cached results
        const cachedResult = await _redis.exists(cacheKey);
        if (cachedResult) {
            const videoIds = sortDirection === 'desc'
                ? await _redis.zrevrange(cacheKey, start, stop)
                : await _redis.zrange(cacheKey, start, stop);

            if (!videoIds.length) {
                return { status: 200, data: [] };
            }

            const videos = await _redis.hmget('video:details', videoIds);
            return {
                status: 200,
                data: videos.map(v => v && JSON.parse(v)).filter(Boolean)
            };
        }

        // Get the base set of video IDs based on filters
        let filterKeys = [];

        if (category) {
            filterKeys.push(`video:cate:${category.toLowerCase()}`);
        }
        if (level) {
            filterKeys.push(`video:level:${level.toLowerCase()}`);
        }

        // If we have multiple filters, we need to find the intersection
        let filteredIds;
        if (filterKeys.length > 1) {
            const tempKey = `temp:${Date.now()}:filter`;
            await _redis.sinterstore(tempKey, ...filterKeys);
            filteredIds = await _redis.smembers(tempKey);
            await _redis.del(tempKey);
        } else if (filterKeys.length === 1) {
            filteredIds = await _redis.smembers(filterKeys[0]);
        }

        // If we have filters but no results, return empty
        if (filterKeys.length > 0 && (!filteredIds || !filteredIds.length)) {
            return { status: 200, data: [] };
        }

        // Sort the results using the appropriate sorted set
        const sortedSetKey = `video:by_${sortBy}`;

        if (filteredIds) {
            // If we have filters, we need to create a temporary sorted set with only our filtered IDs
            await _redis.zinterstore(cacheKey, 2, sortedSetKey, filterKeys[0], 'WEIGHTS', 1, 0);
        } else {
            // If no filters, we can just copy the entire sorted set
            await _redis.zunionstore(cacheKey, 1, sortedSetKey);
        }

        // Set cache expiry
        await _redis.expire(cacheKey, 3600); // Cache for 1 hour

        // Get paginated results
        const videoIds = sortDirection === 'desc'
            ? await _redis.zrevrange(cacheKey, start, stop)
            : await _redis.zrange(cacheKey, start, stop);

        if (!videoIds.length) {
            return { status: 200, data: [] };
        }

        // Get video details
        const videos = await _redis.hmget('video:details', videoIds);

        // Calculate total results for pagination
        const total = await _redis.zcard(cacheKey);

        return {
            status: 200,
            data: videos.map(v => v && JSON.parse(v)).filter(Boolean),
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };

    } catch (error) {
        console.error('Error in getFilteredSortedTopVideos:', error);
        return {
            status: 500,
            message: 'Internal server error',
            error: error.message
        };
    }
};

const createHashmapFromDBData = async (data) => {

    // Khởi tạo hashMap để lưu các video
    const videoDetailsMap = {};

    // Duyệt qua từng category trong result.data
    data.forEach(category => {
        category.videos.forEach(video => {
            // Tạo một đối tượng chi tiết video đơn giản
            const videoData = {
                id: video.id,
                channelId: video.channelId,
                categoryId: video.categoryId,
                categoryName: category.categoryName, // Thêm tên danh mục
                title: video.title,
                description: video.description,
                videoUrl: video.videoUrl,
                thumbnailUrl: video.thumbnailUrl,
                isCommentable: video.isCommentable,
                viewCount: video.viewCount,
                totalShare: video.totalShare,
                duration: video.duration,
                level: video.levelWorkout.levelWorkout,
                status: video.status,
                isBanned: video.isBanned,
                createdAt: video.createdAt,
                updatedAt: video.updatedAt,
                score: video.dataValues.score
            };

            // Thêm video vào hashMap với video.id làm key
            videoDetailsMap[video.id] = videoData;
        });
    });
    console.log("Tao check: ", videoDetailsMap);

    return videoDetailsMap;
}

// Cấu hình cron job chạy mỗi 30 phút
cron.schedule('*/30000 * * * *', async () => {
    try {
        console.log('Cron job started to renew top videos...');
        let result;
        try {
            result = await renewTopVideos();
          } catch (error) {
            console.error('Error in cron job execution:', error);
          }

        let videoHashMapDetails = await createHashmapFromDBData(result.data);
        if (result.status !== 200 || !result.data) {
            console.log('No top videos fetched.');
            return;
        }
        // const pipeline = _redis.pipeline();
        const categorySets = {};
        const levelSets = {};
        const sortedSets = {};

        Object.entries(videoHashMapDetails).forEach(([videoId, videoData]) => {
            // Clean the videoId
            const cleanedVideoId = String(videoId).replace(/^"|"$/g, '');

            const {
                categoryName,
                score,
                viewCount,
                duration,
                level
            } = videoData;

            const normalizedCategory = categoryName.toLowerCase().trim();
            const normalizedLevel = level.toLowerCase().trim();

            // Add to category and level sets
            if (!categorySets[normalizedCategory]) {
                categorySets[normalizedCategory] = new Set();
            }
            if (!levelSets[normalizedLevel]) {
                levelSets[normalizedLevel] = new Set();
            }

            categorySets[normalizedCategory].add(cleanedVideoId);
            levelSets[normalizedLevel].add(cleanedVideoId);

            // Initialize and add to sorted sets
            if (!sortedSets.score) sortedSets.score = new Map();
            if (!sortedSets.views) sortedSets.views = new Map();
            if (!sortedSets.duration) sortedSets.duration = new Map();

            sortedSets.score.set(cleanedVideoId, parseFloat(score) || 0);
            sortedSets.views.set(cleanedVideoId, parseInt(viewCount) || 0);
            sortedSets.duration.set(cleanedVideoId, parseInt(duration) || 0);
        });

        // Save to Redis
        const pipeline = _redis.pipeline();

        // Save category sets
        Object.entries(categorySets).forEach(([category, videoIds]) => {
            if (videoIds.size > 0) {
                pipeline.sadd(`video:cate:${category}`, ...Array.from(videoIds));
            }
        });

        // Save level sets
        Object.entries(levelSets).forEach(([level, videoIds]) => {
            if (videoIds.size > 0) {
                pipeline.sadd(`video:level:${level}`, ...Array.from(videoIds));
            }
        });

        // Save sorted sets
        Object.entries(sortedSets).forEach(([field, valueMap]) => {
            if (valueMap.size > 0) {
                const key = `video:by_${field}`;
                const entries = Array.from(valueMap.entries()).flatMap(
                    ([id, score]) => [score, id]
                );
                pipeline.zadd(key, ...entries);
            }
        });

        // Save video details
        const videoDetails = Object.entries(videoHashMapDetails).reduce((acc, [id, data]) => {
            const cleanedId = String(id).replace(/^"|"$/g, '');
            acc[cleanedId] = JSON.stringify({
                ...data,
                id: cleanedId
            });
            return acc;
        }, {});

        pipeline.hset('video:details', videoDetails);

        await pipeline.exec();
        console.log('Top videos updated and cached in Redis successfully.');
    } catch (error) {
      console.error('Error in cron job execution:', error);
    }
});

module.exports = {
    getFilteredSortedTopVideos,
    createHashmapFromDBData
};
