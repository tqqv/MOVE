<script setup>
  import { formatDatePosted } from '@/utils';
  import MedalBronze from '../icons/medalBronze.vue';
  import MedalGold from '../icons/medalGold.vue';
  import MedalSilver from '../icons/medalSilver.vue';
  import { ref, watch } from 'vue';
  import REPs5 from '../icons/REPsItems/REPs5.vue';
  import REPs4 from '../icons/REPsItems/REPs4.vue';
  import REPs3 from '../icons/REPsItems/REPs3.vue';


  const props = defineProps({
    isStreamer: Boolean,
    topDonators: {
      type: Array,
      default: () => [],
    },
  });
  const today = new Date();
  const isListVisible = ref(false);
  const handleVisibleList = () => {
    isListVisible.value = !isListVisible.value;
  };
</script>

<template>
  <!-- not shown yet -->
  <div class="">
    <div
      class="flex flex-col justify-center gap-y-2 border-2 border-gray-dark border-r-0 border-t-0"
      :class="{ 'border-x-0': isStreamer }"
    >
      <!-- SHOW TOP 3 -->
      <div class="donation-ticker flex gap-x-4 pt-4 overflow-hidden" v-if="!isListVisible">
        <ul>
          <li
            v-for="(user, index) in topDonators.slice(0, 3)"
            :key="index"
            class="flex justify-center items-center gap-x-2 item-donate w-full"
          >
            <component
              :is="index === 0 ? MedalGold : index === 1 ? MedalSilver : MedalBronze"
              width="26px"
            />
            <p class="font-semibold text-sm truncate min-w-12">{{ user.donatorName }}</p>
            <p
              class="text-xs font-medium"
              :class="[
                index === 0 ? 'text-yellow-dark' : index === 1 ? 'text-blue' : 'text-purple',
              ]"
            >
              {{ user.totalReps }}
            </p>
          </li>
        </ul>

        <ul aria-hidden="true">
          <li
            v-for="(user, index) in topDonators.slice(0, 3)"
            :key="'duplicate-' + index"
            class="flex justify-center items-center gap-x-2 item-donate w-full"
          >
            <component
              :is="index === 0 ? MedalGold : index === 1 ? MedalSilver : MedalBronze"
              width="26px"
            />
            <p class="font-semibold text-sm truncate">{{ user.donatorName }}</p>
            <p
              class="text-xs mt-[1px] font-medium"
              :class="[
                index === 0 ? 'text-yellow-dark' : index === 1 ? 'text-blue' : 'text-purple',
              ]"
            >
              {{ user.totalReps }}
            </p>
          </li>
        </ul>
      </div>
      <!-- SHOW 10 DONATOR -->
      <div class="flex flex-col" v-if="isListVisible">
        <div
          class="flex justify-center items-center flex-col gap-y-1 py-3 border-b border-gray-dark"
        >
          <p class="font-semibold text-primary text-sm">Top {{ topDonators.length }} Donors</p>
          <p class="text-[10px] font-medium">in {{ formatDatePosted(today) }}</p>
        </div>
        <div class="py-2">
          <div
            v-for="(user, index) in topDonators"
            :key="index"
            class="flex justify-between gap-x-5 px-2 py-1 text-sm"
          >
            <div class="flex items-center justify-center gap-x-3 truncate">
              <div v-if="index === 0">
                <MedalGold width="26px" />
              </div>
              <div v-else-if="index === 1">
                <MedalSilver width="26px" />
              </div>
              <div v-else-if="index === 2">
                <MedalBronze width="26px" />
              </div>
              <div
                v-else
                class="flex justify-center items-center size-[20px] rounded-full bg-primary/60 ml-[4.2px] mr-[2.1px] flex-shrink-0"
              >
                <span class="font-medium text-sm text-black">{{ index + 1 }}</span>
              </div>
              <img
                :src="user.avatar"
                alt="profile picture"
                class="size-6 object-cover rounded-full flex-shrink-0"
              />
              <h2 class="truncate font-semibold">{{ user.donatorName }}</h2>
            </div>
            <div class="flex items-center">
              <div>
                <REPs5 v-if="index === 0 || index === 1 || index === 2" />
                <REPs4 v-else />
              </div>
              <p
                class="font-medium"
                :class="
                  index === 0 || index === 1 || index === 2 ? 'text-yellow-dark' : 'text-blue'
                "
              >
                {{ user.totalReps }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex justify-center items-center py-1.5 border-gray-dark hover:bg-primary/30 shadow-2xl cursor-pointer"
        @click="handleVisibleList"
      >
        <div class="h-1 w-1/4 bg-primary rounded-md"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .donation-ticker ul {
    list-style: none;
    flex-shrink: 0;
    min-width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 22px;
    animation: scroll 18s linear infinite;
  }

  .donation-ticker:hover ul {
    animation-play-state: paused;
  }

  @keyframes scroll {
    to {
      transform: translateX(calc(-100% - 20px));
    }
  }
</style>
