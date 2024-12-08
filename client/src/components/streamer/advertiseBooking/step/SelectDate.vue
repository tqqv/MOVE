<script setup>
  import { ref, watch, onMounted } from 'vue';
  import DatePicker from 'primevue/datepicker';
  import { getBookedByDate, getBookedStatus } from '@/services/bookingFeaturedContent';

  const props = defineProps({
    selectedDate: { type: Object, default: null },
  });

  const emit = defineEmits(['update:selectedDate', 'sendDetailBooking', 'update:checkDate']);

  const localSelectedDate = ref([props.selectedDate || new Date()]);

  const bookedDates = ref([]);
  const databyDate = ref();
  const dateHaveBooked = ref([]);

  const formatDateToYearMonthDay = (date) => {
    if (!date) return null;

    const year = String(date[0].getFullYear());
    const month = String(date[0].getMonth() + 1).padStart(2, '0');
    const day = String(date[0].getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const getStartAndEndOfMonth = (date) => {
    if (!date) return { startOfMonth: null, endOfMonth: null };
    console.log(date);

    const startOfMonth = new Date(date[0].getFullYear(), date[0].getMonth(), 1);
    const endOfMonth = new Date(date[0].getFullYear(), date[0].getMonth() + 1, 0);

    return {
      startOfMonth: startOfMonth,
      endOfMonth: endOfMonth,
    };
  };

  const fetchBookedDates = async (startOfMonth, endOfMonth) => {
    try {
      const response = await getBookedStatus(startOfMonth, endOfMonth);

      bookedDates.value = response.data.data.detailedBookings;
      dateHaveBooked.value = bookedDates.value
        .filter((item) => item.isBookedByChannel === 1)
        .map((item) => item.bookingDate);
    } catch (error) {
      console.error('Failed to fetch booked dates:', error);
    }
  };

  const fetchBookedByDate = async (datetime) => {
    try {
      const response = await getBookedByDate(datetime);

      if (response.status === 200) {
        databyDate.value = response.data.data;
        emit('sendDetailBooking', databyDate.value);
      } else {
        console.warn('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch booked dates:', error);
    }
  };

  onMounted(async () => {
    const { startOfMonth, endOfMonth } = getStartAndEndOfMonth(localSelectedDate.value);
    console.log(startOfMonth);
    console.log(endOfMonth);
    // conver sang iso date utc
    const isoStartOfMonth = new Date(
      startOfMonth.getTime() - startOfMonth.getTimezoneOffset() * 60000,
    ).toISOString();
    const isoEndOfMonth = new Date(
      endOfMonth.getTime() - endOfMonth.getTimezoneOffset() * 60000,
    ).toISOString();
    // ---------------------///
    await fetchBookedDates(isoStartOfMonth, isoEndOfMonth);
    await fetchBookedByDate(formatDateToYearMonthDay(localSelectedDate.value));
  });

  watch(localSelectedDate, (newValue) => {
    emit('update:selectedDate', newValue);
  });

  const onMonthChange = (event) => {
    const month = event.month;
    const year = event.year;

    const startOfMonth = new Date(Date.UTC(year, month - 1, 1));
    const endOfMonth = new Date(Date.UTC(year, month, 0));

    fetchBookedDates(startOfMonth, endOfMonth);
  };

  const onDateChange = async () => {
    await fetchBookedByDate(formatDateToYearMonthDay(localSelectedDate.value));
    sendCheckChannelBooking();
  };

  // ----------------Kiểm tra xem ngày trong slotProps có nằm trong dateHaveBooked không---------------//
  const isBooked = (date) => {
    const formattedDate = `${date.year}-${String(date.month + 1).padStart(2, '0')}-${String(
      date.day,
    ).padStart(2, '0')}`;

    return dateHaveBooked.value.includes(formattedDate);
  };
  // ------------------------------------------------------------------------------------//

  const checkIfBooked = () => {
    const formattedSelectedDate = formatDateToYearMonthDay(localSelectedDate.value);
    const isDateBooked = dateHaveBooked.value.includes(formattedSelectedDate);

    return isDateBooked;
  };
  const sendCheckChannelBooking = () => {
    const check = checkIfBooked();
    emit('update:checkDate', check);
  };
</script>

<template>
  <div class="flex flex-col h-[300px]">
    <DatePicker
      selectionMode="multiple"
      v-model="localSelectedDate"
      class="w-full"
      placeholder="Select a date"
      inline
      @month-change="onMonthChange"
      @date-select="onDateChange"
    >
      <template #date="slotProps">
        <strong v-if="isBooked(slotProps.date)" class="special-day">
          {{ slotProps.date.day }}
        </strong>
        <template v-else>{{ slotProps.date.day }}</template>
      </template>
    </DatePicker>
  </div>
</template>

<style>
  /* Sử dụng màu nền tương tự như ngày được chọn trong DatePicker */
  /* Sử dụng màu nền cho ngày đã được booked */
  .special-day {
    background-color: #dd9595;
    color: white;
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: var(--p-datepicker-date-width);
    height: var(--p-datepicker-date-height);
    text-align: center;
    line-height: 2rem;
    font-weight: normal;
    border: none; /* Loại bỏ border */
  }

  .p-datepicker-day-selected {
    background: #13d0b4 !important;
  }
</style>
