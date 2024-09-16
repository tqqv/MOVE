<template>
  <div class="flex items-center gap-x-3">
    <label class="relative flex cursor-pointer items-center justify-center">
      <input
        class="peer hidden"
        type="radio"
        :name="groupName"
        :value="label"
        v-model="modelValue"
        @change="emitValue"
        :checked="checked"
      />
      <span
        class="relative size-8 rounded-full border-[1px] border-primary flex items-center justify-center"
      ></span>
      <div class="absolute size-6 rounded-full duration-500 ease-out peer-checked:bg-primary"></div>
    </label>
    <h1>{{ label }}</h1>
  </div>
</template>

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
