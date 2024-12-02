<script setup>
  import Earning from '@/components/icons/earning.vue';
  import GoLive from '@/components/icons/goLive.vue';
  import Live from '@/components/icons/live.vue';
  import Sales from '@/components/icons/sales.vue';
  import Stream from '@/components/icons/Stream.vue';
  import User from '@/components/icons/user.vue';
  import Videos from '@/components/icons/videos.vue';
  import Wallet from '@/components/icons/wallet.vue';
  import ChartIncome from './ChartIncome.vue';
  import ChartUser from './ChartUser.vue';
  import TopChannel from './TopChannel.vue';
  import TopVideo from './TopVideo.vue';
</script>

<template>
  <section class="lg:px-14">
    <div class="container">
      <!-- INFOR -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- USER -->
        <div class="bg-white flex flex-col shadow p-5 rounded-lg py-7">
          <div class="flex items-center gap-x-5">
            <div
              class="rounded-full bg-primary size-[50px] flex justify-center items-center flex-shrink-0"
            >
              <User width="22" height="22" />
            </div>
            <div>
              <h1 class="font-bold text-[20px]">320</h1>
              <h1 class="text-footer text-sm font-medium">Total User</h1>
            </div>
          </div>
        </div>
        <!-- VIDEO -->
        <div class="bg-white flex flex-col shadow p-5 rounded-lg py-7">
          <div class="flex items-center gap-x-5">
            <div
              class="rounded-full bg-primary size-[50px] flex justify-center items-center flex-shrink-0"
            >
              <Videos />
            </div>
            <div>
              <h1 class="font-bold text-[20px]">20</h1>
              <h1 class="text-footer text-sm font-medium">Total Video</h1>
            </div>
          </div>
        </div>
        <!-- LIVE STREAM -->
        <div class="bg-white flex flex-col shadow p-5 rounded-lg py-7 h-full">
          <div class="flex items-center gap-x-5">
            <div
              class="rounded-full bg-primary size-[50px] flex justify-center items-center flex-shrink-0"
            >
              <Stream width="42" height="42" />
            </div>
            <div>
              <h1 class="font-bold text-[20px]">10</h1>
              <h1 class="text-footer text-sm font-medium">Total live stream</h1>
            </div>
          </div>
        </div>
        <!-- Earnings  -->
        <div class="bg-white flex flex-col shadow p-5 rounded-lg py-7">
          <div class="flex items-center gap-x-5">
            <div
              class="rounded-full bg-primary size-[50px] flex justify-center items-center flex-shrink-0"
            >
              <Wallet fill="#ffffff" />
            </div>
            <div class="truncate">
              <h1 class="font-bold text-[20px] truncate">$10,000</h1>
              <h1 class="text-footer text-sm font-medium">Earnings</h1>
            </div>
          </div>
        </div>
        <!-- Spend  -->
        <div class="bg-white flex flex-col shadow p-5 rounded-lg py-7">
          <div class="flex items-center gap-x-5">
            <div
              class="rounded-full bg-primary size-[50px] flex justify-center items-center flex-shrink-0"
            >
              <Sales />
            </div>
            <div class="truncate">
              <h1 class="font-bold text-[20px] truncate">$12,200</h1>
              <h1 class="text-footer text-sm font-medium">Spend</h1>
            </div>
          </div>
        </div>
        <!-- Sales  -->
        <div class="bg-white flex justify-between shadow p-5 rounded-lg gap-x-3 py-7">
          <div class="flex items-center gap-x-5">
            <div
              class="rounded-full bg-primary size-[50px] flex justify-center items-center flex-shrink-0"
            >
              <Earning />
            </div>
            <div class="truncate">
              <h1 class="font-bold text-[20px]">$574.34</h1>
              <h1 class="text-footer text-sm font-medium">Revenue</h1>
            </div>
          </div>
          <div class="flex gap-x-1 text-sm font-medium truncate mt-1.5">
            <span class="text-green font-bold">+23%</span>
            <span class="text-footer truncate">since last month</span>
          </div>
        </div>
      </div>
      <!-- CHART -->
      <div class="grid grid-cols-12 gap-4 mt-5">
        <div class="col-span-7 bg-white p-5 rounded shadow">
          <ChartIncome />
        </div>
        <div class="col-span-5 bg-white p-5 rounded shadow"><ChartUser /></div>
      </div>
      <!-- TOP USER -->
      <div class="grid grid-cols-12 gap-4 mt-5">
        <TopChannel />
      </div>
      <!-- TOP VIDEO/ LIVE -->
      <div class="flex my-4 flex-col gap-y-5">
        <TopVideo />
      </div>
    </div>
  </section>
</template>
