<script setup>
  import { formatView } from '@/utils';
  import { computed } from 'vue';

  const props = defineProps({
    value: {
      type: [String, Number],
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    percentage: {
      type: Number,
    },
    date: {
      type: Date,
    },
  });

  const formattedValue = computed(() => {
    if (['Earnings', 'Withdraw', 'Revenue'].includes(props.label)) {
      return `$ ${formatView(props.value)}`;
    }
    return formatView(props.value);
  });
</script>

<template>
  <div class="bg-white flex flex-col shadow p-5 rounded-lg py-7">
    <div class="flex items-center gap-x-5">
      <div
        class="rounded-full bg-primary size-[50px] flex justify-center items-center flex-shrink-0"
      >
        <slot name="icon" />
      </div>
      <div>
        <h1 class="font-bold text-[20px]">{{ formattedValue }}</h1>
        <h1 class="text-footer text-sm font-medium">{{ label }}</h1>
      </div>
    </div>
    <slot name="extra" />
  </div>
</template>
