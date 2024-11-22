const db = require("../../../../models");
const { ViewVideo, Rating, Video, Sequelize } = db;

const calculateInteractionScore = (viewTime, duration, reaction, rating) => {
  const watchScore = viewTime / duration;
  return watchScore * (1 + reaction * 0.5) * rating;
};

const generateUserProfile = async (userId, embeddings) => {
  // Validate embeddings array
  if (!Array.isArray(embeddings) || embeddings.length === 0) {
    throw new Error('embeddings must be a non-empty array');
  }

  const EMBEDDING_DIMENSION = 384;

  // Trả về cold start profile nếu không có userId
  if (!userId) {
    console.log('No userId provided, returning cold start profile');
    return new Array(EMBEDDING_DIMENSION).fill(0);
  }

  try {
    const historyInteractions = await ViewVideo.findAll({
      where: {
        viewerId: userId,
        updatedAt: {
          [Sequelize.Op.gte]: Sequelize.literal(`DATE_SUB(NOW(), INTERVAL 30 DAY)`),
        },
      },
      attributes: ['viewTime', 'videoId'],
      include: [{
        model: Video,
        as: "viewVideosVideo",
        attributes: ['duration'],
        include: [
          {
            model: Rating,
            as: "ratings",
            attributes: ['rating']
          },
        ],
      }],
    });

    // Trả về cold start profile nếu không có lịch sử tương tác
    if (!historyInteractions || historyInteractions.length === 0) {
      console.log('No interaction history found, returning cold start profile');
      return new Array(EMBEDDING_DIMENSION).fill(0);
    }

    // Validate embedding dimension
    const firstValidEmbedding = embeddings.find(e => Array.isArray(e.embedding))?.embedding;
    if (firstValidEmbedding && firstValidEmbedding.length !== EMBEDDING_DIMENSION) {
      throw new Error(`Invalid embedding dimension. Expected ${EMBEDDING_DIMENSION}, got ${firstValidEmbedding.length}`);
    }

    let userProfile = new Array(EMBEDDING_DIMENSION).fill(0);
    let totalScore = 0;

    historyInteractions.forEach((interaction) => {
      if (!interaction || !interaction.videoId) {
        console.warn('Skipping invalid interaction');
        return;
      }

      const videoEmbeddingObj = embeddings.find(e => e.videoId === interaction.videoId);

      console.log('Interaction details:', {
        viewTime: interaction.viewTime,
        duration: interaction.viewVideosVideo?.duration,
        rating: interaction.viewVideosVideo?.ratings?.rating,
        videoId: interaction.videoId,
      });

      if (videoEmbeddingObj && Array.isArray(videoEmbeddingObj.embedding)) {
        const interactionScore = calculateInteractionScore(
          interaction.viewTime || 0,
          interaction.viewVideosVideo?.duration || 1,
          1,
          interaction.viewVideosVideo?.ratings?.rating || 1
        );

        console.log(`Calculated interaction score: ${interactionScore}`);

        videoEmbeddingObj.embedding.forEach((value, index) => {
          if (typeof value === 'number' && !isNaN(value)) {
            userProfile[index] += value * interactionScore;
          } else {
            console.warn(`Invalid embedding value at index ${index} for video_id: ${interaction.videoId}`);
          }
        });

        totalScore += interactionScore;
      } else {
        console.warn(`No embedding found for video_id: ${interaction.videoId}`);
      }
    });

    // Chuẩn hóa profile nếu có tương tác
    if (totalScore > 0) {
      userProfile = userProfile.map(value => value / totalScore);
    }

    return userProfile;
  } catch (error) {
    console.error('Error generating user profile:', error);
    // Trong trường hợp lỗi, vẫn trả về cold start profile thay vì throw error
    console.log('Returning cold start profile due to error');
    return new Array(EMBEDDING_DIMENSION).fill(0);
  }
};

module.exports = {
  generateUserProfile
};
