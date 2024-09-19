<script setup>
  import { ref, computed } from 'vue';

  import MMAImage from '@/assets/category/MMA.png';

  const data = {
    avatar: MMAImage,
    username: 'thehoang17',
    viewers: 30,
    isVerified: true,
    isStreaming: true,
    totalVideos: 10,
    time: '20 mins ago',
    REPs: 2000,
    like: 200,
    dislike: 1000,
    message:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.',
  };

  const showActions = ref(false);
  const commentText = ref('');

  function handleFocus() {
    showActions.value = true;
  }

  function handleCancel() {
    commentText.value = '';
    showActions.value = false;
  }

  const isCommentNotEmpty = computed(() => commentText.value.trim() !== '');

  function handleCommentInput(event) {
    commentText.value = event.target.value;
  }
</script>

<template>
  <div class="space-y-6">
    <!-- WRITE COMMENTS -->
    <div class="relative grid grid-cols-[auto_1fr] gap-2 w-full">
      <img
        :src="data.avatar"
        alt="Avatar"
        class="w-10 h-10 rounded-full object-cover border-[1.5px] border-white"
      />
      <div class="flex flex-col w-full">
        <input
          type="text"
          placeholder="Write a comment"
          class="w-full border-b border-[#CCCCCC] focus:outline-none focus:border-primary"
          @focus="handleFocus"
          @input="handleCommentInput"
          v-model="commentText"
        />
        <div v-if="showActions" class="mt-2 flex gap-2 items-center justify-between">
          <button class="pi pi-face-smile text-xl" />
          <div class="flex gap-2">
            <button @click="handleCancel" class="rounded-full text-xs text-black font-semibold p-2">
              Cancel
            </button>
            <button
              :class="{
                'rounded-full text-xs font-semibold p-2': true,
                'bg-primary text-white': isCommentNotEmpty,
                'bg-[rgba(0,0,0,0.05)] text-[#909090]': !isCommentNotEmpty,
              }"
            >
              Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  input::placeholder {
    color: #666666;
    font-size: 14px;
    font-weight: 500;
  }
</style>
