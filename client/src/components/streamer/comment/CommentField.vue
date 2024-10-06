<script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
  //   import EmojiPicker from 'vue3-emoji-picker';
  import MMAImage from '@/assets/category/MMA.png';

  const commentText = ref('');
  const commentInput = ref(null);

  const handleCommentInput = (event) => {
    commentText.value = event.target.value;
  };

  const isCommentNotEmpty = computed(() => commentText.value.trim() !== '');

  //   HANDLE CANCEL
  const emit = defineEmits(['handleOpenCommentField']);
  const handleCancel = () => {
    commentText.value = '';
    emit('handleOpenCommentField');
  };

  onMounted(() => {
    commentInput.value?.focus(); 
  });
</script>

<template>
  <div>
    <div class="flex gap-x-4">
      <img :src="MMAImage" alt="Avatar" class="size-10 rounded-full object-cover" />
      <div class="flex-grow px-4 py-2 rounded-lg bg-gray-dark/25">
        <input
          class="flex-grow bg-transparent focus:outline-none  placeholder:text-xs placeholder:font-medium placeholder:text-black/50 w-full h-10"
          type="text"
          placeholder="Reply comment..."
          @input="handleCommentInput"
          ref="commentInput"
          v-model="commentText"
        />
        <div class="flex justify-end mt-5">
          <div class="flex gap-x-4">
            <button
              @click="handleCancel"
              class="rounded-full text-xs text-primary font-semibold p-2"
            >
              Cancel
            </button>
            <button
              @click="handleSend"
              :disabled="!isCommentNotEmpty"
              :class="{
                'rounded-lg text-xs font-semibold px-4': true,
                'bg-primary text-white': isCommentNotEmpty,
                'bg-black/10 text-black/50': !isCommentNotEmpty,
              }"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
