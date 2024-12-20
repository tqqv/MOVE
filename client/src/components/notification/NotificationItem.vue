<script setup>
  import { makeAsReadOne } from '@/services/notification';
  import { formatDate } from '@/utils';
  import { computed, onMounted, ref } from 'vue';

  const props = defineProps({
    notification: {
      type: Object,
      required: true,
    },
  });
  const emit = defineEmits(['toggleNotiMenu']);

  const translatedContentEn = computed(() => {
    return (
      props.notification?.notificationEntity?.notificationTranslation?.find(
        (translation) => translation.languageCode === 'en',
      )?.translatedContent || ''
    );
  });

  const closePopup = () => {
    emit('toggleNotiMenu');
  };

  const handleMakeRead = async (notificationId) => {
    try {
      const response = await makeAsReadOne(notificationId);
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      closePopup();
    }
  };
</script>
<template>
  <RouterLink
    :to="
      notification?.targetVideo
        ? `/video/${notification?.targetVideo?.id}`
        : `/live/${notification?.channelActor?.User?.username}`
    "
    class="flex gap-x-3 items-start pb-3 p-3 mb-1 min-h-20 rounded-md hover:bg-gray-light relative cursor-pointer"
    :class="{
      'bg-primary/15 hover:bg-primary/15':
        notification?.visitStatus[0]?.status === 'recieved' || !notification?.visitStatus.length,
    }"
    @click="handleMakeRead(notification?.id)"
  >
    <img
      :src="notification?.channelActor?.avatar || notification?.userActor?.avatar"
      alt="avatar people"
      class="rounded-full object-cover size-10 flex-shrink-0"
    />
    <div class="flex flex-col gap-y-1 mr-6">
      <h1 class="text_para">
        <span class="text_para font-semibold mr-1">{{
          notification?.channelActor?.channelName || notification?.userActor?.username
        }}</span>
        <span>{{ translatedContentEn }}</span>
      </h1>
      <p class="text_secondary text-[12px] text-[#ACACAC]">
        {{ formatDate(notification?.createdAt) }}
      </p>
    </div>
    <div
      v-if="
        notification?.visitStatus[0]?.status === 'recieved' || !notification?.visitStatus.length
      "
      class="absolute top-1/2 right-3 transform -translate-y-1/2"
    >
      <div class="p-1 rounded-full bg-primary-light"></div>
    </div>
  </RouterLink>
</template>
