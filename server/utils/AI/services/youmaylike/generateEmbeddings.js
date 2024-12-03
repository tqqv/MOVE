const { exec } = require('child_process');
const _redis = require('../../../redis/config');
const crypto = require('crypto');

// Hàm tạo mã hash từ dữ liệu video
const generateVideoDataHash = (videoData) => {
  return crypto.createHash('md5')
    .update(JSON.stringify(videoData))
    .digest('hex');
};

// Hàm tạo embedding cho video với logic cache
const generateVideoEmbeddings = async () => {
  try {
    // Kiểm tra cache embedding trước
    const cachedEmbeddings = await _redis.get('video:embeddings:cache');
    if (cachedEmbeddings) {
      try {
        return JSON.parse(cachedEmbeddings);
      } catch (parseError) {
        console.warn('Lỗi parse cache embeddings, sẽ tạo mới:', parseError);
      }
    }

    // Lấy thông tin video từ Redis
    const videos = await _redis.hgetall("topvideo:details");
    console.log('Số lượng video:', Object.keys(videos).length);

    // Chuyển đổi dữ liệu cho Python script
    const videoData = Object.values(videos)
      .map((videoJson) => {
        if (videoJson) {
          const parsedVideo = JSON.parse(videoJson);
          return {
            video_id: parsedVideo.id,
            title: parsedVideo.title,
            description: parsedVideo.description,
            category: parsedVideo.categoryName,
            level: parsedVideo.level,
            duration: parsedVideo.duration,
            viewCount: parsedVideo.viewCount
          };
        }
        return null;
      })
      .filter(Boolean); // Loại bỏ giá trị null nếu có video không hợp lệ

    return new Promise((resolve, reject) => {
      const process = exec('python D:/QuangVu/company/madison/MOVE/server/utils/AI/models/generateEmbeddings.py', (error, stdout, stderr) => {
        if (error) {
          console.error('Lỗi khi gọi script Python:', error.message);
          reject(`exec error: ${error}`);
          return;
        }
        if (stderr) {
          console.error('Stderr từ script Python:', stderr);
        }

        try {
          // Trim stdout để loại bỏ whitespace không mong muốn
          const cleanStdout = stdout.trim();
          // Parse kết quả từ Python (JSON string)
          const embeddings = JSON.parse(cleanStdout || '{}');

          // Lưu cache embeddings với thời gian sống (TTL)
          _redis.set('video:embeddings:cache', JSON.stringify(embeddings), 'EX', 24 * 60 * 60); // Cache 24 giờ

          // Tạo stream cho việc tracking embeddings
          const embeddingHash = generateVideoDataHash(videoData);
          _redis.xadd('video:embeddings:stream', '*',
            'hash', embeddingHash,
            'timestamp', Date.now(),
            'video_count', videoData.length
          );

          resolve(embeddings);
        } catch (parseError) {
          console.error('Lỗi khi parse kết quả Python:', parseError);
          console.error('Raw stdout:', stdout);
          reject(parseError);
        }
      });

      // Gửi dữ liệu JSON tới script Python qua stdin
      process.stdin.write(JSON.stringify(videoData));
      process.stdin.end();
    });
  } catch (error) {
    console.error('Error in generateVideoEmbeddings:', error);
    throw error;
  }
};

// Hàm lấy thông tin tracking embeddings
const getEmbeddingsTrackingInfo = async () => {
  try {
    // Lấy thông tin mới nhất từ stream
    const streamInfo = await _redis.xrevrange('video:embeddings:stream', '+', '-', 'COUNT', 1);

    if (streamInfo && streamInfo.length > 0) {
      const [id, fields] = streamInfo[0];
      const fieldsObj = Object.fromEntries(fields.map((f, i) => i % 2 === 0 ? [f, fields[i+1]] : null).filter(Boolean));

      return {
        hash: fieldsObj.hash,
        timestamp: fieldsObj.timestamp ? parseInt(fieldsObj.timestamp) : null,
        videoCount: fieldsObj.video_count ? parseInt(fieldsObj.video_count) : 0
      };
    }

    return null;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin tracking embeddings:', error);
    return null;
  }
};

module.exports = {
  generateVideoEmbeddings,
  getEmbeddingsTrackingInfo
};
