<script setup>
  import { ref, onMounted, watch } from 'vue';
  import CommentItem from './CommentItem.vue';
  import WriteComments from './WriteComments.vue';
  import { useUserStore } from '@/stores';
  import { useCommentStore } from '@/stores/useCommentStore';
  import smallLoading from '@/components/icons/smallLoading.vue';

  const props = defineProps({
    videoId: {
      type: [Number, String],
      required: true,
    },
    isCommentable: Boolean,
  });

  const userStore = useUserStore();
  const commentStore = useCommentStore();

  const {
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
  } = commentStore;
  console.log(props.videoId);
  resetComments(props.videoId);

  // watch(
  //   () => props.videoId,
  //   () => {
  //     console.log('change ne', props.videoId);
  //   },
  // );
  watch(
    () => commentStore.hasMoreComments,
    (newVal) => {},
  );

  onMounted(() => {
    fetchComments(props.videoId);
  });
</script>

<template>
  <div class="space-y-8">
    <p v-if="!isCommentable" class="font-bold italic text-[#666666] pb-2">
      This video is not open for comments.
    </p>
    <WriteComments
      v-if="isCommentable"
      :videoId="videoId"
      :fetchChildComments="fetchChildComments"
      @sendComment="handleSendComment"
      :isCommentable="isCommentable"
    />

    <CommentItem
      v-for="(comment, index) in comments"
      v-if="isCommentable"
      :key="comment.id"
      :comment="comment"
      :fetchChildComments="commentStore.fetchChildComments"
      :childComments="commentStore.childComments"
      :totalRepliesCount="totalRepliesCount"
      :hasMoreChildComments="commentStore.hasMoreChildComments[comment.id]"
      :loadingReplies="commentStore.loadingRepliesForComment[comment.id]"
      :videoId="videoId"
      @fetchComments="fetchComments"
      :isCommentable="isCommentable"
    />
    <!-- <p    v-if="!comments.length > 0 " class="text-center text-base font-semibold mt-4 bg-gray-light p-8 rounded-lg">
      No comments to display. <div class="text-[#979494]">Leave a comment to get started!</div>
    </p > -->
    <div
      v-if="commentStore.hasMoreComments && comments.length > 0"
      class="font-bold text-[13px] text-primary cursor-pointer pt-2"
      @click="loadMoreComments(videoId)"
    >
      <span v-if="isCommentable">
        <smallLoading v-if="isLoadingComments" fill="white" fill_second="#13d0b4" />
        <span v-else>Show more comments </span>
      </span>
    </div>
  </div>
</template>
