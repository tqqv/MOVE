<script setup>
  import { ref, onMounted, defineExpose } from 'vue';
  import Rep from '../icons/rep.vue';
  import Verified from '@/components/icons/verified.vue';
  import Gift from '../icons/gift.vue';
  import Like from '../icons/like.vue';
  import Dislike from '../icons/dislike.vue';
  import { getAllComments, getAllChildComments } from '@/services/comment';

  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import WriteComments from './WriteComments.vue';
  dayjs.extend(relativeTime);

  const comments = ref([]);
  const replyVisible = ref({});
  const childComments = ref({});
  const visibleChildComments = ref({});
  const isReplyChild = ref({});

  const isShowMore = ref(false);
  const visibleComments = ref(3);

  const toggleLike = (comment) => {
    comment.isLike = !comment.isLike;
    if (comment.isLike) comment.isDisLike = false;
  };

  const toggleDislike = (comment) => {
    comment.isDisLike = !comment.isDisLike;
    if (comment.isDisLike) comment.isLike = false;
  };

  const toggleShowMore = () => {
    isShowMore.value = !isShowMore.value;
  };

  const fetchComments = async () => {
    const videoId = 1;
    try {
      const response = await getAllComments(videoId);
      if (response.data.success) {
        comments.value = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
      }
      comments.value.forEach((comment) => {
        fetchChildComments(comment.id);
      });
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchChildComments = async (parentId) => {
    try {
      const response = await getAllChildComments(parentId);
      if (response.data.success) {
        childComments.value[parentId] = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
      }
    } catch (error) {
      console.error('Error fetching child comments:', error);
    }
  };
  const isShowMoreChild = ref({});
  const toggleShowMoreChild = (commentId) => {
    replyVisible.value[commentId] = !replyVisible.value[commentId];
    isShowMoreChild.value[commentId] = !isShowMoreChild.value[commentId];
  };
  const toggleReply = (commentId) => {
    isReplyChild.value[commentId] = !isReplyChild.value[commentId];
  };

  defineExpose({ fetchComments });

  const timeFromNow = (createAt) => {
    return dayjs(createAt, 'YYYY-MM-DD HH:mm:ss').fromNow();
  };

  onMounted(() => {
    fetchComments();
  });
</script>

<template>
  <div class="space-y-6">
    <div
      v-for="(comment, index) in isShowMore ? comments : comments?.slice(0, visibleComments)"
      :key="comment.id"
      class="flex gap-x-4"
    >
      <div class="flex-shrink-0">
        <img :src="comment.avatar" alt="Avatar" class="size-10 object-cover rounded-full" />
      </div>
      <div class="space-y-2">
        <!-- USERNAME -->
        <div class="flex justify-between items-center gap-x-4 w-fit">
          <h1 class="font-bold">{{ comment.username }}</h1>
          <span v-if="comment.isVerified">
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
          <div class="flex gap-2" @click="toggleLike(comment)">
            <Like
              class="cursor-pointer"
              :fill="comment.isLike ? '#13CEB3' : 'white'"
              :stroke="comment.isLike ? 'none' : '#13D0B4'"
            />
            <span>{{ comment.like }}</span>
          </div>
          <div class="flex gap-2" @click="toggleDislike(comment)">
            <Dislike
              class="cursor-pointer mt-1"
              :fill="comment.isDisLike ? '#13CEB3' : 'white'"
              :stroke="comment.isDisLike ? 'none' : '#13D0B4'"
            />
            <span>{{ comment.dislike }}</span>
          </div>
          <span
            class="font-semibold text-[13px] text-primary cursor-pointer"
            @click="toggleReply(comment.id)"
          >
            Reply
          </span>
        </div>
        <!-- Write comment component -->
        <WriteComments
          v-if="isReplyChild[comment.id]"
          :commentId="comment.id"
          :fetchChildComments="fetchChildComments"
        />
        <!-- Show replies button -->
        <!-- Show more/Show less child comments -->
        <div
          v-if="childComments[comment.id]?.length > 0"
          class="font-bold text-[13px] text-primary flex gap-2 cursor-pointer pt-2"
          @click="toggleShowMoreChild(comment.id)"
        >
          <i class="pi" :class="isShowMoreChild[comment.id] ? 'pi-angle-up' : 'pi-angle-down'" />
          <span>
            {{
              isShowMoreChild[comment.id]
                ? 'Show less replies'
                : `Show ${childComments[comment.id]?.length} replies`
            }}
          </span>
        </div>

        <!-- Show child comments -->
        <div v-if="replyVisible[comment.id]" class="pt-2">
          <div
            v-for="child in childComments[comment.id]?.slice(0, visibleChildComments[comment.id])"
            :key="child.id"
            class="flex gap-x-4"
          >
            <div class="flex-shrink-0">
              <img :src="child.avatar" alt="Avatar" class="size-8 object-cover rounded-full" />
            </div>
            <div class="space-y-2">
              <div class="flex justify-between items-center gap-x-4 w-fit">
                <h1 class="font-bold">{{ child.username }}</h1>
                <span v-if="child.isVerified">
                  <Verified class="fill-blue" />
                </span>
                <div v-if="child.rep > 0" class="flex items-center whitespace-nowrap">
                  <Gift class="mr-1" />
                  <span class="text-xs mt-1 text-[#FFB564]">Gifted {{ child.rep }} REPs</span>
                </div>
                <p class="pt-0.5 whitespace-nowrap text-xs text-[#666666]">
                  {{ timeFromNow(child.createdAt) }}
                </p>
              </div>

              <!-- COMMENT -->
              <p class="break-words text-sm text-black">{{ child.content }}</p>

              <!-- Like/Dislike -->
              <div class="flex gap-4 items-center pb-6">
                <div class="flex gap-2" @click="toggleLike(child)">
                  <Like
                    class="cursor-pointer"
                    :fill="child.isLike ? '#13CEB3' : 'white'"
                    :stroke="child.isLike ? 'none' : '#13D0B4'"
                  />
                  <span>{{ child.like }}</span>
                </div>
                <div class="flex gap-2" @click="toggleDislike(child)">
                  <Dislike
                    class="cursor-pointer mt-1"
                    :fill="child.isDisLike ? '#13CEB3' : 'white'"
                    :stroke="child.isDisLike ? 'none' : '#13D0B4'"
                  />
                  <span>{{ child.dislike }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Show more/Show less parent comments -->
    <div
      v-if="comments.length > visibleComments"
      class="font-bold text-[13px] text-primary flex gap-2 cursor-pointer"
      @click="toggleShowMore"
    >
      <i class="pi" :class="isShowMore ? 'pi-angle-up' : 'pi-angle-down'" />
      <span class="whitespace-nowrap">{{
        isShowMore ? 'Show less comments' : `Show ${comments.length - visibleComments} comments`
      }}</span>
    </div>
  </div>
</template>
