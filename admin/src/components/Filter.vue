<script setup>
  import { onMounted, ref, watch } from 'vue';
  import Dropdown from 'primevue/dropdown';
  const emit = defineEmits(['change']);

  const props = defineProps({
    options: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    class: {
      type: [Array, String],
    },
    optionLabel: { type: String, default: 'name' },
    defaultValue: { type: [Object, Number, String], default: null },
  });

  const selectedOption = ref(null);

  watch(selectedOption, (newValue) => {
    if (newValue) {
      emit('change', newValue);
    }
  });

  watch(
    () => props.options,
    (newOptions) => {
      if (newOptions && newOptions.length > 0) {
        selectedOption.value =
          newOptions.find(
            (option) => option.value === (props.defaultValue?.value || props.defaultValue),
          ) || newOptions[0];
      }
    },
    { immediate: true },
  );
</script>

<template>
  <div class="flex justify-content-center items-center">
    <h1 v-if="title" class="whitespace-nowrap uppercase text_subTitle text-[12px] mr-4">
      {{ title }}
    </h1>
    <Dropdown
      v-model="selectedOption"
      :options="props.options"
      :optionLabel="optionLabel"
      class="w-[150px] border-primary custom-dropdown text-xs capitalize"
      :class="class"
    ></Dropdown>
  </div>
</template>
