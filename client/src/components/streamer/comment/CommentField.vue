<script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useStreamerStore } from '@/stores';
  import { postComments } from '@/services/comment';
  const streamerStore = useStreamerStore();

  const props = defineProps({
    comment: Object,
  });

  const commentText = ref('');
  const commentInput = ref(null);

  const handleCommentInput = (event) => {
    commentText.value = event.target.value;
  };

  const isCommentNotEmpty = computed(() => commentText.value.trim() !== '');

  //   HANDLE CANCEL
  const emit = defineEmits(['handleOpenCommentField', 'updateReplies', 'updateTotalRepliesCount']);
  const handleCancel = () => {
    commentText.value = '';
    emit('handleOpenCommentField');
  };

  onMounted(() => {
    commentInput.value?.focus();
  });

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

      emit('updateReplies', newReply);
      emit('updateTotalRepliesCount', props.comment.totalRepliesCount + 1);
      commentText.value = '';
    } catch (error) {
      console.error('Error posting comment:', error);
    }
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
      <div class="flex-grow px-4 py-2 rounded-lg bg-gray-dark/25">
        <input
          class="flex-grow bg-transparent focus:outline-none placeholder:text-xs placeholder:font-medium placeholder:text-black/50 w-full h-10"
          type="text"
          placeholder="Reply comment..."
          @input="handleCommentInput"
          @keyup.enter="handleSend"
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
