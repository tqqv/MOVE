<script setup>
  import { Carousel3d, Slide } from 'vue3-carousel-3d';
  import Verified from '@/components/icons/verified.vue';
  import rate from '@/components/icons/rate.vue';

  const slides = [
    {
      title: 'Slide 1',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim, maxime.',
      src: 'https://i.vimeocdn.com/video/1934120704-45f5c080171ac5d483f2851efb3e6461558d986cedef686c5997fe82f5e173bf-d',
    },
    {
      title: 'Slide 2',
      desc: 'Lorem ipsum dolor sit amet ',
      src: 'https://i.vimeocdn.com/video/1934120704-45f5c080171ac5d483f2851efb3e6461558d986cedef686c5997fe82f5e173bf-d',
    },
    {
      title: 'Slide 3',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. ',
      src: 'https://i.vimeocdn.com/video/1934120704-45f5c080171ac5d483f2851efb3e6461558d986cedef686c5997fe82f5e173bf-d',
    },
    {
      title: 'Slide 4',
      desc: 'Lorem ipsum dolor sit amet,  Enim, maxime.',
      src: 'https://i.vimeocdn.com/video/1934120704-45f5c080171ac5d483f2851efb3e6461558d986cedef686c5997fe82f5e173bf-d',
    },
  ];
</script>
<template>
  <div class="box rounded-lg">
    <carousel-3d
      height="300"
      width="1100"
      controlsVisible="true"
      autoplay="true"
      autoplayTimeout="5000"
    >
      <slide v-for="(slide, i) in slides" :index="i" :key="i">
        <div>
          <div class="flex bg-white shadow-lg overflow-hidden">
            <div class="w-3/4">
              <img :src="slide.src" alt="Live Session" class="h-[300px] object-cover relative" />
              <span
                class="absolute top-0 left-0 m-2 bg-red text-white text-xs font-bold px-2 py-1 rounded"
                >LIVE</span
              >
              <div
                class="text-xs absolute bottom-0 left-0 m-2 flex items-center font-bold text-white bg-black p-1 rounded"
              >
                <i class="pi pi-eye mr-1 text-xs" />
                <span>10.3k</span>
              </div>
            </div>
            <div class="flex flex-col p-6">
              <div class="flex items-center space-x-2">
                <div class="size-2 bg-red rounded-full"></div>
                <h3 class="font-bold text-lg">Currently live</h3>
              </div>
              <div class="flex items-center space-x-4">
                <div class="relative inline-block">
                  <div class="flex items-center justify-center size-12 rounded-full">
                    <img
                      src="https://scontent.fdad1-1.fna.fbcdn.net/v/t1.15752-9/462543007_1111006893774896_2954163955152981771_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeFalsOzXd2jMhr0yBWIjG9pI7u5rlHYVQoju7muUdhVCmPkvy4nhcMMtIj0WBej_cm_mU1caftNz2flc2zbldGi&_nc_ohc=cvM8w6K_I5MQ7kNvgFmJdaI&_nc_ht=scontent.fdad1-1.fna&_nc_gid=AxnST4B8sbc8bcrZMWDW8b9&oh=03_Q7cD1QFRAzlyWeAEtxoJ0dx9tfFKvPcoUwoeRuTdUaweElh09A&oe=67345510"
                      alt="Avatar"
                      class="w-full h-full rounded-full object-cover p-[1.5px]"
                    />
                  </div>
                </div>
                <div class="flex flex-col justify-center">
                  <div class="flex items-center">
                    <p class="text-[20px] flex items-center">
                      <span class="mr-2"> thehoangTv </span>
                      <Verified class="ml-1 mb-1 mr-2 fill-blue" />
                    </p>
                  </div>
                  <div>
                    <p class="text-[14px] text-body">Just Move</p>
                  </div>
                  <div class="flex items-center mt-2">
                    <rate class="mr-1 mb-1" />
                    <span class="text-sm font-bold">4.5</span>
                  </div>
                </div>
              </div>
              <div class="flex gap-2 items-center text-[10px] font-bold my-4">
                <span class="bg-[#EEEEEE] rounded-full text-black p-2">Beginner</span>
                <span class="bg-[#EEEEEE] rounded-full text-black p-2">< 30 mins></span>
              </div>
              <div>
                <span class="text-[14px] text-body"
                  >Lorem ipsum dolor sit amet, consetetur sadipscing elitr.</span
                >
              </div>
            </div>
          </div>
        </div>
      </slide>
    </carousel-3d>
  </div>
</template>
<style scoped>
  .carousel-3d-container {
    border-radius: 16px;
    border: none;
  }

  .carousel-3d-slide {
    border-radius: 16px;
    border: none;
    box-shadow: 0 4px 8px rgba(255, 251, 251, 0.1);
  }
</style>
