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
  const totalCountOfComment = ref(0);

  // Bình luận con
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
        const newComments = response.data.data.comments.rows;
        newComments.forEach((newComment) => {
          const exists = comments.value.some((comment) => comment.id === newComment.id);

          // Nếu bình luận không tồn tại, thêm nó vào danh sách
          if (!exists) {
            comments.value.push(newComment);

            // Cập nhật tổng số bình luận con cho bình luận mới
            if (!totalRepliesCount.value[newComment.id]) {
              totalRepliesCount.value[newComment.id] = newComment.totalRepliesCount || 0;
            }

            hasMoreChildComments.value[newComment.id] = true;
          }

          // Cập nhật tổng số bình luận con cho bình luận cha nếu có
          if (newComment.parentId) {
            totalRepliesCount.value[newComment.parentId] =
              (totalRepliesCount.value[newComment.parentId] || 0) + 1;
          }
        });

        // Cập nhật tổng số bình luận con cho các bình luận đã có
        comments.value.forEach((comment) => {
          if (!totalRepliesCount.value[comment.id]) {
            totalRepliesCount.value[comment.id] = comment.totalRepliesCount || 0;
          }
        });

        hasMoreComments.value = currentPage.value < response.data.data.totalPages;
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchChildComments = async (parentId) => {
    if (!childCommentsPage.value[parentId]) {
      childCommentsPage.value[parentId] = 1; // Khởi tạo nếu chưa có
    }

    const pageInfo = {
      page: childCommentsPage.value[parentId],
      pageSize: childCommentsPerPage,
    };

    try {
      const response = await getAllChildComments(parentId, pageInfo);

      if (response.data.success && response.data.data) {
        if (!childComments.value[parentId]) {
          childComments.value[parentId] = []; // Khởi tạo nếu chưa có
        }

        const newComments = response.data.data.comments.rows;
        const existingIds = new Set(childComments.value[parentId].map((comment) => comment.id));
        const uniqueNewComments = newComments.filter((comment) => !existingIds.has(comment.id));

        childComments.value[parentId].push(...uniqueNewComments);

        // Cập nhật tổng số bình luận con
        totalCountOfComment.value = response.data.data.comments.count;
        totalRepliesCount.value[parentId] = totalCountOfComment.value;
        hasMoreChildComments.value[parentId] =
          childCommentsPage.value[parentId] < response.data.data.totalPages;

        if (hasMoreChildComments.value[parentId]) {
          childCommentsPage.value[parentId]++;
        }
      }
      console.log('Fetching child comments for:', parentId);
      console.log('Current child comments:', childComments.value[parentId]);
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

  const handleSendComment = (newComment) => {
    if (newComment) {
      comments.value.push(newComment);

      // Cập nhật tổng số bình luận con cho bình luận cha
      if (newComment.parentId) {
        totalRepliesCount.value[newComment.parentId] =
          (totalRepliesCount.value[newComment.parentId] || 0) + 1; // Cập nhật tổng số bình luận con

        // Nếu bình luận cha đã có bình luận con, cập nhật tổng số cho bình luận con của nó
        const parentComment = comments.value.find((comment) => comment.id === newComment.parentId);
        if (parentComment) {
          parentComment.totalRepliesCount = (parentComment.totalRepliesCount || 0) + 1; // Cập nhật tổng số bình luận con
        }
      }
    } else {
      console.error('New comment is undefined or null');
    }
  };

  console.log('Comments data:', comments);
</script>

<template>
  <div class="space-y-8">
    <WriteComments :fetchChildComments="fetchChildComments" @sendComment="handleSendComment" />

    <CommentItem
      v-for="(comment, index) in comments"
      :key="comment.id"
      :comment="comment"
      :fetchChildComments="fetchChildComments"
      :loadMoreChildComments="() => loadMoreChildComments(comment.id)"
      :childComments="childComments"
      :totalRepliesCount="totalRepliesCount"
      :totalCountOfComment="totalCountOfComment"
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
