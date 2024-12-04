<script setup>
  import { onMounted, ref, watch } from 'vue';
  import Dropdown from 'primevue/dropdown';
  const emit = defineEmits();

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
    defaultValue: { type: [String, Number], default: null }, // Giá trị mặc định
  });

  const selectedOption = ref(null);

  // Watch for selectedOption change and emit the new value
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
          newOptions.find((option) => option.value === props.defaultValue) || newOptions[0];
      }
    },
    { immediate: true },
  );

  onMounted(() => {
    if (props.options && props.options.length > 0) {
      // Nếu có giá trị defaultValue, tìm kiếm trong options
      selectedOption.value =
        props.defaultValue !== null
          ? props.options.find((option) => option.value === props.defaultValue) || props.options[0]
          : props.options[0];
    }
  });
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
      class="w-[150px] border-primary custom-dropdown text-xs"
      :class="class"
    ></Dropdown>
  </div>
</template>
