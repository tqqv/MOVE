<script setup>
  import { ref, watch } from 'vue';

  const props = defineProps({
    label: {
      type: String,
      required: true,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      required: true,
    },
  });

  const emits = defineEmits(['update:modelValue']);
  const modelValue = ref(props.checked);

  watch(
    () => props.checked,
    (newVal) => {
      modelValue.value = newVal;
    },
  );

  const emitValue = () => {
    emits('update:modelValue', modelValue.value);
  };
</script>

<template>
  <div class="flex items-center gap-x-3">
    <label class="relative flex cursor-pointer items-center justify-center">
      <input
        class="peer hidden"
        type="checkbox"
        :name="groupName"
        v-model="modelValue"
        @change="emitValue"
      />
      <span
        class="relative size-6 border-2 border-primary rounded flex items-center justify-center transition-colors duration-200"
        :class="{ 'bg-primary': modelValue }"
      >
        <i v-if="modelValue" class="pi pi-check text-white text-base"></i>
      </span>
    </label>
    <h1>{{ label }}</h1>
  </div>
</template>
