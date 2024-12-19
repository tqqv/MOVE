<script setup>
  import { ref, onMounted, watch } from 'vue';
  import LiveStreamScreen from '@/components/LiveStreamScreen.vue';
  import Skeleton from 'primevue/skeleton';
  import { Carousel3d, Slide } from 'vue3-carousel-3d';
  import Verified from '@/components/icons/verified.vue';
  import rate from '@/components/icons/rate.vue';
  import { formatRating, truncateDescripton, genreDuration } from '@/utils';
  import { postClickFeatured } from '@/services/bookingFeaturedContent';
  const props = defineProps({
    dataSlider: {
      type: Array,
      default: true,
    },
    isLoadingSlider: {
      type: Boolean,
      required: true,
    },
  });

  const currentSlide = ref(0);
  const isInfoVisible = ref(true);

  const handleSlideChanged = (newIndex) => {
    currentSlide.value = newIndex;
    isInfoVisible.value = false;

    setTimeout(() => {
      isInfoVisible.value = true;
    }, 300);
  };
  const postClick = async (featuredContentId) => {
    const data = { featuredContentId };
    try {
      const response = await postClickFeatured(data);
      console.log();
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  };
</script>
<template>
  <div v-if="isLoadingSlider" class="flex bg-white shadow-lg overflow-hidden h-[350px]">
    <Skeleton width="100%" height="100%" />
    <div
      class="flex-col p-6 w-[30%] h-full justify-between hidden xl:block shadow-lg border-2 border-l-0 border-[#f2f1f1] rounded-r-[16px]"
    >
      <div class="flex items-center space-x-4">
        <div class="relative inline-block">
          <div class="flex items-center justify-center size-14 rounded-full flex-shrink-0">
            <Skeleton shape="circle" size="3.5rem" />
          </div>
        </div>
        <div class="flex flex-col justify-center">
          <div class="flex items-center pt-2">
            <Skeleton width="6rem" class="mb-2" />
          </div>
          <Skeleton width="3rem" class="mb-2" />
          <Skeleton width="3rem" class="mb-2" />
        </div>
      </div>
      <div class="flex gap-2 items-center text-[10px] font-bold my-4">
        <Skeleton width="4rem" height="2rem" borderRadius="9999px" />
        <Skeleton width="4rem" height="2rem" borderRadius="9999px" />
      </div>
      <div>
        <Skeleton width="14rem" height="4rem" />
      </div>
    </div>
  </div>
  <carousel-3d
    :perspective="5"
    :space="300"
    height="350"
    width="1000"
    :controlsVisible="true"
    :startIndex="currentSlide"
    :on-slide-change="handleSlideChanged"
    border="0"
    v-else-if="dataSlider && !isLoadingSlider"
  >
    <Slide v-for="(slide, i) in dataSlider" :index="i" :key="i">
      <figure>
        <div class="flex bg-white shadow-lg h-[350px]">
          <!-- Cột hình ảnh -->
          <div
            class="h-full w-full rounded-md relative transition-all duration-500"
            :class="{ 'w-[75%]': currentSlide === i }"
          >
            <RouterLink
              :to="
                currentSlide === i
                  ? slide.channelBooking
                    ? `/live/${slide?.channelBooking.User.username}`
                    : `/video/${slide.video.id}`
                  : ''
              "
              :key="slide.id"
              @click="currentSlide === i && slide.id && postClick(slide?.id)"
            >
              <LiveStreamScreen
                isSlider="true"
                v-if="slide.channelBooking && currentSlide === i"
                :username="slide?.channelBooking.User.username"
              />

              <img
                v-else
                :src="
                  slide.channelBooking?.channelLivestreams[0].thumbnailUrl ||
                  slide.video?.thumbnailUrl
                "
                alt="Thumbnail"
                class="w-full h-full object-cover"
              />
            </RouterLink>
          </div>

          <!-- Cột thông tin với transition -->
          <div
            v-show="isInfoVisible && currentSlide === i"
            class="flex-col p-6 w-[35%] h-full justify-between hidden xl:block shadow-lg border-2 border-l-0 border-[#f2f1f1] rounded-r-[16px]"
          >
            <div v-if="slide.channelBooking" class="flex items-center space-x-2 pb-2">
              <div class="size-2 bg-red rounded-full"></div>
              <h3 class="font-bold text-lg">Currently live</h3>
            </div>
            <div class="flex items-center space-x-4">
              <!-- AVATAR -->
              <div class="relative inline-block">
                <RouterLink :to="`/user/${slide.video.channel.User.username}`">
                  <div class="flex items-center justify-center size-14 rounded-full flex-shrink-0">
                    <img
                      :src="slide.video?.channel.avatar || slide?.channelBooking.avatar"
                      alt="Avatar"
                      class="w-full h-full rounded-full object-cover"
                    /></div
                ></RouterLink>
              </div>
              <div class="flex flex-col justify-center">
                <!-- CHANNEL NAME -->
                <div class="flex items-center pt-2">
                  <p class="text-[18px] flex items-center whitespace-nowrap">
                    <RouterLink
                      :to="`/user/${slide.video.channel.User.username}`"
                      class="truncate w-[150px]"
                      :title="slide.video.channel.User.username"
                    >
                      <span class="mr-2">
                        {{ slide.video?.channel.channelName || slide?.channelBooking.channelName }}
                      </span>
                    </RouterLink>
                    <Verified class="fill-blue" />
                  </p>
                </div>
              </div>
            </div>
            <div class="flex gap-x-2 items-center pt-4">
              <div class="w-[200px] items-center">
                <p
                  :title="slide?.channelBooking?.channelLivestreams[0].title || slide.video?.title"
                  class="text-[14px] text-body truncate"
                >
                  {{ slide?.channelBooking?.channelLivestreams[0]?.title || slide.video?.title }}
                </p>
              </div>

              <div class="flex items-center">
                <rate class="mr-1" />
                <span class="text-sm font-bold">
                  {{
                    formatRating(
                      slide.channelBooking?.channelLivestreams[0].ratings ||
                        slide.video?.channel.averageRating,
                    )
                  }}
                </span>
              </div>
            </div>
            <div class="flex gap-2 items-center text-[10px] font-bold my-4">
              <span class="bg-[#EEEEEE] rounded-full text-black p-2">
                {{
                  slide.channelBooking?.channelLivestreams[0].livestreamLevelWorkout.levelWorkout ||
                  slide.video?.levelWorkout.levelWorkout
                }}
              </span>

              <span class="bg-[#EEEEEE] rounded-full text-black p-2">
                {{
                  slide.channelBooking?.channelLivestreams[0].category.title ||
                  slide.video?.category.title
                }}
              </span>
            </div>

            <div
              class="w-full"
              :title="
                slide.channelBooking?.channelLivestreams[0].description || slide.video?.description
              "
            >
              <span class="text-[14px] text-body overflow-hidden text-ellipsis text-wrap">
                {{
                  truncateDescripton(
                    slide.channelBooking?.channelLivestreams[0].description ||
                      slide.video?.description,
                    180,
                  )
                }}
              </span>
            </div>
          </div>
        </div>
      </figure>
    </Slide>
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
</style>
