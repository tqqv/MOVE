import sys
import json
import logging
import time
import unicodedata
import re
from sentence_transformers import SentenceTransformer

# Cấu hình logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    stream=sys.stderr
)
logger = logging.getLogger(__name__)

def clean_text(text):
    """
    Làm sạch và chuẩn hóa văn bản
    """
    if text is None:
        return ''

    # Chuyển sang chuỗi và loại bỏ khoảng trắng thừa
    text = str(text).strip()

    # Chuẩn hóa ký tự Unicode
    text = unicodedata.normalize('NFKC', text)

    # Loại bỏ ký tự không in được
    text = re.sub(r'[^\x20-\x7E\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]', '', text)

    # Loại bỏ khoảng trắng thừa
    text = re.sub(r'\s+', ' ', text)

    return text.strip()

def generate_embeddings(
    video_data,
    model_name='all-MiniLM-L6-v2',
    batch_size=64  # Tăng batch size
):
    """
    Tạo embeddings cho dữ liệu video
    """
    start_time = time.time()

    # Tải model
    try:
        model = SentenceTransformer(model_name)
        logger.info(f"Đã tải model: {model_name}")
    except Exception as e:
        logger.error(f"Lỗi tải model: {e}")
        return []

    contents = []
    video_ids = []

    # Xử lý và kiểm tra dữ liệu
    for video in video_data:
        try:
            # Làm sạch các trường
            title = clean_text(video.get('title', ''))
            description = clean_text(video.get('description', ''))
            category = clean_text(video.get('category', ''))
            level = clean_text(video.get('level', ''))
            duration = clean_text(video.get('duration', ''))
            view_count = clean_text(video.get('viewCount', ''))

            # Kết hợp các trường
            content = ' '.join(filter(bool, [
                title, description, category,
                level, duration, view_count
            ]))

            # Kiểm tra và thêm nội dung
            if content and 'video_id' in video:
                contents.append(content)
                video_ids.append(str(video['video_id']))
            else:
                logger.warning(f"Bỏ qua video: {video.get('video_id')}")

        except Exception as e:
            logger.error(f"Lỗi xử lý video: {e}")

    # Kiểm tra đầu vào trước khi mã hóa
    if not contents:
        logger.warning("Không có nội dung hợp lệ để xử lý")
        return []

    try:
        # Chuyển đổi rõ ràng sang danh sách chuỗi
        clean_contents = [str(content) for content in contents]

        # Tạo embeddings với xử lý batch
        embeddings_list = model.encode(
            clean_contents,
            show_progress_bar=True,
            batch_size=batch_size,
            convert_to_numpy=True
        )

        # Tạo danh sách từ điển
        embeddings = [
            {"videoId": video_id, "embedding": embedding.tolist()}
            for video_id, embedding in zip(video_ids, embeddings_list)
        ]

        # Ghi log hiệu suất
        end_time = time.time()
        logger.info(f"Thời gian tạo embedding: {end_time - start_time:.2f} giây")
        logger.info(f"Đã tạo {len(embeddings)} embedding")

        return embeddings

    except Exception as e:
        logger.error(f"Lỗi tạo embedding: {e}")
        return []

# Đọc dữ liệu đầu vào từ stdin
input_data = sys.stdin.read().strip()

# Ghi log độ dài dữ liệu để debug
logger.info(f"Độ dài dữ liệu đầu vào: {len(input_data)}")

try:
    # Phân tích đầu vào JSON
    video_data = json.loads(input_data)

    # Tạo embeddings
    embeddings = generate_embeddings(video_data)

    # Debug: Ghi log số lượng embeddings
    logger.info(f"Số lượng embedding được tạo: {len(embeddings)}")

    # Đảm bảo đầu ra JSON đến stdout
    json.dump(embeddings, sys.stdout)
    sys.stdout.flush()

except json.JSONDecodeError as e:
    logger.error(f"Lỗi JSON không hợp lệ: {e}")
    json.dump([], sys.stdout)
    sys.stdout.flush()
except Exception as e:
    logger.error(f"Lỗi không mong muốn: {e}")
    json.dump([], sys.stdout)
    sys.stdout.flush()
