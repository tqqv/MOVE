<script setup>
  import { computed, ref } from 'vue';
  import Dropdown from 'primevue/dropdown';

  const options = [
    { id: 1, name: 'Views (High to Low)' },
    { id: 2, name: 'Views (Low to High)' },
    { id: 3, name: 'Duration (Long to Short)' },
    { id: 4, name: 'Duration (Short to Long)' },
    { id: 5, name: 'Ratings (High to Low)' },
    { id: 6, name: 'Ratings (Low to High)' },
  ];
  const title = 'sort by';
  const selectedOption = ref(null);
  const placeholder = computed(() => {
    return options.length > 0 ? options[0].name : 'None option';
  });

  // TRUYEN PROPS
  // const props = defineProps({
  //   options: sortOptions,
  //   title: {
  //     type: String,
  //     default: 'None',
  //   },
  // });
  // const selectedOption = ref(null);
  // const placeholder = computed(() => {
  //   return props.options.length > 0 ? props.options[0].name : 'None option';
  // });
</script>

<template>
  <div class="flex justify-content-center items-center gap-x-4">
    <h1 class="uppercase text_subTitle text-[12px]">{{ title }}</h1>
    <Dropdown
      v-model="selectedOption"
      :options="options"
      optionLabel="name"
      :placeholder="placeholder"
      class="w-56 md:w-14rem border-primary custom-dropdown"
    />
  </div>
</template>

<style scoped></style>
