<script setup>
  import { computed, ref } from 'vue';
  import Dropdown from 'primevue/dropdown';

  const props = defineProps({
    options: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  });
  const selectedOption = ref(null);
  const placeholder = computed(() => {
    return props.options.length > 0 ? props.options[0].name : 'None option';
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
    <h1 class="uppercase text_subTitle text-[12px]">{{ props.title }}</h1>
    <Dropdown
      v-model="selectedOption"
      :options="props.options"
      optionLabel="name"
      :placeholder="placeholder"
      class="w-auto border-primary custom-dropdown text-xs text-[#13d0b4]"
    ></Dropdown>
  </div>
</template>

<style scoped></style>
