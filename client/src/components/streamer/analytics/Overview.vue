<script setup>
  import StatsCard from './StatsCard.vue';
  import rate from '@components/icons/rate.vue';

  const overviewStats = [
    { title: 'Total followers', value: 12040 },
    { title: 'Total REPs earned', value: 51206 },
  ];

  const liveSummaryStats = [
    { title: 'Total live views', value: 12040 },
    { title: 'Average view time', value: '10:34' },
  ];

  const videoSummaryStats = [
    { title: 'Total video views', value: 6160240 },
    { title: 'Average view time', value: '10:34' },
  ];
</script>

<template>
  <div class="container">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
      <div class="space-y-12">
        <!-- Overview Section -->
        <div>
          <span class="text-[22px] font-bold">Overview</span>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatsCard
              v-for="(stat, index) in overviewStats"
              :key="index"
              :title="stat.title"
              :value="stat.value"
            />
          </div>
        </div>

        <!-- Live Summary Section -->
        <div>
          <span class="text-[22px] font-bold">Live summary</span>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatsCard
              v-for="(stat, index) in liveSummaryStats"
              :key="index"
              :title="stat.title"
              :value="stat.value"
            />
          </div>
        </div>

        <!-- Video Summary Section -->
        <div>
          <span class="text-[22px] font-bold">Video summary</span>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatsCard
              v-for="(stat, index) in videoSummaryStats"
              :key="index"
              :title="stat.title"
              :value="stat.value"
            />
          </div>
        </div>
      </div>

      <!-- Latest Analytics Section -->
      <div>
        <div class="text-[22px] font-bold">Latest analytics</div>

        <!-- Latest Live Stream Card -->
        <div class="bg-white shadow-lg p-6 rounded-md space-y-6">
          <div class="text-[18px] font-bold">Latest live stream</div>
          <div>
            <div class="text-xs text-[#666666] uppercase">Title of live stream</div>
            <span class="text-[16px] font-bold">Lorem ipsum dolor sit amet, consetetur…</span>
          </div>
          <div>
            <div class="flex justify-between">
              <span class="text-base">Total views</span>
              <span class="text-base font-bold">15,519</span>
            </div>
            <div class="flex justify-between">
              <span class="text-base">Total REPs received</span>
              <span class="text-base font-bold">15,519 REPs</span>
            </div>
            <div class="flex justify-between">
              <span class="text-base">Ratings</span>
              <div class="flex items-center">
                <span class="text-base font-bold">4.5</span>
                <rate class="ml-1 mb-1" />
              </div>
            </div>
          </div>
          <div class="text-base text-primary">Go to live analytics</div>
        </div>

        <!-- Latest Video Card -->
        <div class="bg-white shadow-lg p-6 rounded-md mt-6 space-y-6">
          <span class="text-[18px] font-bold">Latest video</span>
          <div>
            <img
              src="https://scontent.fsgn5-6.fna.fbcdn.net/v/t1.6435-1/157961237_1328089080905245_5171334421315568845_n.jpg?stp=dst-jpg_s160x160&_nc_cat=108&ccb=1-7&_nc_sid=e4545e&_nc_eui2=AeF99CmdNvNFHeSE2X2oAF2bSiHTP0RPzcdKIdM_RE_Nx8FryIGP6oPYsu-I6EnZ7dnlIf60FJas0IwShb7FDy2G&_nc_ohc=R7o8ZaA7qe0Q7kNvgGhkJ2a&_nc_ht=scontent.fsgn5-6.fna&_nc_gid=AbguhOHWXnz-oDgDmc80nqY&oh=00_AYCgNpWVU1ViwiO7_54uJKtQ726owW3E4U9AY87TAc9t8A&oe=673740F0"
              class="rounded-lg object-cover w-full h-auto"
            />
          </div>

          <div class="text-base font-bold">Leg days</div>
          <div>
            <div class="flex justify-between">
              <span class="text-base">Total views</span>
              <span class="text-base font-bold">15,519</span>
            </div>
            <div class="flex justify-between">
              <span class="text-base">Total REPs received</span>
              <span class="text-base font-bold">15,519 REPs</span>
            </div>
            <div class="flex justify-between">
              <span class="text-base">Ratings</span>
              <div class="flex items-center">
                <span class="text-base font-bold">4.5</span>
                <rate class="ml-1 mb-1" />
              </div>
            </div>
          </div>
          <div class="text-base text-primary">Go to video analytics</div>
        </div>
      </div>
    </div>
  </div>
</template>
