import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getAllLevelWorkout } from '@/services/levelWorkout';

export const useLevelWorkoutStore = defineStore('levelWorkout', () => {
  const error = ref(null);
  const loading = ref(false);
  const levelWorkout = ref(null);
  const levelWorkoutOptions = ref([{ id: 1, name: 'All levels', value: '' }]);
  const levelWorkoutForSelect = ref([{ id: '0', name: 'Select a level workout', title: '' }]);

  const fetchLevelWorkout = async () => {
    loading.value = true;
    try {
      const response = await getAllLevelWorkout();
      if (!response.error) {
        levelWorkout.value = response.data;
        const formattedData = response.data.map((item) => ({
          id: item.id,
          name: item.levelWorkout,
          value: item.levelWorkout,
        }));
        levelWorkoutOptions.value = [{ id: 1, name: 'All levels', value: '' }, ...formattedData];
        levelWorkoutForSelect.value = [
          { id: '0', name: 'Select a level workout', title: '' },
          ...formattedData,
        ];
      } else {
        error.value = response.message;
      }
    } catch (error) {
      error.value = 'Failed to load level workouts';
    } finally {
      loading.value = false;
    }
  };

  return {
    levelWorkout,
    levelWorkoutOptions,
    fetchLevelWorkout,
    loading,
    error,
    levelWorkoutForSelect,
  };
});
