<script setup>
  import { ref, onMounted, watch } from 'vue';
  import Calendar from 'primevue/calendar';

  const emit = defineEmits();

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    class: {
      type: [Array, String],
    },
    defaultDate: {
      type: [Date, String],
      default: null,
    },
    startDate: {
      type: [Date, String],
      default: null,
    },
    isValidateDate: Boolean,
  });

  const selectedDate = ref(props.defaultDate);

  watch(
    () => props.defaultDate,
    (newValue) => {
      selectedDate.value = newValue;
    },
    { immediate: true },
  );

  watch(selectedDate, (newValue) => {
    if (newValue) {
      emit('change', newValue);
    }
  });

  onMounted(() => {
    console.log(selectedDate.value);

    selectedDate.value = props.defaultDate;
  });
  const today = ref(new Date());
</script>

<template>
  <div class="flex justify-content-center items-center">
    <h1 v-if="title" class="whitespace-nowrap uppercase text_subTitle text-[12px] mr-4">
      {{ title }}
    </h1>
    <Calendar
      v-model="selectedDate"
      :class="['w-[150px]  text-xs']"
      dateFormat="dd/mm/yy"
      showIcon
      v-bind:maxDate="isValidateDate ? null : today"
      v-bind:minDate="isValidateDate ? null : startDate"
    ></Calendar>
  </div>
</template>
<style>
  .p-inputtext {
    border-color: #13d0b4;
    color: #13d0b4;
  }
  .p-datepicker-dropdown {
    border-color: #13d0b4;
  }
</style>
