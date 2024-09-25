<script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
  import EmojiPicker from 'vue3-emoji-picker';
  import MMAImage from '@/assets/category/MMA.png';
  import { postComments } from '@/services/comment';

  const isPickerVisible = ref(false);
  const commentText = ref('');
  const emit = defineEmits(['sendComment']);
  const props = defineProps({
    fetchComments: {
      type: Function,
      required: true,
    },
  });

  const parentId = ref(props.commentId || null);
  const data = {
    avatar: MMAImage,
  };

  const showActions = ref(false);
  const handleCommentInput = (event) => {
    commentText.value = event.target.value;
  };

  const addEmoji = (emoji) => {
    commentText.value += emoji.i;
  };
  const handleFocus = () => {
    showActions.value = true;
  };
  const handleSend = async () => {
    const data = { content: commentText.value, parentId: parentId.value };
    console.log(data);
    console.log(commentText.value);

    //  data test videoID
    const videoId = 1;
    try {
      const response = await postComments(videoId, data);

      if (response.data.success) {
        console.log('Comment created successfully:', response.data.data);
        commentText.value = '';
        showActions.value = false;
        const parentID = response.data.data.parentId;
        console.log(parentID);

        emit('sendComment', parentID);
        props.fetchComments();
      } else {
        console.error('Failed to create comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };
  const handleCancel = () => {
    commentText.value = '';
    showActions.value = false;
  };

  const isCommentNotEmpty = computed(() => commentText.value.trim() !== '');

  const handleClickOutside = (event) => {
    const emojiPicker = document.querySelector('.emoji-picker');
    const button = document.querySelector('.pi-face-smile');
    if (
      emojiPicker &&
      !emojiPicker.contains(event.target) &&
      button &&
      !button.contains(event.target)
    ) {
      isPickerVisible.value = false;
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && isCommentNotEmpty.value) {
      handleSend();
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });
</script>

<template>
  <div class="space-y-6">
    <!-- WRITE COMMENTS -->
    <div class="relative grid grid-cols-[auto_1fr] gap-2 w-full">
      <div class="flex-shrink-0">
        <img :src="data.avatar" alt="Avatar" class="size-10 rounded-full object-cover" />
      </div>
      <div class="flex flex-col w-full">
        <input
          type="text"
          placeholder="Write a comment"
          class="w-full border-b border-[#CCCCCC] focus:outline-none focus:border-primary"
          @focus="handleFocus"
          @input="handleCommentInput"
          v-model="commentText"
          @keydown="handleKeyDown"
        />
        <div v-if="showActions" class="mt-2 flex gap-2 items-center justify-between">
          <div class="relative">
            <button
              @click="isPickerVisible = !isPickerVisible"
              class="pi pi-face-smile text-xl cursor-pointer"
              aria-label="Toggle Emoji Picker"
            />
            <EmojiPicker
              :native="true"
              v-bind:disable-skin-tones="true"
              v-if="isPickerVisible"
              @select="addEmoji"
              class="absolute z-10 -mt-2 emoji-picker"
            />
          </div>
          <div class="flex gap-2">
            <button
              @click="handleCancel"
              class="rounded-full text-xs text-primary font-semibold p-2"
            >
              Cancel
            </button>
            <button
              @click="handleSend"
              :class="{
                'rounded-lg text-xs font-semibold px-4': true,
                'bg-primary text-white': isCommentNotEmpty,
                'bg-[rgba(0,0,0,0.05)] text-[#909090]': !isCommentNotEmpty,
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

<style>
  input::placeholder {
    color: #666666;
    font-size: 14px;
    font-weight: 500;
  }
</style>
