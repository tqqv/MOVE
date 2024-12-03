const  {increment, decrement, set, get, remove} = require("../../redis/base/redisBaseService.js");
const  streamKeys = require("../../redis/key/streamKey.js");
const _redis = require("../config.js");
const db = require("../../../models/index.js");
const { isValidUUID } = require('../../formatChecker.js');
const { Livestream, User } = db;

const updateStreamStats = async (channelId, action, field, amount) => {
    const key = streamKeys[field](channelId);
    try {
        switch (action) {
            case 'increment': {
                let newValue;
                if (field === 'currentViews') {
                    newValue = await increment(key, amount);

                    const highestKey = streamKeys.highestViews(channelId);
                    const highest = parseInt(await get(highestKey) || '0');
                    if (newValue > highest) {
                        await set(highestKey, newValue);
                    }
                }
                else if (field === 'totalLikes' || field === 'totalShares' || field === 'totalViews' || field === 'newFollowers') {
                    newValue = await increment(key, amount);
                }
                else if (field === 'totalReps') {
                    newValue = await increment(key, amount);
                    // handle save top 5 donator
                    //
                    //
                } else if (field === 'avgRates') {
                    // update if needed
                    return;
                }
                return newValue;
            }
            case 'decrement': {
                if (field === 'currentViews') {

                if((await getStreamStats(channelId)).currentViews > 0) {
                    return await decrement(key, amount);
                }
                }
                else if ( field === 'totalLikes' || field === 'newFollowers') {
                        return await decrement(key, amount);
                }
                else {
                    console.log("not handle");
                    return;
                }
            }
        }
    } catch (error) {
        console.log(`Error updating stream stats for ${channelId}:`, error);
        throw error;
    }
};

const getStreamStats = async (channelId) => {
    try {
        const pipeline = _redis.pipeline();

        Object.values(streamKeys).forEach(keyFn => {
            pipeline.get(keyFn(channelId));
        });

        const results = await pipeline.exec();
        const topDonators = await getTopDonatorsWithDetails(channelId);
        // update chỗ ni bằng cách loop qua file enum rồi sẽ dynamic
        const statistics = {
            currentViews: parseInt(results[0][1] || '0'),
            highestViews: parseInt(results[1][1] || '0'),
            totalViews: parseInt(results[2][1] || '0'),
            totalReacts: parseInt(results[3][1] || '0'),
            totalShares: parseInt(results[4][1] || '0'),
            totalReps: parseInt(results[5][1] || '0'),
            avgRates: parseFloat(results[6][1] || '0'),
            totalLikes: parseInt(results[7][1] || '0'),
            newFollowers: parseInt(results[8][1] || '0'),
            topDonators
        };
        let liveStatus = await get(`channel_${channelId}_live_status`);
        console.log(statistics);
        console.log(liveStatus);
        return statistics;
    } catch (error) {
        console.log(`Error getting stream stats for ${channelId}:`, error);
        throw error;
    }
};

const clearStreamStats = async (channelId) => {
    try {
        const pipeline = _redis.pipeline();

        Object.values(streamKeys).forEach(keyFn => {
            pipeline.del(keyFn(channelId));
        });
        remove(`channel_${channelId}_live_status`);
        await pipeline.exec();
    } catch (error) {
        console.log(`Error clearing stream stats for ${channelId}:`, error);
        throw error;
    }
};


const getTopDonatorsWithDetails = async (channelId) => {
    const redisKey = streamKeys["topDonators"](channelId);
    try {
        // 1. Lấy danh sách userId và scores từ Redis
        const result = await _redis.zrevrange(redisKey, 0, -1, 'WITHSCORES');
        const userIdsWithScores = [];
        for (let i = 0; i < result.length; i += 2) {
            userIdsWithScores.push({
                userId: result[i],
                totalReps: parseFloat(result[i + 1]),
            });
        }

        // 2. Lấy thông tin user từ bảng User
        const userIds = userIdsWithScores.map((item) => item.userId);
        const users = await User.findAll({
            where: {
                id: userIds,
            },
            attributes: ['id', 'username', 'avatar'], // Chỉ lấy các trường cần thiết
        });

        // 3. Kết hợp thông tin từ Redis và User
        const topDonators = userIdsWithScores.map((entry) => {
            const user = users.find((u) => u.id === entry.userId);
            return {
                userId: entry.userId,
                username: user?.username || 'Unknown',
                avatar: user?.avatar || '',
                totalReps: entry.totalReps,
            };
        });
        return topDonators
    } catch (error) {
        console.error(`Error getting top donators with details for ${channelId}:`, error);
        throw error;
    }
};

