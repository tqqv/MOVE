<script setup>
  import { ref } from 'vue';
  import rep from '@icons/rep.vue';
  import rep2500 from '@icons/reps25000.vue';
  import dislike from '@/components/icons/dislike.vue';
  import like from '@/components/icons/like.vue';
  import verified from '@icons/verified.vue';
  import CommentField from './CommentField.vue';
  import CommentReply from './CommentReply.vue';

  const openCommentField = ref(false);
  const openCommentReply = ref(false);

  defineProps({
    comment: Object,
  });

  // HANDLE FIELD REPLY
  const handleOpenCommentField = () => {
    openCommentField.value = !openCommentField.value;
  };

  // HANDLE VIEW REPLY
  const handleOpenCommentReply = () => {
    openCommentReply.value = !openCommentReply.value;
  };
</script>

<template>
  <tr class="bg-white border-b-[1px] border-gray-dark">
    <!-- COMMENT -->
    <td class="w-1/2 px-6 py-4 font-normal align-top text-gray-900">
      <div class="flex gap-x-4">
        <img
          :src="comment.userComments.avatar"
          alt="avatar"
          class="size-14 object-cover rounded-full"
        />
        <!-- RIGHT COMMENT -->
        <div class="flex flex-col gap-y-1">
          <!-- REPS SENDER -->
          <div class="flex items-center rounded-full bg-yellow-dark px-3 py-1 gap-x-1 mb-3 w-fit">
            <rep />
            <h1 class="text-white font-bold text-[10px]">REPs Sender</h1>
          </div>
          <!-- USERNAME -->
          <div class="flex items-center gap-x-4">
            <h1 class="font-bold">{{ comment.userComments.username }}</h1>
            <span v-if="comment.userComments.verified" class="mb-1">
              <verified fill="fill-blue" />
            </span>
            <p class="text-xs text-footer">{{ comment.timeAgo }}</p>
          </div>
          <!-- COMMENT -->
          <p class="text-sm break-words">
            {{ comment.content }}
          </p>
          <!-- REPLY COMMENT -->
          <div class="flex mt-4 gap-x-6 text-sm">
            <div class="flex gap-x-8 items-center text-primary">
              <!-- LIKE DISLIKE -->
              <div class="flex items-center gap-x-3">
                <like class="cursor-pointer hover:scale-110" />
                <p class="mt-1">{{ comment.like }}</p>
              </div>
              <div>
                <dislike
                  class="cursor-pointer mt-2 hover:scale-110"
                  fill="white"
                  stroke="#13ceb3"
                />
              </div>
              <i class="pi pi-ellipsis-v text-lg cursor-pointer"></i>
              <p @click="handleOpenCommentField" class="cursor-pointer font-medium">Reply</p>
              <div
                class="flex items-center font-medium gap-x-4 cursor-pointer"
                @click="handleOpenCommentReply"
              >
                <p class="truncate">View {{ comment.totalRepliesCount > 0 ? comment.totalRepliesCount: '' }} replies</p>
                <i class="pi pi-chevron-down text-sm"></i>
              </div>
            </div>
          </div>
          <!-- COMMENT FIELD -->
          <div v-show="openCommentField" class="mt-8">
            <CommentField
              @commentId ="comment.id"
              @handleOpenCommentField="handleOpenCommentField"
            />
          </div>
          <!-- REPLY COMMENT -->
          <div v-show="openCommentReply" class="mt-8">
            <CommentReply />
          </div>
        </div>
      </div>
    </td>
    <!-- REPS RECEIVED -->
    <td class="w-[16%] px-6 py-4 align-top">
      <div class="flex items-center gap-x-2">
        <div class="scale-50"><rep2500 /></div>
        <p class="font-semibold text-base">{{ comment.reps }}</p>
      </div>
    </td>
    <!-- VIDEO -->
    <td class="px-6 py-4 align-top">
      <div class="flex gap-x-4">
        <div class="relative w-1/2 min-w-[180px]">
          <div class="relative w-full aspect-video">
            <img
              :src="comment.Video.thumbnailUrl"
              alt="video thumbnail"
              class="object-cover w-full h-full"
            />
            <div class="absolute bottom-2 right-2 p-2 bg-title/60 rounded-md text-xs text-white">
              {{ comment.Video.duration }}
            </div>
          </div>
        </div>
        <div class="w-1/2">
          <h1 class="font-semibold mb-2 line-clamp-2">{{ comment.Video.title }}</h1>
          <h2 class="text-xs mb-4 text-body">{{ comment.Video.category.title }}</h2>
          <p class="text-sm text-primary cursor-pointer font-semibold">View comment</p>
        </div>
      </div>
    </td>
  </tr>
</template>
