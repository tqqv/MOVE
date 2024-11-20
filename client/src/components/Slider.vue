<script setup>
  import { ref, watch } from 'vue';
  import LiveStreamScreen from '@/components/LiveStreamScreen.vue';

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

  const currentSlide = ref(0);
  const isThumbnailVisible = ref(true);
  const isInfoVisible = ref(true);

  const handleSlideChanged = (newIndex) => {
    currentSlide.value = newIndex;
    isThumbnailVisible.value = false;
    isInfoVisible.value = false;
    setTimeout(() => {
      isInfoVisible.value = true;
    }, 300);
  };
</script>
<template>
  <carousel-3d
    :perspective="5"
    :space="300"
    height="350"
    width="950"
    controlsVisible="true"
    :startIndex="currentSlide"
    :on-slide-change="handleSlideChanged"
    border="0"
  >
    <slide v-for="(slide, i) in dataSlider" :index="i" :key="i">
      <figure>
        <div class="relative flex bg-white shadow-lg overflow-hidden h-[350px]">
          <!-- Cột hình ảnh -->

          <div
            class="h-full w-full rounded-md relative transition-all duration-500"
            :class="{ 'w-2/3': currentSlide === i }"
          >
            <RouterLink
              :to="
                currentSlide === i
                  ? slide.livestream
                    ? `/live/${slide.livestream.livestreamChannel.User.username}`
                    : `/video/${slide.videoId}`
                  : null
              "
              :key="slide.id"
            >
              <LiveStreamScreen
                v-if="slide.livestream && currentSlide === i"
                :username="slide.livestream?.livestreamChannel.User.username"
                :isSlider="true"
              />

              <img
                v-else
                :src="slide.livestream?.thumbnailUrl || slide.video?.thumbnailUrl"
                alt="Thumbnail"
                class="w-full h-full object-cover border-none opacity-90"
                :class="{ visible: currentSlide === i }"
              />
            </RouterLink>

            <div
              v-if="slide.livestream !== null"
              class="text-sm absolute bottom-0 left-0 m-2 flex items-center font-bold text-white bg-black p-1 rounded"
            >
              <i class="pi pi-eye mr-1 text-xs" />
              <span>{{ formatView(slide.currentViews) }}</span>
            </div>
          </div>

          <!-- Cột thông tin với transition -->
          <transition name="info-transition">
            <div
              v-if="isInfoVisible && currentSlide === i"
              class="flex-col p-6 w-1/3 h-full justify-between hidden xl:block shadow-lg border-2 border-l-0 border-[#f2f1f1] rounded-r-[16px]"
            >
              <div
                v-if="slide.livestream?.livestreamChannel.isLive"
                class="flex items-center space-x-2 pb-2"
              >
                <div class="size-2 bg-red rounded-full"></div>
                <h3 class="font-bold text-lg">Currently live</h3>
              </div>
              <div class="flex items-center space-x-4">
                <!-- AVATAR -->
                <div class="relative inline-block">
                  <div class="flex items-center justify-center size-14 rounded-full flex-shrink-0">
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
                  <!-- CHANNEL NAME -->
                  <div class="flex items-center pt-2">
                    <p class="text-[18px] flex items-center">
                      <span class="mr-2">
                        {{
                          slide.video?.channel.channelName ||
                          slide.livestream?.livestreamChannel.channelName
                        }}
                      </span>
                      <Verified class="fill-blue" />
                    </p>
                  </div>
                  <div>
                    <p class="text-[14px] text-body">{{ slide.video?.category.title }}</p>
                  </div>
                  <div class="flex items-center mt-2">
                    <rate class="mr-1" />
                    <span class="text-sm font-bold">
                      {{ formatRating(slide.video?.averageRating || slide.livestream?.ratings) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex gap-2 items-center text-[10px] font-bold my-4">
                <span class="bg-[#EEEEEE] rounded-full text-black p-2">
                  {{
                    slide.video?.levelWorkout.levelWorkout ||
                    slide.livestream?.livestreamLevelWorkout.levelWorkout
                  }}
                </span>
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
          </transition>
        </div>
      </figure>
    </slide>
  </carousel-3d>
</template>
<style>
  .carousel-3d-container {
    border-radius: 16px;
  }

  .carousel-3d-slide {
    border-radius: 16px;
    border: none;
    box-shadow: 0 4px 8px rgba(255, 251, 251, 0.1);
  }

  .next span,
  .prev span {
    color: #13d0b4;
  }

  /* Transition cho cột thông tin */
  .info-transition-enter-active,
  .info-transition-leave-active {
    transition: opacity 0.5s ease-in-out;
  }
  .info-transition-enter,
  .info-transition-leave-to {
    opacity: 0;
  }
</style>