const reRankingTopDonators = async (channelId, donator, totalDonate) => {
    const key = streamKeys["topDonators"](channelId);
    try {
        const userId = donator.userId;

        // Lấy toàn bộ danh sách userId theo thứ tự giảm dần
        const currentTopDonators = await _redis.zrevrange(key, 0, -1, 'WITHSCORES');

        // Tìm userId trùng khớp
        const existingDonatorIndex = currentTopDonators.findIndex((item, index) => {
            return index % 2 === 0 && item === userId;
        });

        // Nếu đã tồn tại, update score (totalReps)
        if (existingDonatorIndex !== -1) {
            await _redis.zadd(key, totalDonate, userId);
            return;
        }

        const currentCount = currentTopDonators.length / 2;

        // Nếu chưa đủ top
        if (currentCount < 7) {
            await _redis.zadd(key, totalDonate, userId);
            return;
        }

        // Lấy userId có điểm thấp nhất trong top
        const lowestScore = parseFloat(currentTopDonators[currentTopDonators.length - 1]);

        if (totalDonate > lowestScore) {
            const lowestUserId = currentTopDonators[currentTopDonators.length - 2];

            // Xóa userId có điểm thấp nhất
            await _redis.zrem(key, lowestUserId);

            // Thêm userId mới
            await _redis.zadd(key, totalDonate, userId);
        }

        // Giới hạn top 7
        await _redis.zremrangebyrank(key, 7, -1);

    } catch (error) {
        console.log(`Error updating stream stats for ${channelId}:`, error);
        throw error;
    }
};

////////////////

const takeSnapshot = async (channelId) => {
    try {
        // Sử dụng pipeline để lấy tất cả metrics cùng lúc
        const pipeline = _redis.pipeline();

        // Thêm tất cả commands vào pipeline
        Object.values(streamKeys).forEach(keyFn => {
            pipeline.get(keyFn(channelId));
        });

        // Thực thi pipeline
        const results = await pipeline.exec();
        console.log("results: ", results);

        // Parse kết quả từ pipeline
        const [
            currentViewsResult,
            highestViewsResult,
            totalViewsResult,
            totalReactsResult,
            totalSharesResult,
            totalRepsResult,
            avgRatesResult,
            totalLikesResult
        ] = results.map(result => result[1]); // result[1] là giá trị, result[0] là error nếu có

        // Tạo object chứa snapshot data
        const snapshotData = {
            channelId,
            metrics: {
                currentViews: parseInt(currentViewsResult) || 0,
                highestViews: parseInt(highestViewsResult) || 0,
                totalViews: parseInt(totalViewsResult) || 0,
                totalReacts: parseInt(totalReactsResult) || 0,
                totalShares: parseInt(totalSharesResult) || 0,
                totalReps: parseInt(totalRepsResult) || 0,
                avgRates: parseFloat(avgRatesResult) || 0,
                totalLikes: parseInt(totalLikesResult) || 0
            }
        };

        // Lưu snapshot vào database
        await saveSnapshot(snapshotData.metrics, channelId);
        return snapshotData;
    } catch (error) {
        console.log(`Error taking snapshot for stream ${channelId}:`, error);
        throw new Error(`Failed to take snapshot: ${error.message}`);
    }
};

const saveSnapshot = async (snapshotMetrics, channelId) => {
    try {
        let livestream = await Livestream.findOne({where: { streamerId: channelId, isLive: true }});

        livestream.update(
            {
                highestViewAtSameTime: snapshotMetrics.highestViews,
                totalView: snapshotMetrics.totalViews,
                totalShare: snapshotMetrics.totalShares,
            });
    } catch (error) {
        console.log('Error saving snapshot to database:', error);
        throw new Error(`Failed to save snapshot: ${error.message}`);
    }
};

const takeFinalSnapshot = async (channelId) => {
    try {
        // Lấy snapshot cuối cùng
        const finalSnapshot = await takeSnapshot(channelId);
        // Cleanup Redis keys
        await clearStreamStats(channelId);
        console.log("Final snapshot success!");

        return finalSnapshot;
    } catch (error) {
        logger.error(`Error taking final snapshot for stream ${channelId}:`, error);
        throw new Error(`Failed to take final snapshot: ${error.message}`);
    }
};

const filterRoomsForDeletion = (rooms) => {
    // Chuyển rooms thành mảng nếu chưa phải
    const roomsArray = Array.from(rooms);

    // Filter rooms theo điều kiện và chỉ map với currentViews
    const roomKeys = roomsArray
        .filter(room => (isValidUUID(room) || room == '3'))
        .map(room => streamKeys.currentViews(room));

    return roomKeys;
};


module.exports = {
    // Stream specific operations
    updateStreamStats,
    getStreamStats,
    clearStreamStats,
    // setupPeriodicSnapshot
    takeFinalSnapshot,
    filterRoomsForDeletion,
    reRankingTopDonators
};
