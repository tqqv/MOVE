<script setup>
  import { onMounted, ref } from 'vue';
  import { fetchCountries } from '@services/address';
  import { getStateByCountry } from '@services/video';
  import { useRoute } from 'vue-router';
  import Skeleton from 'primevue/skeleton';

  const props = defineProps({
    countryStats: {
      type: Array,
      required: true,
    },
    totalViewer: {
      type: Number,
      required: true,
    },
    isLoading: {
      type: Boolean,
    },
  });

  const route = useRoute();
  const countries = ref([]);
  const national = ref([]);

  const isoCodes = ref({});
  const states = ref([]);
  const videoId = route.params.videoId;
  const showStates = ref(false);
  const selectedCountryIndex = ref(null);

  const loadCountries = async () => {
    try {
      countries.value = await fetchCountries();

      isoCodes.value = countries.value.reduce((acc, country) => {
        acc[country.name] = country.iso2;
        return acc;
      }, {});
    } catch (error) {
      console.error(error);
    }
  };
  const getStatesByCountry = async (country) => {
    const result = await getStateByCountry(videoId, country);
    states.value = result.data;
  };

  onMounted(() => {
    loadCountries();
  });
</script>

<template>
  <Skeleton v-if="isLoading" width="100%" height="200px" class="rounded-md"></Skeleton>

  <div v-else class="bg-white shadow-lg p-4 rounded-md text-black space-y-2 w-full">
    <span class="text-lg font-bold whitespace-nowrap">Most viewers by nationality</span>
    <div v-if="countryStats.length === 0">
      <p>No data available</p>
    </div>
    <div
      v-for="(stat, index) in countryStats"
      :key="index"
      class="flex items-center justify-between space-y-4"
    >
      <div class="flex gap-2">
        <div class="text-base">
          {{ isoCodes[stat.nationality] }}
        </div>
        <div :class="['text-base transition duration-200 ease-in-out']">
          {{ stat.nationality ? stat.nationality : 'Unknown' }}
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
</template>
