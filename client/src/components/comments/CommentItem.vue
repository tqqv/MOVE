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
  });
  const userStore = useUserStore();
  const popupStore = usePopupStore();

  const emit = defineEmits(['fetchComments']);

  const { displayedText, toggleText, isLongText, showFullText } = useReadMore(
    props.comment.content,
    300,
  );
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
    await props.fetchChildComments(props.comment.id);

    if (props.totalRepliesCount[props.comment.id]) {
      props.totalRepliesCount[props.comment.id] += commentsPerPageChild.value;
    }
  };
  const toggleReply = (commentId, parentId, username) => {
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
      hasFetchedChildComments.value = true;
    }
  };
  const handleSendComment = async (newComment) => {
    if (newComment) {
      newComment.isNew = true;

      if (parentIdReply.value && props.childComments[parentIdReply.value]) {
        props.childComments[parentIdReply.value].unshift(newComment);
      } else {
        if (!props.childComments[id.value]) {
          props.childComments[id.value] = [];
        }
        props.childComments[id.value].unshift(newComment);
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
    } catch (error) {
      toast.error(error.message);
    }
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
          toast.success(response.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
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
</script>

<template>
  <div
    class="flex gap-x-4"
    :id="`comment-${comment.id}`"
    :class="{
      'pl-6 py-4 px-3 border-l-2 border-gray-dark': comment.parentId !== null,
      'border-l-4 border-primary/60 bg-primary/10 rounded-e-lg mb-1': comment.isNew,
    }"
  >
    <div class="flex-shrink-0">
      <img
        :src="comment?.userComments?.avatar"
        alt="Avatar"
        class="size-10 object-cover rounded-full"
      />
    </div>

    <div class="space-y-2 w-full">
      <!-- USERNAME -->
      <div class="flex justify-between items-center gap-x-4 w-fit">
        <h1 class="font-bold">{{ comment.userComments?.username }}</h1>
        <span v-if="comment.userComments?.isVerified">
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
      <div v-if="comment.commentReport?.some((report) => report.status === 'approved')">
        <span class="text-[#666666] text-sm italic"
          >[This comment has been removed due to violation of community guideline]</span
        >
      </div>
      <!-- COMMENT -->
      <p
        v-if="!comment.commentReport?.some((report) => report.status === 'approved')"
        class="break-all text-sm text-black"
      >
        {{ displayedText() }}
        <span v-if="isLongText">
          <button @click="toggleText" class="text-primary font-semibold ml-1">
            {{ showFullText ? 'Show less' : 'Read more' }}
          </button>
        </span>
      </p>

      <!-- Like/Dislike -->
      <div
        v-if="!comment.commentReport?.some((report) => report.status === 'approved')"
        class="flex gap-4 items-center"
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
            class="absolute left-0 z-10 mt-5 top-3 p-2 border border-primary origin-top-right rounded-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none text-black"
          >
            <span
              @click="openPopupReport"
              class="text-primary text-xs whitespace-nowrap cursor-pointer"
            >
              Report comment
            </span>
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
      />
      <div v-if="!isShowMoreChild">
        <CommentItem
          v-for="(child, index) in childComments[comment.id]?.filter((c) => c.isNew)"
          :key="'new-' + child.id"
          :comment="child"
          :fetchChildComments="props.fetchChildComments"
          :childComments="props.childComments"
          :totalRepliesCount="props.totalRepliesCount"
          :videoId="videoId"
        />
      </div>
      <!-- Toggle to show/hide child comments -->
      <div
        v-if="
          totalRepliesCount?.[comment.id] > 0 &&
          !comment.commentReport?.some((report) => report.status === 'approved')
        "
      >
        <div
          class="flex gap-2 font-bold text-[13px] text-primary cursor-pointer"
          @click="toggleShowMoreChild"
        >
          <div>
            <span v-if="!isShowMoreChild"> Show replies ({{ comment.totalRepliesCount }}) </span>

            <span v-else class="mt-4"> Hide replies </span>
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
            :childComments="props.childComments"
            :totalRepliesCount="props.totalRepliesCount"
            :videoId="videoId"
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
