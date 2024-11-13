<script setup>
  import { ref, onMounted, watch } from 'vue';
  import CommentItem from './CommentItem.vue';
  import { getAllComments, getAllChildComments } from '@/services/comment';
  import WriteComments from './WriteComments.vue';
  import { useUserStore } from '@/stores';
  const props = defineProps({
    videoId: {
      type: [Number, String],
      required: true,
    },
    isCommentable: Boolean,
  });
  const userStore = useUserStore();
  console.log(userStore.user?.id);

  const comments = ref([]);
  const childComments = ref({});
  const currentPage = ref(1);
  const commentsPerPage = ref(5);
  const hasMoreComments = ref(true);
  const totalRepliesCount = ref({});

  const childCommentsPage = ref({});
  const childCommentsPerPage = 5;
  const hasMoreChildComments = ref({});
  const loadingRepliesForComment = ref({});

  const fetchComments = async () => {
    try {
      const response = await getAllComments(props.videoId, userStore.user.id, {
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
            totalRepliesCount.value[newComment.id] = newComment.totalRepliesCount || 0;

            hasMoreChildComments.value[newComment.id] = true;
          }

          // Cập nhật tổng số bình luận con cho bình luận cha nếu có
          if (newComment.parentId) {
            totalRepliesCount.value[newComment.parentId] =
              (totalRepliesCount.value[newComment.parentId] || 0) + 1; // Cập nhật cho bình luận cha
          }
        });

        // Cập nhật tổng số bình luận con cho bình luận đã có
        comments.value.forEach((comment) => {
          if (!totalRepliesCount.value[comment.id]) {
            totalRepliesCount.value[comment.id] = comment.totalRepliesCount || 0;
          }
        });

        hasMoreComments.value = currentPage.value < response.data.data.totalPages;
        console.log('fetch neeeeeeeeee', comments.value);
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
    loadingRepliesForComment.value[parentId] = true;
    try {
      const response = await getAllChildComments(parentId, userStore.user.id, pageInfo);

      if (response.data.success && response.data.data) {
        if (!childComments.value[parentId]) {
          childComments.value[parentId] = []; // Khởi tạo nếu chưa có
        }

        const newComments = response.data.data.comments.rows;
        const existingIds = new Set(childComments.value[parentId].map((comment) => comment.id));
        const uniqueNewComments = newComments.filter((comment) => !existingIds.has(comment.id));

        childComments.value[parentId].push(...uniqueNewComments);

        totalRepliesCount.value[parentId] =
          (totalRepliesCount.value[parentId] || 0) + uniqueNewComments.length;

        hasMoreChildComments.value[parentId] =
          childCommentsPage.value[parentId] < response.data.data.totalPages;

        if (hasMoreChildComments.value[parentId]) {
          childCommentsPage.value[parentId]++;
        }
      }
    } catch (error) {
      console.error('Error fetching child comments:', error);
    } finally {
      loadingRepliesForComment.value[parentId] = false;
    }
  };

  const loadMoreComments = () => {
    if (hasMoreComments.value) {
      currentPage.value++;
      fetchComments();
    }
  };

  const resetComments = () => {
    comments.value = [];
    currentPage.value = 1;
    hasMoreComments.value = true;
    fetchComments();
  };

  watch(() => props.videoId, resetComments);

  const handleSendComment = (newComment) => {
    if (newComment) {
      comments.value.unshift(newComment);

      // Cập nhật tổng số bình luận con cho bình luận cha
      if (newComment.parentId) {
        totalRepliesCount.value[newComment.parentId] =
          (totalRepliesCount.value[newComment.parentId] || 0) + 1;
        n;

        const parentComment = comments.value.find((comment) => comment.id === newComment.parentId);
        if (parentComment) {
          parentComment.totalRepliesCount = (parentComment.totalRepliesCount || 0) + 1; // Cập nhật tổng số bình luận con
        }
      }
    } else {
      console.error('New comment is undefined or null');
    }
  };
  watch(
    () => userStore.user?.id,
    (newUserId) => {
      if (newUserId) {
        fetchComments();
      } else {
        console.warn('User ID is undefined, cannot fetch comments');
      }
    },
  );

  onMounted(() => {
    fetchComments();
  });
</script>

<template>
  <p v-if="!isCommentable" class="font-bold italic text-[#666666] pb-2">
    This video is not open for comments.
  </p>

  <div  class="space-y-8">
    <WriteComments
      :videoId="videoId"
      :fetchChildComments="fetchChildComments"
      @sendComment="handleSendComment"
      :isCommentable="isCommentable"
    />

    <CommentItem
      v-for="(comment, index) in comments"
      v-if="comments.length > 0"
      :key="comment.id"
      :comment="comment"
      :fetchChildComments="fetchChildComments"
      :childComments="childComments"
      :totalRepliesCount="totalRepliesCount"
      :hasMoreChildComments="hasMoreChildComments[comment.id]"
      :loadingReplies="loadingRepliesForComment[comment.id]"
      :videoId="videoId"
      @fetchComments="fetchComments"
      :isCommentable="isCommentable"

    /><p v-else class="text-center text-base font-semibold mt-4 bg-gray-light p-8 rounded-lg">
    No comments to display. <div class="text-[#979494]">Leave a comment to get started!</div>
  </p>
    <div
      v-if="hasMoreComments && comments.length > 0"
      class="font-bold text-[13px] text-primary cursor-pointer pt-2"
      @click="loadMoreComments"
    >
      <span>Show more comments</span>
    </div>
  </div>
  
</template>
