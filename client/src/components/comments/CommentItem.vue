<script setup>
  import { ref } from 'vue';
  import Verified from '@/components/icons/verified.vue';
  import Gift from '../icons/gift.vue';
  import Like from '../icons/like.vue';
  import Dislike from '../icons/dislike.vue';
  import WriteComments from './WriteComments.vue';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  dayjs.extend(relativeTime);

  const props = defineProps({
    comment: Object,
    fetchChildComments: Function,
    fetchComments: Function,
    childComments: Object,
  });

  const isShowMoreChild = ref(false);
  const isReplyChild = ref(false);

  const toggleLike = () => {
    props.comment.isLike = !props.comment.isLike;
    if (props.comment.isLike) props.comment.isDisLike = false;
  };

  const toggleDislike = () => {
    props.comment.isDisLike = !props.comment.isDisLike;
    if (props.comment.isDisLike) props.comment.isLike = false;
  };

  const toggleShowMoreChild = () => {
    isShowMoreChild.value = !isShowMoreChild.value;
  };

  const toggleReply = () => {
    isReplyChild.value = !isReplyChild.value;
  };

  const timeFromNow = (createAt) => {
    return dayjs(createAt, 'YYYY-MM-DD HH:mm:ss').fromNow();
  };
</script>

<template>
  <div class="flex gap-x-4">
    <div class="flex-shrink-0">
      <img :src="comment.avatar" alt="Avatar" class="size-10 object-cover rounded-full" />
    </div>
    <div class="space-y-2">
      <!-- USERNAME -->
      <div class="flex justify-between items-center gap-x-4 w-fit">
        <h1 class="font-bold">{{ comment.username }}</h1>
        <span v-if="comment.isVerified">
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
        <span class="font-semibold text-[13px] text-primary cursor-pointer" @click="toggleReply">
          Reply
        </span>
      </div>

      <!-- Write comment component -->
      <WriteComments
        v-if="isReplyChild"
        :commentId="comment.id"
        @sendComment="
          (parentId) => {
            isReplyChild = false;
            fetchChildComments(parentId);
          }
        "
      />

      <!-- Show more/Show less child comments -->
      <div
        v-if="childComments[comment.id]?.length > 0"
        class="font-bold text-[13px] text-primary flex gap-2 cursor-pointer pt-2"
        @click="toggleShowMoreChild"
      >
        <i class="pi" :class="isShowMoreChild ? 'pi-angle-up' : 'pi-angle-down'" />
        <span>
          {{
            isShowMoreChild
              ? 'Show less replies'
              : `Show ${childComments[comment.id]?.length} replies`
          }}
        </span>
      </div>

      <!-- Show child comments recursively -->
      <div v-if="isShowMoreChild">
        <CommentItem
          v-for="(child, index) in childComments[comment.id].slice(
            0,
            isShowMoreChild ? childComments[comment.id].length : 3,
          )"
          :key="child.id"
          :comment="child"
          :fetchChildComments="props.fetchChildComments"
          :childComments="childComments"
        />
      </div>
    </div>
  </div>
</template>
