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
  });
  const selectedOption = ref(null);
  watch(selectedOption, (newValue) => {
    if (newValue) {
      emit('change', newValue);
    }
  });
  onMounted(() => {
    if (props.options.length > 0) {
      selectedOption.value = props.options[0];
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
      optionLabel="name"
      class="w-[150px] border-primary custom-dropdown text-xs"
      :class="class"
    ></Dropdown>
  </div>
</template>
