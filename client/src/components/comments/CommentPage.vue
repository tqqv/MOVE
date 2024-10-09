<script setup>
  import { ref, onMounted } from 'vue';
  import CommentItem from './CommentItem.vue';
  import { getAllComments, getAllChildComments } from '@/services/comment';
  import WriteComments from './WriteComments.vue';

  const comments = ref([]);
  const childComments = ref({});
  const currentPage = ref(1);
  const commentsPerPage = ref(5);

  const fetchComments = async () => {
    const videoId = 1015530843;
    try {
      const response = await getAllComments(videoId, currentPage.value);
      if (response.data.success) {
        comments.value = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        await Promise.all(
          comments.value.map((comment) => {
            return fetchChildComments(comment.id);
          }),
        );
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchChildComments = async (parentId) => {
    try {
      const response = await getAllChildComments(parentId);
      if (response.data.success && response.data.data) {
        if (!childComments.value[parentId]) {
          childComments.value[parentId] = [];
        }
        childComments.value[parentId] = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        for (const childComment of childComments.value[parentId]) {
          await fetchChildComments(childComment.id);
        }
      } else {
        console.warn(`No child comments found for parent ID ${parentId}`);
      }
    } catch (error) {
      console.error('Error fetching child comments:', error);
    }
  };

  const loadMoreComments = () => {
    currentPage.value++;
    fetchComments(); // Gọi lại để lấy bình luận cho trang mới
  };

  onMounted(() => {
    fetchComments();
  });
</script>

<template>
  <div class="space-y-8">
    <WriteComments :fetchComments="fetchComments" />

    <!-- Hiển thị bình luận -->
    <CommentItem
      v-for="(comment, index) in comments.slice(0, currentPage * commentsPerPage)"
      :key="comment.id"
      :comment="comment"
      :fetchChildComments="fetchChildComments"
      :fetchComments="fetchComments"
      :childComments="childComments"
    />

    <!-- Nút Load More -->
    <div
      v-if="comments.length > currentPage * commentsPerPage"
      class="font-bold text-[13px] text-primary cursor-pointer pt-2"
      @click="loadMoreComments"
    >
      <span>Show more comments</span>
    </div>
  </div>
</template>
