<script setup>
  import { ref, computed, onMounted } from 'vue';
  import Verified from '@/components/icons/verified.vue';
  import Gift from '../icons/gift.vue';
  import Like from '../icons/like.vue';
  import Dislike from '../icons/dislike.vue';
  import WriteComments from './WriteComments.vue';
  import CommentItem from './CommentItem.vue';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import SmallLoading from '@/components/icons/smallLoading.vue';

  dayjs.extend(relativeTime);

  const props = defineProps({
    comment: Object,
    fetchChildComments: Function,
    childComments: Object,
    totalRepliesCount: Object,
    childCommentsPage: {
      type: Number,
      required: true,
    },
    childCommentsPerPage: {
      type: Number,
      required: true,
    },
    hasMoreChildComments: Boolean,
    loadingReplies: Boolean,
    videoId: {
      type: Number,
      required: true,
    },
  });

  const currentPageChild = ref(1);
  const commentsPerPageChild = ref(5);
  const isShowMoreChild = ref(false);
  const isReplyChild = ref(false);
  const hasFetchedChildComments = ref(false);
  const id = ref(null);
  const parentIdReply = ref(null);
  // const replyToUsername = ref(null);
  const toggleLike = () => {
    props.comment.isLike = !props.comment.isLike;
    if (props.comment.isLike) props.comment.isDisLike = false;
  };
  const toggleDislike = () => {
    props.comment.isDisLike = !props.comment.isDisLike;
    if (props.comment.isDisLike) props.comment.isLike = false;
  };

  const timeFromNow = (createdAt) => {
    return dayjs(createdAt, 'YYYY-MM-DD HH:mm:ss').fromNow();
  };

  const loadMoreChildComments = async () => {
    currentPageChild.value++;
    await props.fetchChildComments(props.comment.id);

    if (props.totalRepliesCount[props.comment.id]) {
      props.totalRepliesCount[props.comment.id] += commentsPerPageChild.value;
    }
  };
  const toggleReply = (commentId, parentId, username) => {
    isReplyChild.value = !isReplyChild.value;

    if (isReplyChild.value) {
      id.value = commentId;
      parentIdReply.value = parentId;
    }
  };

  const toggleShowMoreChild = async () => {
    isShowMoreChild.value = !isShowMoreChild.value;

    if (isShowMoreChild.value && !hasFetchedChildComments.value) {
      await props.fetchChildComments(props.comment.id);
      hasFetchedChildComments.value = true;
    }
  };
  const handleSendComment = async (newComment) => {
    if (newComment) {
      newComment.isNew = true;

      if (parentIdReply.value && props.childComments[parentIdReply.value]) {
        props.childComments[parentIdReply.value].unshift(newComment);
      } else {
        if (!props.childComments[id.value]) {
          props.childComments[id.value] = [];
        }
        props.childComments[id.value].unshift(newComment);
      }

      isReplyChild.value = false;
      parentIdReply.value = null;
    } else {
      console.error('New comment is undefined or null');
    }
  };
</script>

<template>
  <div
    class="flex gap-x-4"
    :class="{
      'pl-6 py-4 px-3 border-l-2 border-gray-dark': comment.parentId !== null,
      'border-l-4 border-primary/60 bg-primary/10 rounded-e-lg mb-1': comment.isNew,
    }"
  >
    <div class="flex-shrink-0">
      <img
        :src="comment?.userComments?.avatar"
        alt="Avatar"
        class="size-10 object-cover rounded-full"
      />
    </div>
    <div class="space-y-2 w-full">
      <!-- USERNAME -->
      <div class="flex justify-between items-center gap-x-4 w-fit">
        <h1 class="font-bold">{{ comment.userComments?.username }}</h1>
        <span v-if="comment.userComments?.isVerified">
          <Verified class="fill-blue" />
        </span>
        <div v-if="comment.rep > 0" class="flex items-center whitespace-nowrap">
          <Gift class="mr-1" />
          <span class="text-xs mt-1 text-[#FFB564]">Gifted {{ comment.rep }} REPs</span>
        </div>
        <p class="pt-0.5 whitespace-nowrap text-xs text-[#666666]">
          {{ timeFromNow(comment.createdAt) }}
        </p>
      </div>

      <!-- COMMENT -->
      <p class="break-words text-sm text-black">{{ comment.content }}</p>

      <!-- Like/Dislike -->
      <div class="flex gap-4 items-center">
        <div class="flex gap-2" @click="toggleLike">
          <Like
            class="cursor-pointer"
            :fill="comment.isLike ? '#13CEB3' : 'white'"
            :stroke="comment.isLike ? 'none' : '#13D0B4'"
          />
          <span>{{ comment.like }}</span>
        </div>
        <div class="flex gap-2" @click="toggleDislike">
          <Dislike
            class="cursor-pointer mt-1"
            :fill="comment.isDisLike ? '#13CEB3' : 'white'"
            :stroke="comment.isDisLike ? 'none' : '#13D0B4'"
          />
          <span>{{ comment.dislike }}</span>
        </div>
        <span
          class="font-semibold text-[13px] text-primary cursor-pointer"
          @click="
            () => {
              toggleReply(comment.id, comment.parentId);
              // console.log(comment.userComments.username);
            }
          "
        >
          Reply
        </span>
      </div>

      <!-- Write comment component -->
      <WriteComments
        v-if="isReplyChild"
        :commentId="comment.id"
        @sendComment="handleSendComment"
        :replyToUsername="replyToUsername"
        :videoId="videoId"
      />
      <div v-if="!isShowMoreChild">
        <CommentItem
          v-for="(child, index) in childComments[comment.id]?.filter((c) => c.isNew)"
          :key="'new-' + child.id"
          :comment="child"
          :fetchChildComments="props.fetchChildComments"
          :childComments="props.childComments"
          :totalRepliesCount="props.totalRepliesCount"
          :videoId="videoId"
        />
      </div>
      <!-- Toggle to show/hide child comments -->
      <div v-if="totalRepliesCount?.[comment.id] > 0">
        <div
          class="flex gap-2 font-bold text-[13px] text-primary cursor-pointer"
          @click="toggleShowMoreChild"
        >
          <div>
            <span v-if="!isShowMoreChild"> Show replies ({{ comment.totalRepliesCount }}) </span>

            <span v-else class="mt-4"> Hide replies </span>
          </div>
          <div v-if="loadingReplies"><SmallLoading /></div>
        </div>

        <!-- Display child comments -->
        <div class="mt-2" v-if="isShowMoreChild">
          <CommentItem
            v-for="(child, index) in childComments[comment.id]?.slice(
              0,
              currentPageChild * commentsPerPageChild,
            )"
            :key="child.id"
            :comment="child"
            :fetchChildComments="props.fetchChildComments"
            :childComments="props.childComments"
            :totalRepliesCount="props.totalRepliesCount"
            :videoId="videoId"
          />
          <div
            v-if="hasMoreChildComments && !loadingReplies"
            class="font-bold text-[13px] text-primary cursor-pointer"
            @click="loadMoreChildComments"
          >
            <span>Show more replies</span>
          </div>
          <!-- Load More Child Comments -->
        </div>
      </div>
    </div>
  </div>
</template>
