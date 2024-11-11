<script setup>
  import { ref, watch } from 'vue';

  import verified from '@/components/icons/verified.vue';
  import Dislike from '@/components/icons/dislike.vue';
  import Like from '@/components/icons/like.vue';
  import { formatDate } from '@/utils/calculatorDate';
  import SmallLoading from '@/components/icons/smallLoading.vue';
  import CommentField from './CommentField.vue';
  import { postReactionComment } from '@/services/comment';

  import { useReadMore } from '@/utils';

  const props = defineProps({
    replies: Array,
    loadMoreReplies: Function,
    loadingReplies: Boolean,
    commentId: String,
    currentPage: Number,
    totalPage: Number,
  });

  const openReplyField = ref({});
  // const likeCount = ref(props.replies.likeCount);
  const likeCount = ref({});
  const userReactionType = ref({});
  const expandedReplies = ref({});

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

  const toggleReaction = async (type, replyId) => {
    const data = { commentId: replyId, reactionType: type };
    console.log(replyId);

    try {
      const response = await postReactionComment(data);
      if (response.status === 200) {
        // Cập nhật likeCount theo id của reply
        if (type === 'like') {
          if (userReactionType.value[replyId] === 'like') {
            likeCount.value[replyId] -= 1;
          } else if (userReactionType.value[replyId] === 'dislike') {
            likeCount.value[replyId] += 1;
          } else {
            likeCount.value[replyId] += 1;
          }
        } else if (type === 'dislike') {
          if (userReactionType.value[replyId] === 'like') {
            likeCount.value[replyId] -= 1;
          }
        }

        userReactionType.value[replyId] = userReactionType.value[replyId] === type ? null : type;
      }
    } catch (error) {
      console.error('Error updating reaction');
    }
  };
  watch(() => {
    if (props.replies.length) {
      props.replies.forEach((reply) => {
        if (!(reply.id in likeCount.value)) {
          likeCount.value[reply.id] = reply.likeCount;
        }
        if (!(reply.id in userReactionType.value)) {
          userReactionType.value[reply.id] = reply.userReactionType;
        }
      });
    }
  });

  const toggleReadMore = (replyId) => {
    expandedReplies.value[replyId] = !expandedReplies.value[replyId];
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
      <p class="text-sm text-black break-all">
        {{
          expandedReplies[reply.id] || reply.content.length <= 300
            ? reply.content
            : reply.content.slice(0, 300)
        }}
        <span
          v-if="reply.content.length > 300"
          class="text-primary cursor-pointer"
          @click="toggleReadMore(reply.id)"
        >
          {{ expandedReplies[reply.id] ? 'Read Less' : 'Read More' }}
        </span>
      </p>
      <!-- LIKE DISLIKE -->
      <div class="flex gap-4 items-center mt-2">
        <div class="flex gap-2" @click="toggleReaction('like', reply.id)">
          <Like
            class="cursor-pointer hover:scale-110"
            :fill="userReactionType[reply.id] === 'like' ? '#13CEB3' : 'white'"
            :stroke="userReactionType[reply.id] === 'like' ? 'none' : '#13D0B4'"
          />
          <div class="mt-1">
            <span class="items-center text-primary">{{ likeCount[reply.id] }}</span>
          </div>
        </div>
        <div class="flex gap-2" @click="toggleReaction('dislike', reply.id)">
          <Dislike
            class="cursor-pointer mt-1 hover:scale-110"
            :fill="userReactionType[reply.id] === 'dislike' ? '#13CEB3' : 'white'"
            :stroke="userReactionType[reply.id] === 'dislike' ? 'none' : '#13D0B4'"
          />
        </div>
        <!-- <i class="pi pi-ellipsis-v text-md text-primary cursor-pointer"></i> -->

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
