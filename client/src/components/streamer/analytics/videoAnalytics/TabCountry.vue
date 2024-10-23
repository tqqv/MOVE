<script setup>
  import { onMounted, ref } from 'vue';
  import { fetchCountries } from '@services/address';
  import { getStateByCountry } from '@services/video';
  import { useRoute } from 'vue-router';

  const props = defineProps({
    countryStats: {
      type: Array,
      required: true,
    },
    totalViewer: {
      type: Number,
      required: true,
    },
  });
  const route = useRoute();

  const countries = ref([]);
  const isoCodes = ref({});
  const states = ref([]);
  const videoId = route.params.videoId;
  const showStates = ref(false);
  const selectedCountryIndex = ref(null);
  const underlineStates = ref(Array(props.countryStats.length).fill(false));

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

  const toggleCountry = async (index) => {
    underlineStates.value = underlineStates.value.map((_, i) => i === index);
    selectedCountryIndex.value = index;
    const selectedCountry = props.countryStats[index].country;
    await getStatesByCountry(selectedCountry);
    showStates.value = true;
  };

  const goBackToCountries = () => {
    showStates.value = false;
    selectedCountryIndex.value = null;
    underlineStates.value = Array(props.countryStats.length).fill(false);
  };

  onMounted(() => {
    loadCountries();
  });
</script>

<template>
  <div v-if="!showStates" class="bg-white shadow-lg p-6 rounded-md text-black space-y-6">
    <span class="text-lg font-bold whitespace-nowrap">Most viewers by country</span>
    <div v-if="countryStats.length === 0">
      <p>No data available</p>
    </div>
    <div
      v-for="(stat, index) in countryStats"
      :key="index"
      class="flex items-center justify-between space-y-4"
    >
      <div
        class="text-base cursor-pointer"
        :class="{ 'underline text-primary': underlineStates[index] }"
        @click="toggleCountry(index)"
      >
        {{ stat.country }} ({{ isoCodes[stat.country] }})
      </div>
      <div class="flex items-center space-x-2">
        <div class="text-base font-bold">{{ stat.viewerCount }}</div>
        <div>({{ ((stat.viewerCount / totalViewer) * 100).toFixed(2) }}%)</div>
      </div>
    </div>
  </div>

  <!-- State -->
  <div v-else class="bg-white shadow-lg p-6 rounded-md text-black space-y-6">
    <div class="space-y-4">
      <div class="flex items-center space-x-2 text-primary cursor-pointer">
        <i class="pi pi-angle-left" />
        <span @click="goBackToCountries">Back to countries</span>
      </div>
      <div class="text-lg font-bold whitespace-nowrap flex items-center gap-2">
        <span>{{ countryStats[selectedCountryIndex].country }} </span>
        <span>({{ props.countryStats[selectedCountryIndex].viewerCount }})</span>
      </div>
      <div v-for="state in states" :key="state" class="flex items-center justify-between">
        <div class="text-base cursor-pointer">{{ state.state }}</div>
        <div class="flex items-center space-x-2">
          <div class="text-base font-bold">{{ state.viewerCount }}</div>
          <div>({{ ((state.viewerCount / totalViewer) * 100).toFixed(2) }}%)</div>
        </div>
      </div>
    </div>
  </div>
</template>
