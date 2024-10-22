<script setup>
  import { ref } from 'vue';

  import verified from '@/components/icons/verified.vue';
  import Dislike from '@/components/icons/dislike.vue';
  import Like from '@/components/icons/like.vue';
  import { formatDate } from '@/utils/calculatorDate';
  import SmallLoading from '@/components/icons/smallLoading.vue';
  import CommentField from './CommentField.vue';

  const props = defineProps({
    replies: Array,
    loadMoreReplies: Function,
    loadingReplies: Boolean,
    commentId: String,
    currentPage: Number,
    totalPage: Number,
  });

  const openReplyField = ref({});

  const handleOpenReplyField = (replyId) => {
    openReplyField.value[replyId] = !openReplyField.value[replyId];
  };

  const handleSendCommentReply = async (newReply) => {
    newReply.isNew = true;
    if (openReplyField.value) {
      const isExisting = props.replies.some((reply) => reply.id === newReply.id);
      if (!isExisting) {
        props.replies.unshift(newReply);
      }
    }
  };
</script>

<template>
  <div
    v-for="reply in replies"
    :key="reply.id"
    class="flex gap-x-4 text-xs pl-6 py-4 px-3 border-l-2 border-gray-dark"
    :class="{ 'border-l-4 border-primary/60 bg-primary/10 rounded-e-lg mb-1': reply.isNew }"
  >
    <div class="flex-shrink-0">
      <img
        :src="reply.channelComments?.avatar || reply.userComments?.avatar"
        alt="Avatar"
        class="size-10 rounded-full object-cover"
      />
    </div>
    <div class="flex-grow flex flex-col gap-y-1">
      <div class="flex items-center gap-x-3 mb-2">
        <h1>
          {{ reply.channelComments?.channelName || reply.userComments?.username }}
        </h1>
        <span v-if="reply.channelComments?.popularCheck" class="mb-0.5 mr-0.2">
          <verified class="scale-95" fill="fill-blue" />
        </span>
        <p class="text-footer">{{ formatDate(reply.updatedAt) }}</p>
      </div>
      <p class="text-sm break-words">
        {{ reply.content }}
      </p>

      <!-- LIKE DISLIKE -->
      <div class="flex gap-4 items-center mt-2">
        <div class="flex gap-2" @click="toggleLike">
          <Like
            class="cursor-pointer"
            :fill="reply.isLike ? '#13CEB3' : 'white'"
            :stroke="reply.isLike ? 'none' : '#13D0B4'"
          />
          <span>{{ reply.like }}</span>
        </div>
        <div class="flex gap-2" @click="toggleDislike">
          <Dislike
            class="cursor-pointer mt-1"
            :fill="reply.isDisLike ? '#13CEB3' : 'white'"
            :stroke="reply.isDisLike ? 'none' : '#13D0B4'"
          />
          <span>{{ reply.dislike }}</span>
        </div>
        <span
          class="font-semibold text-[13px] text-primary cursor-pointer"
          @click="handleOpenReplyField(reply.id)"
        >
          Reply
        </span>
      </div>

      <!-- COMMENT FIELD CHO REPLY -->
      <div v-if="openReplyField[reply.id]" class="mt-4">
        <CommentField
          @handleOpenCommentField="handleOpenReplyField(reply.id)"
          @handleSendCommentReply="handleSendCommentReply"
          :comment="reply"
        />
      </div>

      <!-- HIỂN THỊ REPLIES TẦNG 2 -->
      <div v-if="reply.replies && reply.replies.length" class="ml-6 mt-4">
        <CommentField
          :replies="reply.replies"
          :loadMoreReplies="loadMoreReplies"
          :loadingReplies="loadingReplies"
          :commentId="reply.id"
          :currentPage="currentPage"
          :totalPage="totalPage"
        />
      </div>
    </div>
  </div>

  <div v-if="currentPage < totalPage" class="flex gap-x-3 ml-3 mt-5">
    <h1
      class="cursor-pointer w-fit text-primary font-medium"
      @click="props.loadMoreReplies(props.commentId)"
    >
      View more comments
    </h1>
    <div v-if="props.loadingReplies"><SmallLoading /></div>
  </div>
</template>
