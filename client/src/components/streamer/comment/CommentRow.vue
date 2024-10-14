<script setup>
  import { ref } from 'vue';
  import rep from '@icons/rep.vue';
  import rep2500 from '@icons/reps25000.vue';
  import dislike from '@/components/icons/dislike.vue';
  import like from '@/components/icons/like.vue';
  import verified from '@icons/verified.vue';
  import CommentField from './CommentField.vue';
  import CommentReply from './CommentReply.vue';
  import { getReplyCommentOfVideo } from '@/services/comment';
  import SmallLoading from '@/components/icons/smallLoading.vue';
  import { formatDate } from '@/utils/calculatorDate';

  const props = defineProps({
    comment: Object,
    fetchAllCommentStreamer: Function,
  });

  const openCommentField = ref(false);
  const openCommentReply = ref(false);
  const openViewAllComment = ref(false);
  const replies = ref([]);
  const newReplies = ref([]);
  const loadingReplies = ref(false);
  const currentPage = ref(1);
  const totalPage = ref();
  const hasInitialFetch = ref(false);

  // HANDLE COMMENT FIELD
  const handleOpenCommentField = () => {
    openCommentField.value = !openCommentField.value;
  };

  // OPEN COMMENT REPLY
  const handleOpenCommentReply = (commentId) => {
    openViewAllComment.value = !openViewAllComment.value;
    openCommentReply.value = false;
    if (openViewAllComment.value && !hasInitialFetch.value) {
      fetchReplyOfComment(commentId);
      hasInitialFetch.value = true;
    }
  };

  // VIEW REPLIES
  const handleUpdateTotalRepliesCount = (newCount) => {
    props.comment.totalRepliesCount = newCount;
  };

  // SEND COMMENT
  const handleSendCommentReply = async (newReply) => {
    newReply.isNew = true;
    if (openViewAllComment.value) {
      const isExisting = replies.value.some((reply) => reply.id === newReply.id);
      if (!isExisting) {
        replies.value.unshift(newReply);
      }
    } else {
      newReplies.value.unshift(newReply);
    }
  };

  // FETCH DATA REPLIES
  const fetchReplyOfComment = async (commentId) => {
    loadingReplies.value = true;
    try {
      const response = await getReplyCommentOfVideo(commentId, currentPage.value);
      const existingCommentIds = [...replies.value, ...newReplies.value].map((reply) => reply.id);
      const newComments = response.data.comments.rows.filter(
        (comment) => !existingCommentIds.includes(comment.id),
      );
      replies.value = [...newReplies.value, ...newComments];
      totalPage.value = response.data.totalPages;
      newReplies.value = [];
    } catch (error) {
      console.error('Error fetching replies:', error);
    } finally {
      loadingReplies.value = false;
    }
  };

  // LOAD MORE
  const loadMoreReplies = async (commentId) => {
    currentPage.value++;
    loadingReplies.value = true;
    try {
      const response = await getReplyCommentOfVideo(commentId, currentPage.value);
      // CHECK COMMENT EXIST DON'T RENDER AGAIN
      const existingCommentIds = replies.value.map((reply) => reply.id);
      const newComments = response.data.comments.rows.filter(
        (comment) => !existingCommentIds.includes(comment.id),
      );
      replies.value = [...replies.value, ...newComments];
      totalPage.value = response.data.totalPages;
    } catch (error) {
      console.error('Error loading more replies:', error);
    } finally {
      loadingReplies.value = false;
    }
  };
</script>

