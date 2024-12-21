<script setup>
  import { ref, computed } from 'vue';
  import { useStreamerStore } from '@/stores';
  import { postComments } from '@/services/comment';
  import EmojiPicker from 'vue3-emoji-picker';

  const streamerStore = useStreamerStore();

  const props = defineProps({
    comment: Object,
  });
  const showActions = ref(false);

  const commentText = ref('');

  const handleCommentInput = (event) => {
    commentText.value = event.target.value;
    autoResize(event.target);
  };
  const addEmoji = (emoji) => {
    commentText.value += emoji.i;
    autoResize(document.getElementById('commentTextarea'));
  };
  const isCommentNotEmpty = computed(() => commentText.value.trim() !== '');

  const emit = defineEmits([
    'handleOpenCommentField',
    'handleSendCommentReply',
    'updateTotalRepliesCount',
  ]);
  const handleFocus = () => {
    showActions.value = true;
  };
  //   HANDLE CANCEL
  const handleCancel = () => {
    commentText.value = '';
    emit('handleOpenCommentField');
  };

  // HANDLE REPLY COMMENT
  const handleSend = async () => {
    const data = { content: commentText.value, parentId: props.comment.id };
    try {
      const response = await postComments(props.comment.videoId, data);
      const newReply = {
        ...response.data.data,
        channelComments: {
          avatar: streamerStore.streamerChannel.avatar,
          channelName: streamerStore.streamerChannel.channelName,
          popularCheck: streamerStore.streamerChannel.popularCheck,
        },
      };

      emit('handleSendCommentReply', newReply);
      emit('updateTotalRepliesCount', props.comment.totalRepliesCount + 1);
      commentText.value = '';
      handleCancel();
      commentText.blur;
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey && isCommentNotEmpty.value) {
      event.preventDefault();
      handleSend();
    } else if (event.key === 'Enter' && event.shiftKey) {
      autoResize(document.getElementById('commentTextarea'));
    }
  };
  const autoResize = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };
</script>

<template>
  <div>
    <div class="flex gap-x-4 max-w-full">
      <img
        :src="streamerStore.streamerChannel.avatar"
        alt="Avatar"
        class="size-10 rounded-full object-cover"
      />
      <div class="flex-grow px-4 py-2 rounded-md bg-gray-dark/25">
        <textarea
          id="commentTextarea"
          placeholder="Write a comment"
          class="flex-grow bg-transparent focus:outline-none placeholder:text-sm placeholder:font-normal placeholder:text-black/50 w-full h-12 resize-none"
          @focus="handleFocus"
          @input="handleCommentInput"
          v-model="commentText"
          @keydown="handleKeyDown"
        />
        <div v-if="showActions" class="mt-2 flex gap-2 items-center justify-between">
          <div class="relative">
            <button
              @click="togglePicker"
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

<style></style>
