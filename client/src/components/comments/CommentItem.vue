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
  });
  const currentPageChild = ref(1);
  const commentsPerPageChild = ref(5);
  const isShowMoreChild = ref(false);
  const isReplyChild = ref(false);

  const id = ref(null);
  const parentIdReply = ref(null);

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
  const toggleReply = (commentId, parentId) => {
    isReplyChild.value = !isReplyChild.value;

    if (isReplyChild.value) {
      console.log('Replying to comment ID:', commentId, 'with parent ID:', parentId);
      id.value = commentId;
      parentIdReply.value = parentId;
      console.log('Current ID:', id);
    }
  };

  const toggleShowMoreChild = async () => {
    isShowMoreChild.value = !isShowMoreChild.value;
    console.log('show  ne ', isShowMoreChild.value);

    if (isShowMoreChild.value) {
      if (!props.childComments[props.comment.id]) {
        await props.fetchChildComments(props.comment.id);
      } else {
        console.log('Dữ liệu bình luận con đã được tải về:', props.childComments[props.comment.id]);
      }

      const childComments = props.childComments[props.comment.id] || [];
      for (const childComment of childComments) {
        if (childComment.totalRepliesCount > 0 && !props.childComments[childComment.id]) {
          await props.fetchChildComments(childComment.id);
        }
      }
      console.log('data', childComments);
    }
  };
  const handleSendComment = async (newComment) => {
    if (newComment) {
      newComment.isNew = true;

      if (!props.childComments[id.value]) {
        props.childComments[id.value] = [];
      }

      props.childComments[id.value].unshift(newComment);

      isReplyChild.value = false;
    } else {
      console.error('New comment is undefined or null');
    }
  };
  console.log(props.hasMoreChildComments);
</script>

<template>
  <div class="flex gap-x-4">
    <div class="flex-shrink-0">
      <img
        :src="comment?.userComments?.avatar"
        alt="Avatar"
        class="size-10 object-cover rounded-full"
      />
    </div>
    <div class="space-y-2">
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
            }
          "
        >
          Reply
        </span>
      </div>

      <!-- Write comment component -->
      <WriteComments v-if="isReplyChild" :commentId="comment.id" @sendComment="handleSendComment" />
      <div v-if="!isShowMoreChild">
        <CommentItem
          v-for="(child, index) in childComments[comment.id]?.filter((c) => c.isNew)"
          :key="'new-' + child.id"
          :comment="child"
          :fetchChildComments="props.fetchChildComments"
          :childComments="props.childComments"
          :totalRepliesCount="props.totalRepliesCount"
        />
      </div>
      <!-- Toggle to show/hide child comments -->
      <div v-if="totalRepliesCount?.[comment.id] > 0" class="space-y-4">
        <div class="font-bold text-[13px] text-primary cursor-pointer" @click="toggleShowMoreChild">
          <span v-if="!isShowMoreChild"> Show replies ({{ comment.totalRepliesCount }}) </span>
          <span v-else class="mt-4"> Hide replies </span>
        </div>

        <!-- Display child comments -->
        <div v-if="isShowMoreChild">
          <CommentItem
            class="my-4"
            v-for="(child, index) in childComments[comment.id]?.slice(
              0,
              currentPageChild * commentsPerPageChild,
            )"
            :key="child.id"
            :comment="child"
            :fetchChildComments="props.fetchChildComments"
            :childComments="props.childComments"
            :totalRepliesCount="props.totalRepliesCount"
          />
          <div
            v-if="hasMoreChildComments"
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
