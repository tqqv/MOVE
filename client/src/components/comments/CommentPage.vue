<script setup>
  import { ref, onMounted } from 'vue';
  import CommentItem from './CommentItem.vue';
  import { getAllComments, getAllChildComments } from '@/services/comment';
  import WriteComments from './WriteComments.vue';

  const comments = ref([]);
  const childComments = ref({});
  const isShowMore = ref(false);

  const fetchComments = async () => {
    const videoId = 1;
    try {
      const response = await getAllComments(videoId);
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

  onMounted(() => {
    fetchComments();
  });
</script>

<template>
  <div class="space-y-8">
    <WriteComments :fetchComments="fetchComments" />

    <!-- Hiển thị bình luận với nút Show More -->
    <CommentItem
      v-for="(comment, index) in isShowMore ? comments : comments.slice(0, 3)"
      :key="comment.id"
      :comment="comment"
      :fetchChildComments="fetchChildComments"
      :fetchComments="fetchComments"
      :childComments="childComments"
    />

    <!-- Nút Show More / Show Less -->
    <div
      v-if="comments.length > 3"
      class="font-bold text-[13px] text-primary cursor-pointer pt-2"
      @click="isShowMore = !isShowMore"
    >
      <span>
        {{ isShowMore ? 'Show less comments' : `Show ${comments.length - 3} more comments` }}
      </span>
    </div>
  </div>
</template>
