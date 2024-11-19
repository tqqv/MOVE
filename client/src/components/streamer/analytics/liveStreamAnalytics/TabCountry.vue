<script setup>
  import { watch, ref } from 'vue';
  import { getStateFromIP } from '@services/liveStream';
  import { useRoute } from 'vue-router';

  const props = defineProps({
    dataByIp: {
      type: Array,
    },
    totalViewer: {
      type: Number,
    },
    liveStreamId: String,
  });

  const isoCodes = ref({});
  const states = ref([]);
  const showStates = ref(false);
  const selectedCountryIndex = ref(null);

  const fetchStatesFromIP = async (country) => {
    try {
      const result = await getStateFromIP(props.liveStreamId, country);
      if (result.status == 200) {
        states.value = result.data.data;
      }
    } catch (error) {
      console.error('Failed to fetch state data:', error);
      states.value = [];
    }
  };

  const toggleCountry = async (index) => {
    selectedCountryIndex.value = index;

    const selectedCountry = props.dataByIp[index].country;

    await fetchStatesFromIP(selectedCountry);
    showStates.value = true;
  };

  const goBackToCountries = () => {
    showStates.value = false;
    selectedCountryIndex.value = null;
  };
  watch(
    () => props.liveStreamId,
    async (newLiveStreamId, oldLiveStreamId) => {
      if (newLiveStreamId && newLiveStreamId !== oldLiveStreamId) {
        states.value = [];
        showStates.value = false;
        selectedCountryIndex.value = null;
      }
    },
    { immediate: true },
  );
</script>

<template>
  <div v-if="!showStates" class="bg-white shadow-lg p-4 rounded-md text-black space-y-2 w-1/2">
    <span class="text-lg font-bold whitespace-nowrap">Most viewers by country</span>
    <div v-if="!dataByIp || dataByIp.length === 0">
      <p>No data available</p>
    </div>

    <div
      v-for="(stat, index) in dataByIp"
      :key="index"
      class="flex items-center justify-between space-y-4"
    >
      <div class="flex gap-2">
        <div class="text-base">{{ isoCodes[stat.country] }}</div>
        <div
          class="text-base cursor-pointer transition duration-200 ease-in-out hover:underline hover:text-primary"
          @click="toggleCountry(index)"
        >
          {{ stat.country }}
        </div>
      </div>
      <div class="flex flex-col items-start">
        <div class="flex items-center">
          <div class="text-base font-bold">{{ stat.viewerCount }}</div>
          <div class="ml-2 w-16 text-right">
            ({{ ((stat.viewerCount / totalViewer) * 100).toFixed(2) }}%)
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="bg-white shadow-lg p-6 rounded-md text-black space-y-2 w-1/2">
    <div class="space-y-4">
      <div
        @click="goBackToCountries"
        class="flex items-center space-x-1 text-primary cursor-pointer"
      >
        <i class="pi pi-angle-left pt-[1px]" />
        <span>Back to countries</span>
      </div>
      <div class="text-lg font-bold whitespace-nowrap flex items-center gap-2">
        <span>{{ dataByIp[selectedCountryIndex].country }}</span>
        <span>({{ dataByIp[selectedCountryIndex].viewerCount }})</span>
      </div>
      <div v-for="state in states" :key="state" class="flex items-center justify-between">
        <div class="text-base cursor-pointer">{{ state.city }}</div>
        <div class="flex items-center space-x-2">
          <div class="text-base font-bold">{{ state.viewerCount }}</div>
          <div class="ml-2 w-16 text-right">
            ({{ ((state.viewerCount / totalViewer) * 100).toFixed(2) }}%)
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
