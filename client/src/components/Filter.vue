<script setup>
  import { computed, ref, watch } from 'vue';
  import Dropdown from 'primevue/dropdown';
  const emit = defineEmits();

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

  const selectedOption = ref(props.options[0]);

  const placeholder = computed(() => {
    return props.options.length > 0 ? props.options[0].name : 'No options';
  });

  watch(selectedOption, (newValue) => {
    emit('update:modelValue', newValue.value);
  });
</script>

<template>
  <div class="flex justify-content-center items-center gap-x-4">
    <h1 class="whitespace-nowrap uppercase text_subTitle text-[12px]">{{ title }}</h1>
    <Dropdown
      v-model="selectedOption"
      :options="props.options"
      optionLabel="name"
      class="w-auto border-primary custom-dropdown text-xs"
    ></Dropdown>
  </div>
</template>

<style scoped></style>
