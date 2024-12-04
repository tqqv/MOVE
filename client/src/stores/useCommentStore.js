import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAllComments, getAllChildComments } from '@/services/comment';
import { useUserStore } from '@/stores';

export const useCommentStore = defineStore('comment', () => {
  const userStore = useUserStore();

  const comments = ref([]);
  const childComments = ref({});
  const currentPage = ref(1);
  const commentsPerPage = ref(15);
  const hasMoreComments = ref(true);
  const totalRepliesCount = ref({});
  const childCommentsPage = ref({});
  const childCommentsPerPage = 5;
  const hasMoreChildComments = ref({});
  const loadingRepliesForComment = ref({});
  const isLoadingComments = ref(false);
  const fetchComments = async (videoId) => {
    try {
      const response = await getAllComments(videoId, userStore?.user?.id || null, {
        page: currentPage.value,
        pageSize: commentsPerPage.value,
      });

      if (response.data.success) {
        const newComments = response.data.data.comments.rows;

        newComments.forEach((newComment) => {
          const exists = comments.value.some((comment) => comment.id === newComment.id);

          if (!exists) {
            comments.value.push(newComment);
            totalRepliesCount.value[newComment.id] = newComment.totalRepliesCount || 0;
            hasMoreChildComments.value[newComment.id] = true;
          }

          if (newComment.parentId) {
            totalRepliesCount.value[newComment.parentId] =
              (totalRepliesCount.value[newComment.parentId] || 0) + 1;
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
      childCommentsPage.value[parentId] = 1;
    }

    const pageInfo = {
      page: childCommentsPage.value[parentId],
      pageSize: childCommentsPerPage,
    };
    loadingRepliesForComment.value[parentId] = true;
    try {
      const response = await getAllChildComments(parentId, userStore?.user?.id || null, pageInfo);

      if (response.data.success && response.data.data) {
        if (!childComments.value[parentId]) {
          childComments.value[parentId] = [];
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

  const loadMoreComments = async (videoId, userId) => {
    isLoadingComments.value = true;

    try {
      currentPage.value++;

      await fetchComments(videoId, userStore?.user?.id || null);
    } catch (error) {
      console.error('Error loading more comments:', error);
    } finally {
      isLoadingComments.value = false;
    }
  };

  const resetComments = async (videoId) => {
    comments.value = [];
    currentPage.value = 1;
    hasMoreComments.value = true;
    await fetchComments(videoId);
  };

  const handleSendComment = (newComment) => {
    if (newComment) {
      comments.value.unshift(newComment);
      newComment.likeCount = newComment.likeCount || 0;

      if (newComment.parentId) {
        totalRepliesCount.value[newComment.parentId] =
          (totalRepliesCount.value[newComment.parentId] || 0) + 1;

        const parentComment = comments.value.find((comment) => comment.id === newComment.parentId);
        if (parentComment) {
          parentComment.totalRepliesCount = (parentComment.totalRepliesCount || 0) + 1;
        }
      }
    } else {
      console.error('New comment is undefined or null');
    }
  };

  return {
    comments,
    childComments,
    currentPage,
    commentsPerPage,
    hasMoreComments,
    totalRepliesCount,
    childCommentsPage,
    hasMoreChildComments,
    loadingRepliesForComment,
    fetchComments,
    fetchChildComments,
    loadMoreComments,
    resetComments,
    handleSendComment,
    isLoadingComments,
  };
});
