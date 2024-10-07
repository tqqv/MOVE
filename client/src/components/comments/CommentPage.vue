<script setup>
  import { ref, onMounted } from 'vue';
  import CommentItem from './CommentItem.vue';
  import { getAllComments, getAllChildComments } from '@/services/comment';
  import WriteComments from './WriteComments.vue';

  const comments = ref([]);
  const childComments = ref({});
  const currentPage = ref(1);
  const commentsPerPage = ref(5);
  const hasMoreComments = ref(true);
  const totalRepliesCount = ref({});

  // bình luận con
  const childCommentsPage = ref({}); // Trang hiện tại cho từng bình luận con
  const childCommentsPerPage = 5; // Số bình luận con mỗi trang
  const hasMoreChildComments = ref({}); // Trạng thái có thêm bình luận con hay không

  const fetchComments = async () => {
    const videoId = 1016042125;
    try {
      const response = await getAllComments(videoId, {
        page: currentPage.value,
        pageSize: commentsPerPage.value,
      });

      if (response.data.success) {
        const newComments = response.data.data;

        // Kiểm tra và loại bỏ bình luận trùng lặp
        newComments.forEach((newComment) => {
          const exists = comments.value.some((comment) => comment.id === newComment.id);
          if (!exists) {
            comments.value.push(newComment);
            if (!totalRepliesCount.value[newComment.id]) {
              totalRepliesCount.value[newComment.id] = newComment.totalRepliesCount || 0;
            }
            hasMoreChildComments.value[newComment.id] = true;
          }
        });

        hasMoreComments.value = newComments.length === commentsPerPage.value;
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchChildComments = async (parentId) => {
    if (!childCommentsPage.value[parentId]) {
      childCommentsPage.value[parentId] = 1;
    }

    const pageInfo = {
      page: childCommentsPage.value[parentId],
      pageSize: childCommentsPerPage,
    };

    try {
      const response = await getAllChildComments(parentId, pageInfo);
      console.log('Child comments for parentId:', parentId, response.data.data);

      if (response.data.success && response.data.data) {
        // Khởi tạo mảng bình luận nếu chưa có
        if (!childComments.value[parentId]) {
          childComments.value[parentId] = [];
        }

        // Lọc các bình luận mới để tránh trùng lặp
        const existingIds = new Set(childComments.value[parentId].map((comment) => comment.id));
        const uniqueNewComments = response.data.data.filter(
          (comment) => !existingIds.has(comment.id),
        );

        // Thêm các bình luận mới không trùng lặp vào danh sách
        childComments.value[parentId].push(...uniqueNewComments);

        // Cập nhật trang và kiểm tra xem có thêm bình luận con để tải không
        hasMoreChildComments.value[parentId] = uniqueNewComments.length === childCommentsPerPage;
        if (hasMoreChildComments.value[parentId]) {
          childCommentsPage.value[parentId]++;
        }
      } else {
        hasMoreChildComments.value[parentId] = false;
        console.warn(`No more child comments found for parent ID ${parentId}`);
      }
    } catch (error) {
      console.error('Error fetching child comments:', error);
    }
  };

  // Hàm tải thêm bình luận (Load More)
  const loadMoreComments = () => {
    if (hasMoreComments.value) {
      currentPage.value++;
      fetchComments();
    }
  };

  const loadMoreChildComments = (parentId) => {
    if (hasMoreChildComments.value[parentId]) {
      fetchChildComments(parentId);
    }
  };

  onMounted(() => {
    fetchComments();
  });
</script>

<template>
  <div class="space-y-8">
    <WriteComments
      :fetchChildComments="fetchChildComments"
      @sendComment="
        (videoId) => {
          fetchComments(videoId);
        }
      "
    />

    <CommentItem
      v-for="(comment, index) in comments"
      :key="comment.id"
      :comment="comment"
      :fetchChildComments="fetchChildComments"
      :loadMoreChildComments="() => loadMoreChildComments(comment.id)"
      :childComments="childComments"
      :totalRepliesCount="totalRepliesCount"
    />

    <div
      v-if="hasMoreComments && comments.length > 0"
      class="font-bold text-[13px] text-primary cursor-pointer pt-2"
      @click="loadMoreComments"
    >
      <span>Show more comments</span>
    </div>
  </div>
</template>
