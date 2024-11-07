<script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
  import EmojiPicker from 'vue3-emoji-picker';
  import { postComments } from '@/services/comment';
  import { useUserStore } from '@/stores';
  import Login from '@/pages/Login.vue';
  import { usePopupStore } from '@/stores';

  const isPickerVisible = ref(false);
  const commentText = ref('');
  const emit = defineEmits(['sendComment']);
  const userStore = useUserStore();
  const popupStore = usePopupStore();

  const avatar = computed(
    () => userStore.user?.avatar || 'https://img.upanh.tv/2024/06/18/user-avatar.png',
  );

  const props = defineProps({
    fetchComments: {
      type: Function,
    },
    commentId: {
      type: Number,
    },
    fetchChildComments: {
      type: Function,
      required: true,
    },
    videoId: {
      type: [Number, String],
      required: true,
    },
    replyToUsername: String,
  });

  const parentId = ref(props.commentId || null);
  const showActions = ref(false);
  const handleCommentInput = (event) => {
    commentText.value = event.target.value;
    autoResize(event.target);
  };
  const openLoginPopup = () => {
    popupStore.openLoginPopup();
  };
  const addEmoji = (emoji) => {
    commentText.value += emoji.i;
    autoResize(document.getElementById('commentTextarea'));
  };

  const handleFocus = () => {
    showActions.value = true;
  };

  const togglePicker = () => {
    isPickerVisible.value = !isPickerVisible.value;
  };

  const handleSend = async () => {
    if (!userStore.user) {
      openLoginPopup();
      return;
    }
    const data = { content: commentText.value, parentId: parentId.value };
    try {
      const response = await postComments(props.videoId, data);

      if (response.data.success && response.data.data) {
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
    commentInput.innerText = '';
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
      event.preventDefault();
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
  const autoResize = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };
</script>

<template>
  <div class="space-y-6">
    <!-- WRITE COMMENTS -->
    <div class="relative grid grid-cols-[auto_1fr] gap-2 w-full py-2">
      <div class="flex-shrink-0">
        <img v-if="avatar" :src="avatar" class="size-10 rounded-full object-cover" />
      </div>
      <div class="flex-grow px-4 py-2 rounded-md bg-gray-dark/25">
        <textarea
          placeholder="Write a comment"
          class="flex-grow bg-transparent focus:outline-none placeholder:text-sm placeholder:font-normal placeholder:text-black/50 w-full h-12 resize-none"
          rows="1"
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
  <Login v-model:visible="popupStore.showLoginPopup" />
</template>
