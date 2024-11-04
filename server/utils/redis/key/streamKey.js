const StreamKeys = {
    currentViews: (channelId) => `channelStreamId:${channelId}:currentViews`,
    highestViews: (channelId) => `channelStreamId:${channelId}:highestViews`,
    totalViews: (channelId) => `channelStreamId:${channelId}:totalViews`,
    totalReacts: (channelId) => `channelStreamId:${channelId}:totalReacts`,
    totalShares: (channelId) => `channelStreamId:${channelId}:totalShares`,
    totalReps: (channelId) => `channelStreamId:${channelId}:totalReps`,
    avgRates: (channelId) => `channelStreamId:${channelId}:avgRates`,
    totalLikes: (channelId) => `channelStreamId:${channelId}:totalLikes`
};

module.exports = StreamKeys;
