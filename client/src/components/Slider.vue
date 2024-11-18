<script setup>
  import { ref } from 'vue';

  import { Carousel3d, Slide } from 'vue3-carousel-3d';
  import Verified from '@/components/icons/verified.vue';
  import rate from '@/components/icons/rate.vue';
  import { formatRating, truncateDescripton, genreDuration, formatView } from '@/utils';
  const props = defineProps({
    dataSlider: {
      type: Array,
      default: true,
    },
  });
</script>
<template>
  <div class="box rounded-lg">
    <carousel-3d
      height="300"
      width="800"
      controlsVisible="true"
      border="0"
      space="300"
      :on-slide-change="handleSlideChanged"
    >
      <slide v-for="(slide, i) in dataSlider" :index="i" :key="i">
        <figure>
          <div class="flex bg-white shadow-lg overflow-hidden h-[300px]">
            <!-- Cột hình ảnh -->

            <div class="thumbnail h-full w-full rounded-lg">
              <RouterLink
                :to="
                  slide.livestream
                    ? `/live/${slide.livestream.livestreamChannel.User.username}`
                    : `/video/${slide.videoId}`
                "
                :key="slide.id"
              >
                <img
                  :src="slide.livestream?.thumbnailUrl || slide.video?.thumbnailUrl"
                  alt="Live Session"
                  class="w-full object-contain relative transition-all duration-300 shadow-lg"
              /></RouterLink>
              <span
                v-if="slide.livestream !== null"
                class="absolute top-0 left-0 m-2 bg-red text-white text-xs font-bold px-2 py-1 rounded"
                >LIVE</span
              >
              <div
                v-if="slide.livestream !== null"
                class="text-sm absolute bottom-0 left-0 m-2 flex items-center font-bold text-white bg-black p-1 rounded"
              >
                <i class="pi pi-eye mr-1 text-xs" />
                <span>{{ formatView(slide.currentViews) }}</span>
              </div>
            </div>
            <!-- Cột thông tin -->

            <div
              v-show="!isImageFull"
              class="info flex-col p-6 w-1/3 h-full justify-between hidden xl:block"
            >
              <div
                v-if="slide.livestream?.livestreamChannel.isLive"
                class="flex items-center space-x-2"
              >
                <div class="size-2 bg-red rounded-full"></div>
                <h3 class="font-bold text-lg">Currently live</h3>
              </div>
              <div class="flex items-center space-x-4">
                <div class="relative inline-block">
                  <div class="flex items-center justify-center size-16 rounded-full flex-shrink-0">
                    <img
                      :src="
                        slide.video?.channel.avatar || slide.livestream?.livestreamChannel.avatar
                      "
                      alt="Avatar"
                      class="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
                <div class="flex flex-col justify-center">
                  <div class="flex items-center">
                    <p class="text-[20px] flex items-center">
                      <span class="mr-2">
                        {{
                          slide.video?.channel.channelName ||
                          slide.livestream?.livestreamChannel.channelName
                        }}
                      </span>
                      <Verified class="ml-1 mb-1 mr-2 fill-blue" />
                    </p>
                  </div>
                  <div>
                    <p class="text-[14px] text-body">
                      {{ slide.video?.category.title }}
                    </p>
                  </div>
                  <div class="flex items-center mt-2">
                    <rate class="mr-1" />
                    <span class="text-sm font-bold">{{
                      formatRating(slide.video?.averageRating || slide.livestream?.ratings)
                    }}</span>
                  </div>
                </div>
              </div>
              <div class="flex gap-2 items-center text-[10px] font-bold my-4">
                <span class="bg-[#EEEEEE] rounded-full text-black p-2">{{
                  slide.video?.levelWorkout.levelWorkout ||
                  slide.livestream?.livestreamLevelWorkout.levelWorkout
                }}</span>
                <span class="bg-[#EEEEEE] rounded-full text-black p-2">
                  {{ genreDuration(slide.video?.duration) || slide.livestream?.category.title }}
                </span>
              </div>
              <div>
                <span class="text-[14px] text-body break-words">
                  {{
                    truncateDescripton(
                      slide.video?.description || slide.livestream?.description,
                      100,
                    )
                  }}
                </span>
              </div>
            </div>
          </div>
        </figure>
      </slide>
    </carousel-3d>
  </div>
</template>
<style>
  .carousel-3d-container {
    border-radius: 16px;
    border: none;
  }

  .carousel-3d-slide {
    border-radius: 16px;
    border: none;
    box-shadow: 0 4px 8px rgba(255, 251, 251, 0.1);
  }
  .carousel-3d-controls {
    size: 1px;
  }
  .next span,
  .prev span {
    color: #13d0b4;
  }
</style>
