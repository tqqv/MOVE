<script setup>
  import Clapper from '@/components/icons/clapper.vue';
  import Clock from '@/components/icons/clock.vue';
  import LiveStream from '@/components/icons/liveStream.vue';
  import InformationLiveStream from './InformationLiveStream.vue';
  import TopDonates from './TopDonates.vue';
  var currentdate = new Date();
</script>
<template>
  <div class="px-10 flex items-center flex-col">
    <div class="w-full flex justify-center">
      <div
        class="flex flex-col max-w-[1028px] min-w-[800px] basis-full justify-center rounded-lg shadow-md bg-white mb-6 overflow-hidden"
      >
        <div class="flex w-full p-4">
          <div class="relative bg-black h-[230px] rounded-md w-full">
            <div
              class="flex justify-center items-center h-full flex-col gap-y-3 text-white text-center"
            >
              <Clapper fill="white" />
              <h1 class="text-lg font-semibold my-2">Your live video has ended</h1>
              <p class="text-sm">
                Your livestream has ended. You can see the live stream information below.
              </p>
            </div>
          </div>
        </div>
        <!-- SCREEN CONNECT OBCS -->
      </div>
    </div>
    <!-- LEFT -->
    <div class="w-full flex gap-x-3 justify-center">
      <div
        class="flex flex-col max-w-[500px] self-start basis-1/2 p-4 bg-white rounded-lg shadow-md w-fit"
      >
        <h1 class="font-semibold mb-4">Information live stream</h1>
        <div class="flex items-center gap-x-4">
          <Clock width="15px" />
          <h1 class="text-xs text-footer font-medium">
            October 17, 6:16 PM - October 17, 6:17 PM (UTC+8)
          </h1>
        </div>
        <div class="flex flex-col gap-y-3 mt-4 text-sm">
          <div class="flex gap-x-4">
            <label class="font-medium" for="">Title:</label>
            <h1>Hello anh em</h1>
          </div>
          <div class="flex gap-x-4 text sm">
            <label class="font-medium" for="">Description:</label>
            <h1>
              - Shop Khô Gà Thầy Giáo Ba: https://shopee.vn/thaygiaoba_1107- Bánh Tằm Thầy Ba:CS 1:
              342 Tên Lửa Phường Bình Trị Đông B, Quận Bình Tân TPHCM.Page:
              https://www.facebook.com/BanhTamThayBaWebsite: https://banhtamthayba.comShopeeFood:
              https://s.net.vn/244NGrabFood: https://s.net.vn/m18b- Contact Công Việc:Page:
              https://www.facebook.com/BaRoiBe0Mail: BaRoiBeoKols1989@gmail.com.
            </h1>
          </div>
          <div class="flex gap-x-4">
            <label class="font-medium" for="">Category:</label>
            <h1>MMA</h1>
          </div>
          <div class="flex gap-x-4">
            <label class="font-medium" for="">Level workout:</label>
            <h1>Beginner</h1>
          </div>
        </div>
        <hr class="h-px bg-gray-dark border-0 my-7" />
        <div class="grid grid-cols-2 gap-y-8 gap-x-16 mb-7 items-start ml-7">
          <InformationLiveStream />
        </div>
      </div>
      <!-- RIGHT -->
      <div
        class="flex flex-col max-w-[500px] self-start basis-1/2 p-4 bg-white rounded-lg shadow-md w-fit"
      >
        <h1 class="font-semibold mb-4">Top donates</h1>
        <div class="flex flex-col gap-y-4">
          <TopDonates />
        </div>
      </div>
    </div>
  </div>
</template>
