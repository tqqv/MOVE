<script setup>
  import { ref } from 'vue';

  import WriteComments from '@components/comments/WriteComments.vue';
  import Comments from '@components/comments/Comments.vue';
  const commentsRef = ref(null);

  const handleSendComment = () => {
    if (commentsRef.value) {
      console.log('Fetching comments...');

      commentsRef.value.fetchComments();
    }
  };
</script>
<template>
  <div class="space-y-8">
    <WriteComments @sendComment="handleSendComment" />
    <Comments ref="commentsRef" />
  </div>
</template>
