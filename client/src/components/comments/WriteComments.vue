<script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
  import EmojiPicker from 'vue3-emoji-picker';
  import { postComments } from '@/services/comment';
  import { useUserStore } from '@/stores';

  const isPickerVisible = ref(false);
  const commentText = ref('');
  const emit = defineEmits(['sendComment']);
  const userStore = useUserStore();
  const avatar = computed(() => userStore.user?.avatar || '');

  const props = defineProps({
    fetchComments: {
      type: Function,
      required: true,
    },
    commentId: {
      type: Number,
      required: true,
    },
    fetchChildComments: {
      type: Function,
      required: true,
    },
    replyToUsername: String,
  });

  const parentId = ref(props.commentId || null);
  const showActions = ref(false);

  const handleCommentInput = (event) => {
    commentText.value = event.target.value;
  };

  const addEmoji = (emoji) => {
    commentText.value += emoji.i;
    const commentInput = document.getElementById('commentInput');
    commentInput.innerText = commentText.value;
  };

  const handleFocus = () => {
    showActions.value = true;
  };

  const togglePicker = () => {
    isPickerVisible.value = !isPickerVisible.value;
  };

  const handleSend = async () => {
    const data = { content: commentText.value, parentId: parentId.value };
    console.log(data);
    console.log(commentText.value);
    //  data test videoID
    const videoId = 1018146045;
    try {
      const response = await postComments(videoId, data);
      console.log('Response data:', response.data);

      if (response.data.success && response.data.data) {
        console.log('Comment created successfully:', response.data.data);

        commentText.value = '';
        showActions.value = false;
        const newComment = {
          ...response.data.data,
          userComments: {
            avatar: userStore.user.avatar,
            username: userStore.user.username,
            isVerified: userStore.user.isVerified,
          },
        };
        emit('sendComment', newComment);
        console.log(newComment);
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
    const commentInput = document.getElementById('commentInput');
    commentInput.innerText = ''; // Xóa nội dung của <div>
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
      event.preventDefault(); // Ngăn chặn dòng mới khi nhấn Enter
      handleSend();
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    if (!avatar.value) {
      userStore.fetchUserProfile();
    }
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });
</script>

<template>
  <div class="space-y-6">
    <!-- WRITE COMMENTS -->
    <div class="relative grid grid-cols-[auto_1fr] gap-2 w-full py-2">
      <div class="flex-shrink-0">
        <img v-if="avatar" :src="avatar" class="size-10 rounded-full object-cover" />
      </div>
      <div class="flex-grow px-4 py-2 rounded-md bg-gray-dark/25">
        <input
          type="text"
          placeholder="Write a comment"
          class="flex-grow bg-transparent focus:outline-none placeholder:text-xs placeholder:font-normal placeholder:text-black/50 w-full h-12"
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
