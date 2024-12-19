<script setup>
  import { ref, watch, onMounted, computed } from 'vue';
  import Verified from '@/components/icons/verified.vue';
  import Gift from '../icons/gift.vue';
  import Like from '../icons/like.vue';
  import Dislike from '../icons/dislike.vue';
  import WriteComments from './WriteComments.vue';
  import CommentItem from './CommentItem.vue';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import SmallLoading from '@/components/icons/smallLoading.vue';
  import { toast } from 'vue3-toastify';
  import axiosInstance from '@/services/axios';
  import ReportDialog from '@/components/ReportDialog.vue';
  import { useReadMore } from '@/utils';

  import { postReactionComment } from '@/services/comment';
  import { useUserStore, usePopupStore } from '@/stores';
  import LogoIcon from '../icons/logoIcon.vue';
  import { useCommentStore } from '@/stores/useCommentStore';

  dayjs.extend(relativeTime);

  const props = defineProps({
    comment: Object,
    fetchChildComments: Function,
    childComments: Object,
    totalRepliesCount: Object,
    childCommentsPage: {
      type: Number,
    },
    childCommentsPerPage: {
      type: Number,
    },
    hasMoreChildComments: Boolean,
    loadingReplies: Boolean,
    videoId: {
      type: [Number, String],
      required: true,
    },
    isCommentable: Boolean,
  });

  const commentStore = useCommentStore();
  const { childComments } = commentStore;

  const emit = defineEmits(['fetchComments']);
  const formatCommentText = (text) => {
    return text.replace(/\n/g, '<br/>');
  };
  const { showFullText, displayedText, toggleText, isLongText, isTallText, textElement } =
    useReadMore(formatCommentText(props.comment.content), 300);
  const userStore = useUserStore();
  const popupStore = usePopupStore();

  const currentPageChild = ref(1);
  const commentsPerPageChild = ref(5);
  const isShowMoreChild = ref(false);
  const isReplyChild = ref(false);
  const hasFetchedChildComments = ref(false);
  const id = ref(null);
  const parentIdReply = ref(null);
  // report

  const openReportComment = ref(false);
  const isReportVisible = ref(false);
  const isReportSuccessVisible = ref(false);
  const reportTypeVideos = ref([]);
  const selectedReportComment = ref(null);
  const selectedCommentId = ref(null);

  const likeCount = ref(props.comment.likeCount);
  const userReactionType = ref(props.comment.userReactionType);

  const openLoginPopup = () => {
    popupStore.openLoginPopup();
  };
  const toggleReportComment = (commentId) => {
    selectedCommentId.value = commentId;
    openReportComment.value = !openReportComment.value;
  };
  const openPopupReport = () => {
    if (!userStore.user) {
      popupStore.openLoginPopup();

      return;
    }
    isReportVisible.value = !isReportVisible.value;
    openReportComment.value = false;
    getAllReportTypes();
  };

  const toggleReaction = async (type) => {
    if (!userStore.user) {
      openLoginPopup();
      return;
    }
    const data = { commentId: props.comment.id, reactionType: type };
    try {
      const response = await postReactionComment(data);

      if (response.status === 200) {
        if (type === 'like') {
          if (userReactionType.value === 'like') {
            likeCount.value -= 1;
          } else if (userReactionType.value === 'dislike') {
            likeCount.value += 1;
          } else {
            likeCount.value += 1;
          }
        } else if (type === 'dislike') {
          if (userReactionType.value === 'like') {
            likeCount.value -= 1;
          }
        }

        userReactionType.value = userReactionType.value === type ? null : type;
      }
    } catch (error) {
      toast.error('Error updating reaction');
    }
  };

  //===========///

  const timeFromNow = (createdAt) => {
    return dayjs(createdAt, 'YYYY-MM-DD HH:mm:ss').fromNow();
  };

  const loadMoreChildComments = async () => {
    currentPageChild.value++;
    await props.fetchChildComments(props.comment.id, userStore.user?.id || null);

    if (props.totalRepliesCount[props.comment.id]) {
      props.totalRepliesCount[props.comment.id] += commentsPerPageChild.value;
    }
  };
  const toggleReply = (commentId, parentId) => {
    isReplyChild.value = !isReplyChild.value;

    if (isReplyChild.value) {
      id.value = commentId;
      parentIdReply.value = parentId;
    }
  };

  const toggleShowMoreChild = async () => {
    isShowMoreChild.value = !isShowMoreChild.value;

    if (isShowMoreChild.value && !hasFetchedChildComments.value) {
      await props.fetchChildComments(props.comment.id);
      console.log(childComments);

      hasFetchedChildComments.value = true;
    }
  };
  const toggleHide = async () => {
    isShowMoreChild.value = false;
  };
  const handleSendComment = async (newComment) => {
    if (newComment) {
      newComment.isNew = true;
      newComment.likeCount = newComment.likeCount || 0;

      if (parentIdReply.value && childComments[parentIdReply.value]) {
        childComments[parentIdReply.value].unshift(newComment);
      } else {
        if (!childComments[id.value]) {
          childComments[id.value] = [];
        }
        childComments[id.value].unshift(newComment);
      }

      isReplyChild.value = false;
      parentIdReply.value = null;
    } else {
      console.error('New comment is undefined or null');
    }
  };
  ///REPORT
  const getAllReportTypes = async () => {
    try {
      const response = await axiosInstance.get('report/getListReport?type=videos');
      if (response.status === 200) {
        reportTypeVideos.value = response.data.data;
      }
    } catch (error) {}
  };
  const handleSubmitReportComment = async () => {
    if (selectedReportComment.value.id) {
      try {
        const response = await axiosInstance.post('report/comment', {
          commentId: selectedCommentId.value,
          reportTypeId: selectedReportComment.value.id,
        });
        if (response.status === 200) {
          isReportVisible.value = false;
          isReportSuccessVisible.value = true;
        }
      } catch (error) {}
    }
  };
  const closeReportSuccess = () => {
    isReportSuccessVisible.value = false;
  };
  const closeReport = () => {
    isReportVisible.value = false;
  };
  const closeSuccess = () => {
    isReportSuccessVisible.value = false;
  };
  onMounted(() => {
    const hash = window.location.hash;
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
  const commentClasses = ref('');
  onMounted(() => {
    if (props.comment.isNew) {
      commentClasses.value =
        'border-l-4 border-primary/60 bg-primary/10 rounded-e-lg  transition-all duration-1000  ease-out';

      setTimeout(() => {
        commentClasses.value =
          'border-l-2 border-primary/40 bg-primary/5 rounded-e-lg  transition-all duration-1000 ease-out';
      }, 3000);

      setTimeout(() => {
        commentClasses.value =
          'border-l-0 border-primary/20 bg-primary/0 rounded-e-lg  transition-all duration-1000 ease-out';
      }, 4000);

      // Sau 5 giây, làm mờ hoàn toàn và biến thành trong suốt
      setTimeout(() => {
        commentClasses.value = '';
      }, 5000);
    }
  });
</script>

<template>
  <div
    class="flex gap-x-4"
    :id="`comment-${comment.id}`"
    :class="[
      commentClasses,
      comment.parentId !== null
        ? 'pl-6 py-4 px-3 border-l-2 border-gray-dark transition-all duration-300 ease-in-out '
        : '',
    ]"
  >
    <div class="flex-shrink-0">
      <RouterLink :to="`/user/${comment.userComments?.username}`">
        <img
          :src="comment?.channelComments?.avatar || comment?.userComments?.avatar"
          alt="Avatar"
          class="size-10 object-cover rounded-full"
      /></RouterLink>
    </div>

    <div class="space-y-2 w-full">
      <!-- USERNAME -->
      <div
        v-if="comment.rep > 0"
        class="bg-[#FFB564] rounded-full flex gap-x-2 items-center px-3 py-1 w-max transition-all duration-300 hover:scale-110 hover:shadow-lg"
      >
        <div
          class="bg-[#18DBC3] w-[20px] h-[20px] flex items-center justify-center rounded-full shadow-md"
        >
          <LogoIcon />
        </div>
        <div class="whitespace-nowrap text-white font-bold text-[12px]">REPs Sender</div>
      </div>

      <div class="flex justify-between items-center gap-x-4 w-fit">
        <RouterLink :to="`/user/${comment.userComments?.username}`">
          <h1 class="font-bold">
            {{ comment.channelComments?.channelName || comment.userComments?.username }}
          </h1></RouterLink
        >

        <span v-if="comment?.channelComments?.popularCheck">
          <Verified class="fill-blue" />
        </span>
        <div v-if="comment.rep > 0" class="flex gap-x-2 items-center whitespace-nowrap">
          <div class="flex-shrink-0 hover:scale-110">
            <img
              :src="comment?.commentDonationItem?.image"
              alt="REPs"
              class="w-[20px] h-[25px] rounded-full object-cover cursor-pointer"
            />
          </div>
          <span class="text-xs mt-1 text-primary">Gifted {{ comment.rep }} REPs</span>
        </div>
        <p class="pt-0.5 whitespace-nowrap text-xs text-[#666666]">
          {{ timeFromNow(comment.createdAt) }}
        </p>
      </div>
      <div v-if="comment.commentReport?.some((report) => report.status === 'approved')">
        <span class="text-[#666666] text-sm italic"
          >[This comment has been removed due to violation of community guideline]</span
        >
      </div>
      <!-- COMMENT -->
      <div
        ref="textElement"
        v-if="!comment.commentReport?.some((report) => report.status === 'approved')"
        class="break-all text-sm text-black"
      >
        <div ref="textElement" v-html="displayedText()" />
        <div v-if="isLongText || isTallText">
          <div v-if="!showFullText" class="text-[#666666]">...</div>
          <button @click="toggleText" class="text-[#666666] hover:underline font-semibold">
            {{ showFullText ? 'Show less' : 'Read more' }}
          </button>
        </div>
      </div>

      <!-- Like/Dislike -->
      <div
        v-if="!comment.commentReport?.some((report) => report.status === 'approved')"
        :class="['flex gap-4 items-center', !isCommentable ? 'opacity-50 pointer-events-none' : '']"
      >
        <div class="flex gap-2" @click="toggleReaction('like')">
          <Like
            class="cursor-pointer hover:scale-110"
            :fill="userReactionType === 'like' ? '#13CEB3' : 'white'"
            :stroke="userReactionType === 'like' ? 'none' : '#13D0B4'"
          />
          <div>
            <span class="items-center text-primary text-[13px]">{{ likeCount }}</span>
          </div>
        </div>
        <div class="flex gap-2" @click="toggleReaction('dislike')">
          <Dislike
            class="cursor-pointer mt-1 hover:scale-110"
            :fill="userReactionType === 'dislike' ? '#13CEB3' : 'white'"
            :stroke="userReactionType === 'dislike' ? 'none' : '#13D0B4'"
          />
        </div>
        <div class="relative">
          <div>
            <button
              class="text-primary text-[13px] font-bold flex items-center cursor-pointer"
              id="report-menu-button"
              @click="toggleReportComment(comment.id)"
            >
              <i class="pi pi-ellipsis-v"></i>
            </button>
          </div>
          <div
            v-if="openReportComment"
            id="report-menu"
            class="absolute left-0 z-10 mt-5 top-3 p-2 origin-top-right rounded-md bg-white shadow-lg focus:outline-none text-black border-none"
          >
            <ul class="flex flex-col justify-center h-full gap-y-1 m-0 p-0">
              <li
                class="flex items-center gap-x-2 text-[12px] cursor-pointer text-start hover:bg-gray-dark px-3 py-1 rounded truncate"
                @click="openPopupReport"
              >
                <i class="pi pi-flag text-sm"></i>
                <span class="truncate"> Report comment</span>
              </li>
            </ul>
          </div>
        </div>
        <span
          class="font-semibold text-[13px] text-primary cursor-pointer"
          @click="
            () => {
              toggleReply(comment.id, comment.parentId);
              // console.log(comment.userComments.username);
            }
          "
        >
          Reply
        </span>
      </div>

      <!-- Write comment component -->
      <WriteComments
        v-if="isReplyChild"
        :commentId="comment.id"
        @sendComment="handleSendComment"
        :replyToUsername="replyToUsername"
        :videoId="videoId"
        :isCommentable="isCommentable"
      />
      <div v-if="!isShowMoreChild">
        <CommentItem
          v-for="(child, index) in childComments[comment.id]?.filter((c) => c.isNew)"
          :key="'new-' + child.id"
          :comment="child"
          :fetchChildComments="props.fetchChildComments"
          :childComments="childComments"
          :totalRepliesCount="props.totalRepliesCount"
          :videoId="videoId"
          :isCommentable="isCommentable"
        />
      </div>
      <!-- Toggle to show/hide child comments -->
      <div
        v-if="
          totalRepliesCount?.[comment.id] > 0 &&
          !comment.commentReport?.some((report) => report.status === 'approved')
        "
      >
        <div class="flex gap-2 font-bold text-[13px] text-primary cursor-pointer">
          <div>
            <span @click="toggleShowMoreChild" v-if="!isShowMoreChild">
              Show replies ({{ comment.totalRepliesCount }})
            </span>

            <span @click="toggleHide" v-else class="mt-4"> Hide replies </span>
          </div>
          <div v-if="loadingReplies"><SmallLoading /></div>
        </div>

        <!-- Display child comments -->
        <div class="mt-2" v-if="isShowMoreChild">
          <CommentItem
            v-for="(child, index) in childComments[comment.id]?.slice(
              0,
              currentPageChild * commentsPerPageChild,
            )"
            :key="child.id"
            :comment="child"
            :fetchChildComments="props.fetchChildComments"
            :childComments="childComments"
            :totalRepliesCount="props.totalRepliesCount"
            :videoId="videoId"
            :isCommentable="isCommentable"
          />
          <div
            v-if="hasMoreChildComments && !loadingReplies"
            class="font-bold text-[13px] text-primary cursor-pointer"
            @click="loadMoreChildComments"
          >
            <span>Show more replies</span>
          </div>
          <!-- Load More Child Comments -->
        </div>
      </div>
    </div>
  </div>
  <ReportDialog
    title="comment"
    groupName="reportTypeComments"
    titleReport="Report Comment"
    :isReportVisible="isReportVisible"
    :isReportSuccessVisible="isReportSuccessVisible"
    :reportType="reportTypeVideos"
    :selectedReport="selectedReportComment"
    @update:selectedReport="selectedReportComment = $event"
    @close="closeReportSuccess"
    @submit="handleSubmitReportComment"
    @hide="closeReport"
    @hideSuccess="closeSuccess"
  />
</template>
