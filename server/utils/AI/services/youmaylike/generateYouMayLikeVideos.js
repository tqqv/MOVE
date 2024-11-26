const cosineSimilarity = (vecA, vecB) => {
  // Kiểm tra đầu vào
  if (!Array.isArray(vecA) || !Array.isArray(vecB)) {
    console.error('Invalid vectors:', {
      vecAType: typeof vecA,
      vecBType: typeof vecB,
      isVecAArray: Array.isArray(vecA),
      isVecBArray: Array.isArray(vecB)
    });
    return 0;
  }

  try {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (normA * normB);
  } catch (error) {
    console.error('Error in cosineSimilarity:', error);
    return 0;
  }
};

const generateVideosYouMayLike = (userProfile, videoEmbeddings) => {
  try {
    const similarities = videoEmbeddings.map(video => {
      // Kiểm tra cấu trúc của video embedding
      if (!video || !video.videoId || !Array.isArray(video.embedding)) {
        console.warn('Invalid video structure:', video);
        return null;
      }

      const similarity = cosineSimilarity(userProfile, video.embedding);
      return {
        videoId: video.videoId,
        similarity: similarity
      };
    }).filter(item => item !== null); // Loại bỏ các kết quả null

    // Sắp xếp theo độ tương đồng giảm dần
    similarities.sort((a, b) => b.similarity - a.similarity);

    // Trả về top 5 video
    return similarities.slice(0, 8);
  } catch (error) {
    console.error('Error in generateVideosYouMayLike:', error);
    return [];
  }
};

module.exports = {
  generateVideosYouMayLike,
};
