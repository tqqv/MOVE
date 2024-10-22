<script setup>
  import { ref, onMounted } from 'vue';
  import CommentItem from './CommentItem.vue';
  import { getAllComments, getAllChildComments } from '@/services/comment';
  import WriteComments from './WriteComments.vue';

  const comments = ref([]); // Chứa bình luận gốc
  const childComments = ref({}); // Chứa bình luận con
  const currentPage = ref(1); // Trang hiện tại
  const commentsPerPage = ref(5); // Số bình luận mỗi trang
  const hasMoreComments = ref(true);
  const totalRepliesCount = ref({}); // Hàm lấy bình luận
  const fetchComments = async () => {
    const videoId = 1; // Thay đổi videoId theo nhu cầu thực tế
    try {
      const response = await getAllComments(videoId, {
        page: currentPage.value,
        pageSize: commentsPerPage.value,
      });

      if (response.data.success) {
        const newComments = response.data.data;

        if (newComments.length > 0) {
          newComments.forEach((comment) => {
            // Lưu trữ totalRepliesCount trong mảng hoặc đối tượng
            if (!totalRepliesCount.value[comment.id]) {
              totalRepliesCount.value[comment.id] = comment.totalRepliesCount || 0; // Gán giá trị mặc định nếu không có
            }
          });

          comments.value.push(...newComments); // Thêm vào mảng bình luận hiện có
          hasMoreComments.value = newComments.length === commentsPerPage.value;
        }

        // Kiểm tra xem đã đến trang cuối hay chưa
        if (newComments.length < commentsPerPage.value) {
          hasMoreComments.value = false;
        }
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchChildComments = async (parentId) => {
    const pageInfo = { page: 1, pageSize: 5 }; // Thông tin trang cho bình luận con
    try {
      const response = await getAllChildComments(parentId, pageInfo);
      console.log('Child comments for parentId:', parentId, response.data.data);

      if (response.data.success && response.data.data) {
        if (!childComments.value[parentId]) {
          childComments.value[parentId] = [];
        }
        childComments.value[parentId] = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
      } else {
        console.warn(`No child comments found for parent ID ${parentId}`);
      }
    } catch (error) {
      console.error('Error fetching child comments:', error);
    }
  };

  // Hàm tải thêm bình luận (Load More)
  const loadMoreComments = () => {
    if (hasMoreComments.value) {
      currentPage.value++;
      fetchComments(); // Gọi lại để lấy bình luận cho trang mới
    }
  };

  onMounted(() => {
    fetchComments();
  });
</script>

<template>
  <div class="space-y-8">
    <!-- Component viết bình luận -->
    <WriteComments @sendComment="fetchComments" :fetchChildComments="fetchChildComments" />

    <!-- Hiển thị danh sách bình luận -->
    <CommentItem
      v-for="(comment, index) in comments"
      :key="comment.id"
      :comment="comment"
      :fetchChildComments="fetchChildComments"
      :fetchComments="fetchComments"
      :childComments="childComments"
      :totalRepliesCount="totalRepliesCount"
    />

    <!-- Nút Load More, chỉ hiển thị khi số bình luận đã tải ít hơn tổng số bình luận -->
    <div
      v-if="hasMoreComments && comments.length > 0"
      class="font-bold text-[13px] text-primary cursor-pointer pt-2"
      @click="loadMoreComments"
    >
      <span>Show more comments</span>
    </div>
  </div>
</template>
=================================
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
    childComments: Object,
    totalRepliesCount: Object,
  });

  // State to manage child comments
  const isShowMoreChild = ref(false);
  const isReplyChild = ref(false);
  const currentPageChild = ref(1);
  const commentsPerPageChild = ref(5);

  const toggleLike = () => {
    props.comment.isLike = !props.comment.isLike;
    if (props.comment.isLike) props.comment.isDisLike = false;
  };

  const toggleDislike = () => {
    props.comment.isDisLike = !props.comment.isDisLike;
    if (props.comment.isDisLike) props.comment.isLike = false;
  };

  const toggleReply = () => {
    isReplyChild.value = !isReplyChild.value;
  };

  const timeFromNow = (createdAt) => {
    return dayjs(createdAt, 'YYYY-MM-DD HH:mm:ss').fromNow();
  };

  // Load more child comments for pagination
  const loadMoreChildComments = () => {
    currentPageChild.value++;
  };

  // Toggle to show/hide child comments
  const toggleShowMoreChild = () => {
    isShowMoreChild.value = !isShowMoreChild.value;
    if (isShowMoreChild.value) {
      console.log(props.comment.id);
      props.fetchChildComments(props.comment.id);
    }
  };
</script>

<template>
  <div class="flex gap-x-4">
    <div class="flex-shrink-0">
      <img
        :src="comment.userComments.avatar"
        alt="Avatar"
        class="size-10 object-cover rounded-full"
      />
    </div>
    <div class="space-y-2">
      <!-- USERNAME -->
      <div class="flex justify-between items-center gap-x-4 w-fit">
        <h1 class="font-bold">{{ comment.userComments.username }}</h1>
        <span v-if="comment.userComments.isVerified">
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
        :fetchChildComments="fetchChildComments"
      />

      <!-- Toggle to show/hide child comments -->
      <div v-if="totalRepliesCount?.[comment.id] > 0" class="pt-2">
        <div class="font-bold text-[13px] text-primary cursor-pointer" @click="toggleShowMoreChild">
          <span v-if="!isShowMoreChild"> Show replies ({{ totalRepliesCount[comment.id] }}) </span>
          <span v-else> Hide replies </span>
        </div>

        <!-- Display child comments -->
        <div v-if="isShowMoreChild">
          <CommentItem
            v-for="(child, index) in childComments[comment.id]?.slice(
              0,
              currentPageChild * commentsPerPageChild,
            )"
            :key="child.id"
            :comment="child"
            :fetchChildComments="fetchChildComments"
            :childComments="childComments"
          />

          <!-- Load More Child Comments -->
          <div
            v-if="
              childComments[comment.id] &&
              childComments[comment.id].length > currentPageChild * commentsPerPageChild
            "
            class="font-bold text-[13px] text-primary cursor-pointer"
            @click="loadMoreChildComments"
          >
            <span>Show more replies</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
===========================
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
    commentId: {
      type: Number,
      required: true,
    },
    fetchChildComments: {
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
  const togglePicker = () => {
    isPickerVisible.value = !isPickerVisible.value; // Sửa lại đây
  };
  const handleSend = async () => {
    const data = { content: commentText.value, parentId: parentId.value };
    console.log(data);
    console.log(commentText.value);

    // Test videoID
    const videoId = 1;

    try {
      const response = await postComments(videoId, data);
      console.log(response.data.success);

      // Check if the request was successful
      if (response.data.success && response.data.data) {
        console.log('Comment created successfully:', response.data.data);

        // Reset the comment input
        commentText.value = '';
        showActions.value = false;

        const parentID = response.data.data.parentId || null;
        emit('sendComment', parentID); // Chỉ gọi một lần
        console.log(parentID);
        console.log('ĐANG FETCHHHH');

        // Emit the event and fetch updated comments
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

<style>
  input::placeholder {
    color: #666666;
    font-size: 14px;
    font-weight: 500;
  }
</style>
