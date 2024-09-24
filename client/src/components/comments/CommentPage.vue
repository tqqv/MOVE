<script setup>
  import { ref, onMounted } from 'vue';
  import CommentItem from './CommentItem.vue';
  import { getAllComments, getAllChildComments } from '@/services/comment';

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
      }
      comments.value.forEach((comment) => {
        fetchChildComments(comment.id);
      });
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchChildComments = async (parentId) => {
    try {
      const response = await getAllChildComments(parentId);

      if (response.data.success) {
        if (!childComments.value[parentId]) {
          childComments.value[parentId] = [];
        }

        // Sắp xếp các bình luận con theo thời gian tạo (mới nhất -> cũ nhất)
        childComments.value[parentId] = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        // // Đệ quy để lấy các bình luận con của tầng tiếp theo theo `parentId` ban đầu
        // for (const childComment of childComments.value[parentId]) {
        //   // Gọi lại hàm với cùng `parentId` để lấy bình luận con ở tầng tiếp theo
        //   await fetchChildComments(childComment.id);
        // }
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
  <div>
    <!-- Hiển thị bình luận với nút Show More -->
    <CommentItem
      v-for="(comment, index) in isShowMore ? comments : comments.slice(0, 3)"
      :key="comment.id"
      :comment="comment"
      :fetchChildComments="fetchChildComments"
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
