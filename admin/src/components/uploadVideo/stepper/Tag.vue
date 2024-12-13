<script setup>
  import { useVideoStore, useCategoriesStore, useLevelWorkoutStore } from '@/stores';
  import { storeToRefs } from 'pinia';
  import { onMounted, ref, watch, computed } from 'vue';
  import Dropdown from 'primevue/dropdown';
  const videoStore = useVideoStore();
  const categoriesStore = useCategoriesStore();
  const levelWorkoutStore = useLevelWorkoutStore();
  const { duration, tab, selectCategoryOptions, selectLevelWorkoutOptions, keywords } =
    storeToRefs(videoStore);
  const categoryOptions = computed(() => categoriesStore.categoriesForSelect);
  const levelWorkoutOptions = computed(() => levelWorkoutStore.levelWorkout);

  const durationInMinutes = ref(0);
  const errorLength = ref(false);
  const selectCategory = computed({
    get: () => selectCategoryOptions.value,
    set: (val) => videoStore.setSelectCategoryOptions(val),
  });

  const selectLevelWorkout = computed({
    get: () => selectLevelWorkoutOptions.value,
    set: (val) => videoStore.setSelectLevelWorkoutOptions(val),
  });

  watch(selectCategory, (newOptions) => {
    videoStore.setSelectCategoryOptions(newOptions);
  });
  watch(selectLevelWorkout, (newOptions) => {
    videoStore.setSelectLevelWorkoutOptions(newOptions);
  });
  watch(duration, () => {
    durationInMinutes.value = Math.floor(duration.value / 60);
  });
  watch([tab, selectCategory, keywords], ([newTab, newSelectCategory, newKeywords]) => {
    if (newTab == 2) {
      const isCategoryValid = newSelectCategory !== categoryOptions.value[0].id;
      videoStore.setKeywords(newKeywords);
      const isKeywordsValid = newKeywords.length <= 50;
      const isNext = isCategoryValid && isKeywordsValid;
      videoStore.setIsNext(isNext);
      errorLength.value = !isKeywordsValid;
    } else {
      videoStore.setIsNext(true);
    }
  });
  onMounted(async () => {
    await categoriesStore.fetchCategories();
    await levelWorkoutStore.fetchLevelWorkout();
  });
</script>
<template>
  <div class="flex flex-col">
    <label class="text-[16px] font-medium">Category</label>
    <Dropdown
      v-model="selectCategory"
      :options="categoryOptions"
      optionLabel="name"
      optionValue="id"
      class="mt-2 w-[200px] border-primary custom-dropdown text-xs"
    />
  </div>
  <div class="flex flex-col md:flex-row justify-between mt-3 gap-x-6">
    <div>
      <label class="text-[16px] font-medium">Workout level</label>
      <div class="flex gap-x-3 mt-1">
        <span
          v-for="(level, index) in levelWorkoutOptions?.data"
          :key="index"
          class="tag mt-1"
          :class="{ tag_active: selectLevelWorkout === level.id }"
          @click="selectLevelWorkout = level.id"
        >
          {{ level.levelWorkout }}
        </span>
      </div>
    </div>
    <div>
      <label class="text-[16px] font-medium">Duration</label>
      <div class="flex gap-x-3 text-nowrap mt-1">
        <span class="tag mt-1 cursor-default" :class="{ tag_active: durationInMinutes < 30 }">
          < 30 mins
        </span>
        <span
          class="tag mt-1 cursor-default"
          :class="{ tag_active: durationInMinutes >= 30 && durationInMinutes <= 60 }"
        >
          < 1 hour
        </span>
        <span class="tag mt-1 cursor-default" :class="{ tag_active: durationInMinutes > 60 }">
          > 1 hour
        </span>
      </div>
    </div>
  </div>
  <div class="mt-3">
    <div class="flex gap-x-4">
      <label class="text-[16px] font-medium">Search keywords</label>
      <label class="text-[16px] font-medium text-footer">(Optionals)</label>
    </div>
    <p class="text-[12px] text-footer font-medium mt-1">
      Adding keywords help your viewers to find your videos easily. Enter a comma after each word.
    </p>
    <textarea
      name="keyword"
      id="keyword"
      v-model="keywords"
      class="border-[2px] border-gray-dark focus:border-primary outline-none rounded-md mt-2 w-full p-2 resize-none h-[100px]"
      :class="{ 'focus:border-red border-red': errorLength }"
      placeholder="Add tags"
    ></textarea>
    <span
      class="text-[12px] text-footer font-medium flex justify-end"
      :class="{ 'text-red': errorLength }"
      >{{ keywords.length }}/50</span
    >
  </div>
</template>
