const db = require("../../../../models");
const { ViewVideo, Rating, Video, Sequelize } = db;

const calculateInteractionScore = (viewTime, duration, reaction, rating) => {
  const watchScore = viewTime / duration;
  return watchScore * (1 + reaction * 0.5) * rating;
};

const generateUserProfile = async (userId, embeddings) => {
  const historyInteractions = await ViewVideo.findAll({
    where: {
      viewerId: userId,
      updatedAt: {
        [Sequelize.Op.gte]: Sequelize.literal(`DATE_SUB(NOW(), INTERVAL 30 DAY)`),
      },
    },
    attributes: ['viewTime', 'videoId'], // Thêm videoId vào attributes
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

  // Khởi tạo mảng profile với số chiều bằng với embedding (384)
  const EMBEDDING_DIMENSION = 384;
  let userProfile = new Array(EMBEDDING_DIMENSION).fill(0);
  let totalScore = 0;

  historyInteractions.forEach((interaction) => {
    const videoEmbeddingObj = embeddings.find(e => e.videoId === interaction.videoId);

    // Log thông tin tương tác
    console.log('Interaction details:', {
      viewTime: interaction.viewTime,
      duration: interaction.viewVideosVideo?.duration,
      rating: interaction.viewVideosVideo?.ratings?.rating,
      videoId: interaction.videoId,
    });

    if (videoEmbeddingObj && Array.isArray(videoEmbeddingObj.embedding)) {
      const interactionScore = calculateInteractionScore(
        interaction.viewTime,
        interaction.viewVideosVideo?.duration || 1, // Tránh chia cho 0
        1,
        interaction.viewVideosVideo?.ratings?.rating || 1 // Mặc định rating là 1 nếu không tồn tại
      );

      console.log(`Calculated interaction score: ${interactionScore}`);

      videoEmbeddingObj.embedding.forEach((value, index) => {
        userProfile[index] += value * interactionScore;
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
};

module.exports = {
  generateUserProfile
};