<template>
  <tr class="bg-white border-b-[1px] border-gray-dark">
    <!-- COMMENT -->
    <td class="w-1/2 px-6 py-4 font-normal align-top text-gray-900">
      <div class="flex gap-x-4">
        <img
          :src="comment.channelComments?.avatar || comment.userComments?.avatar"
          alt="avatar"
          class="size-14 object-cover rounded-full"
        />
        <!-- RIGHT COMMENT -->
        <div class="flex flex-col flex-grow gap-y-1">
          <!-- REPS SENDER -->
          <div
            v-if="comment.rep"
            class="flex items-center rounded-full bg-yellow-dark px-3 py-1 gap-x-1 mb-2 w-fit"
          >
            <rep />
            <h1 class="text-white font-bold text-[10px]">REPs Sender</h1>
          </div>
          <!-- USERNAME -->
          <div class="flex items-center gap-x-4">
            <h1 class="font-bold">
              {{ comment.channelComments?.channelName || comment.userComments?.username }}
            </h1>
            <span v-if="comment.channelComments?.popularCheck" class="mb-1">
              <verified fill="fill-blue" />
            </span>
            <p class="text-xs text-footer">{{ formatDate(comment.updatedAt) }}</p>
          </div>
          <!-- COMMENT -->
          <p class="text-sm break-words">
            {{ comment.content }}
          </p>
          <!-- REPLY COMMENT -->
          <div class="flex mt-2 gap-x-6 text-sm">
            <div class="flex gap-x-8 items-center text-primary">
              <!-- LIKE DISLIKE -->
              <div class="flex items-center gap-x-3">
                <like class="cursor-pointer hover:scale-110" />
                <p class="mt-1">{{ comment.like }}</p>
              </div>
              <div>
                <dislike
                  class="cursor-pointer mt-2 hover:scale-110"
                  fill="white"
                  stroke="#13ceb3"
                />
              </div>
              <i class="pi pi-ellipsis-v text-md cursor-pointer"></i>
              <p @click="handleOpenCommentField" class="cursor-pointer font-medium">Reply</p>

              <div
                v-if="comment.totalRepliesCount > 0"
                class="flex items-center gap-x-4 cursor-pointer font-medium"
                @click="handleOpenCommentReply(comment.id)"
              >
                <p class="truncate">
                  View {{ comment.totalRepliesCount > 0 ? comment.totalRepliesCount : '' }}
                  {{ comment.totalRepliesCount === 1 ? 'Reply' : 'Replies' }}
                </p>
                <div v-if="loadingReplies"><SmallLoading /></div>
              </div>
            </div>
          </div>
          <!-- COMMENT FIELD -->
          <div v-if="openCommentField" class="mt-8">
            <CommentField
              @handleOpenCommentField="handleOpenCommentField"
              @updateTotalRepliesCount="handleUpdateTotalRepliesCount"
              :comment="comment"
              @handleSendCommentReply="handleSendCommentReply"
            />
          </div>

          <!-- REPLY COMMENT -->
          <div v-if="openViewAllComment" class="mt-8">
            <CommentReply
              :replies="replies"
              :loadMoreReplies="loadMoreReplies"
              :loadingReplies="loadingReplies"
              :commentId="comment.id"
              :currentPage="currentPage"
              :totalPage="totalPage"
            />
          </div>

          <div v-if="!openViewAllComment && newReplies.length > 0" class="mt-8">
            <CommentReply :replies="newReplies" />
          </div>
        </div>
      </div>
    </td>
    <!-- REPS RECEIVED -->
    <td class="w-[16%] px-6 py-4 align-top">
      <div v-if="comment.rep" class="flex items-center gap-x-2">
        <div class="scale-50"><rep2500 /></div>
        <p class="font-semibold text-base">{{ comment.rep }}</p>
      </div>
    </td>
    <!-- VIDEO -->
    <td class="px-6 py-4 align-top">
      <div class="flex gap-x-4">
        <div class="relative w-1/2 min-w-[180px]">
          <div class="relative w-full aspect-video">
            <img
              :src="comment.Video.thumbnailUrl"
              alt="video thumbnail"
              class="object-cover w-full h-full"
            />
            <div class="absolute bottom-2 right-2 p-2 bg-title/60 rounded-md text-xs text-white">
              {{ comment.Video.duration }}
            </div>
          </div>
        </div>
        <div class="w-1/2">
          <h1 class="font-semibold mb-2 line-clamp-2">{{ comment.Video.title }}</h1>
          <h2 class="text-xs mb-4 text-body">{{ comment.Video.category.title }}</h2>
          <p class="text-sm text-primary cursor-pointer font-semibold">View comment</p>
        </div>
      </div>
    </td>
  </tr>
</template>
