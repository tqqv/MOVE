<script setup>
  import Rate from '@/components/icons/rate.vue';
  import { formatDate } from '@/utils';
  import { computed, ref } from 'vue';

  const props = defineProps({
    detailReport: Object,
  });

  const showFullText = ref(false);
  const maxLength = 250;
  const truncatedText = computed(() => {
    const text = props.detailReport?.description;
    if (showFullText.value || text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  });

  const toggleText = () => {
    showFullText.value = !showFullText.value;
  };
</script>

<template>
  <div
    v-if="props.detailReport"
    class="flex p-3 border border-gray-dark rounded-md flex-col gap-y-4 w-full"
  >
    <!-- VIDEO -->
    <div v-if="props.detailReport?.videoUrl" class="relative w-full overflow-hidden rounded-lg">
      <iframe
        :src="`${props.detailReport?.videoUrl}&title=0&byline=0&portrait=0`"
        class="w-full aspect-video rounded-lg"
        frameborder="0"
        allow="autoplay; fullscreen"
      ></iframe>
    </div>
    <div v-if="!props.detailReport?.videoUrl" class="relative w-full overflow-hidden rounded-lg">
      <img
        :src="`${props.detailReport?.thumbnailUrl}`"
        class="w-full aspect-video rounded-lg"
        frameborder="0"
        allow="autoplay; fullscreen"
      />
    </div>

    <!-- CONTENT -->
    <div class="flex flex-col gap-y-3 px-3">
      <div class="text-lg font-semibold">{{ props.detailReport?.title }}</div>

      <!-- CHANNEL -->
      <div class="flex justify-between">
        <div class="flex items-center gap-x-3">
          <img
            :src="
              props.detailReport?.channel?.avatar || props.detailReport?.livestreamChannel?.avatar
            "
            alt=""
            class="size-10 rounded-full object-cover flex-shrink-0"
          />
          <div class="flex flex-col gap-y-0.5 mb-1">
            <h1 class="font-medium">
              {{
                props.detailReport?.channel?.channelName ||
                props.detailReport?.livestreamChannel?.channelName
              }}
            </h1>
            <div class="flex items-center gap-x-2 text-body">
              <span class="text-xs">{{ props.detailReport?.category.title }} </span>
              •
              <span class="text-xs"
                >{{
                  props.detailReport?.levelWorkout?.levelWorkout ||
                  props.detailReport?.livestreamLevelWorkout?.levelWorkout
                }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- DESCRIPTION -->
      <div class="p-3 bg-gray-light rounded-md">
        <div class="flex gap-x-4 text-xs font-semibold mb-3">
          <p>{{ props.detailReport?.viewCount || props.detailReport?.totalView }} views</p>
          <p>{{ formatDate(props.detailReport?.createdAt) }}</p>
        </div>
        <p class="text-xs">
          {{ truncatedText }}
        </p>
        <button
          v-if="props.detailReport?.description.length > maxLength"
          class="text-xs font-semibold cursor-pointer"
          @click="toggleText"
        >
          {{ showFullText ? 'Show Less' : 'Show More' }}
        </button>
      </div>
    </div>
  </div>
</template>
