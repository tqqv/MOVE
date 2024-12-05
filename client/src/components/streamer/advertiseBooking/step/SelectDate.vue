<script setup>
  import { ref, watch, onMounted } from 'vue';
  import DatePicker from 'primevue/datepicker';

  const props = defineProps({
    selectedDate: { type: Object, default: null },
  });

  const emit = defineEmits(['update:selectedDate']);

  const localSelectedDate = ref(props.selectedDate || new Date());

  const getStartAndEndOfMonth = (date) => {
    if (!date) return { startOfMonth: null, endOfMonth: null };

    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    return { startOfMonth, endOfMonth };
  };

  onMounted(() => {
    const { startOfMonth, endOfMonth } = getStartAndEndOfMonth(localSelectedDate.value);
    console.log('Start of Month:', startOfMonth);
    console.log('End of Month:', endOfMonth);
  });

  watch(localSelectedDate, (newValue) => {
    emit('update:selectedDate', newValue);
    const { startOfMonth, endOfMonth } = getStartAndEndOfMonth(newValue);
    console.log('Start of Month:', startOfMonth);
    console.log('End of Month:', endOfMonth);
  });

  const onMonthChange = (event) => {
    console.log(event);

    const month = event.month;
    const year = event.year;

    const startOfMonth = new Date(Date.UTC(year, month - 1, 1));

    const endOfMonth = new Date(Date.UTC(year, month, 0));

    console.log('Start of Month (UTC):', startOfMonth);
    console.log('End of Month (UTC):', endOfMonth);
  };
</script>

<template>
  <div class="flex flex-col h-[300px]">
    <DatePicker
      v-model="localSelectedDate"
      class="w-full"
      placeholder="Select a date"
      inline
      @month-change="onMonthChange"
    />
  </div>
</template>
