<script setup>
  import verified from '@/components/icons/verified.vue';
  import dislike from '@/components/icons/dislike.vue';
  import like from '@/components/icons/like.vue';
  import { formatDate } from '@/utils/calculatorDate';
  import SmallLoading from '@/components/icons/smallLoading.vue';
  const props = defineProps({
    replies: Array,
    loadMoreReplies: Function,
    loadingReplies: Boolean,
    commentId: String,
    currentPage: Number,
    totalPage: Number,
  });


</script>

<template>
  <div
    v-for="reply in replies"
    :key="reply.id"
    class="flex gap-x-4 text-xs pl-6 py-4 px-3 border-l-2 border-gray-dark"
    :class="{ ' border-l-4 border-primary/60 bg-primary/10 rounded-e-lg mb-1 ': reply.isNew }"
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
        <h1 class="">
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
      <div class="flex gap-x-6 mt-2">
        <div class="flex items-center gap-x-3">
          <like class="cursor-pointer hover:scale-110" fill="white" stroke="#13ceb3" />
        </div>
        <div>
          <dislike class="cursor-pointer mt-2 hover:scale-110" fill="white" stroke="#13ceb3" />
        </div>
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
