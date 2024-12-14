<script setup>
  import { ref, watch, onMounted } from 'vue';
  import DatePicker from 'primevue/datepicker';
  import { getBookedByDate, getBookedStatus } from '@/services/bookingFeaturedContent';
  import { useStreamerStore } from '@/stores/streamer.store';
  import { toast } from 'vue3-toastify';
  import DetailDateBooking from './DetailDateBooking.vue';
  import { formatDateData } from '@/utils';
  import Skeleton from 'primevue/skeleton';

  const props = defineProps({
    selectedDate: { type: Object },
  });

  const emit = defineEmits(['update:selectedDate', 'sendDetailBooking', 'update:checkDate']);

  const localSelectedDate = ref(props.selectedDate ? [props.selectedDate] : []);
  const selectedDate = ref(null);
  const streamerStore = useStreamerStore();
  const isDetailVisible = ref(false);
  const bookedDates = ref([]);
  const databyDate = ref([]);
  const dataChooseDate = ref();
  const dateHaveBooked = ref([]);
  const fetchedDates = ref([]);
  const checkDate = ref(false);
  const checkFullBookingDate = ref([]);
  const isBookedByUser = ref(false);
  const isLoadingDate = ref(false);
  const today = ref(new Date());

  const toggleDetailVisible = () => {
    isDetailVisible.value = !isDetailVisible.value;

    // if (!isDetailVisible.value) {
    //   dataChooseDate.value = null;
    //   databyDate.value = [];
    //   fetchedDates.value = [];
    //   isBookedByUser.value = false;
    // }
  };
  const formatDateToYearMonthDay = (date) => {
    if (!date) return null;

    if (Array.isArray(date)) {
      return date.map((singleDate) => {
        const year = String(singleDate.getFullYear());
        const month = String(singleDate.getMonth() + 1).padStart(2, '0');
        const day = String(singleDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      });
    } else {
      const year = String(date.getFullYear());
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  };

  const getStartAndEndOfMonth = (date) => {
    if (!date) return { startOfMonth: null, endOfMonth: null };

    const startOfMonth = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

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

      checkFullBookingDate.value = bookedDates.value
        .filter((item) => {
          const maxBookings = item.baseMaxBookings ?? item.abnormalMaxBookings;
          return item.currentBookings === maxBookings;
        })
        .map((item) => item.bookingDate);
    } catch (error) {
      console.error('Failed to fetch booked dates:', error);
    }
  };

  const fetchBookedByDate = async (dates) => {
    try {
      // check mảng
      const newDates = Array.isArray(dates) ? dates : [dates];
      // lọc các ngày chưa fetch
      const datesToFetch = newDates.filter((date) => !fetchedDates.value.includes(date));

      if (datesToFetch.length > 0) {
        const responses = await Promise.all(
          datesToFetch.map(async (date) => {
            const response = await getBookedByDate(date);
            dataChooseDate.value = response.data.data;

            return { date, data: response.data.data };
          }),
        );

        responses.forEach(({ date, data }) => {
          isBookedByUser.value = data.bookInfor.rows.some((row) => {
            return row.channelId === streamerStore?.streamerChannel.id;
          });

          // if (isBookedByUser) {
          //   toast.error('You have booking for today');
          //   return;
          // }

          const existingData = databyDate.value.find((item) => item.date === date);
          if (!existingData) {
            databyDate.value.push({ date, data });
          }
        });

        fetchedDates.value = [...fetchedDates.value, ...datesToFetch];

        emit('sendDetailBooking', databyDate.value);
      }
    } catch (error) {
      console.error('Failed to fetch booked dates:', error);
    }
  };
  const featchBookedDated = async () => {
    const { startOfMonth, endOfMonth } = getStartAndEndOfMonth(new Date());

    // conver sang iso date utc
    const isoStartOfMonth = new Date(
      Date.UTC(startOfMonth.getFullYear(), startOfMonth.getMonth(), startOfMonth.getDate()),
    ).toISOString();
    console.log(isoStartOfMonth);

    const isoEndOfMonth = new Date(
      endOfMonth.getTime() - endOfMonth.getTimezoneOffset() * 60000,
    ).toISOString();
    await fetchBookedDates(isoStartOfMonth, isoEndOfMonth);
  };
  onMounted(async () => {
    // ---------------------///
    featchBookedDated();
    await fetchBookedByDate(formatDateToYearMonthDay(localSelectedDate.value));
  });

  const onMonthChange = (event) => {
    const month = event.month;
    const year = event.year;

    const startOfMonth = new Date();
    const endOfMonth = new Date(Date.UTC(year, month, 0));

    fetchBookedDates(startOfMonth, endOfMonth);
  };

  const onDateChange = async (selectedDate) => {
    // const formattedDates = localSelectedDate.value.map((date) => formatDateToYearMonthDay(date));
    selectedDate.value = selectedDate;

    await fetchBookedByDate(formatDateData(selectedDate.value));

    toggleDetailVisible();
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
  // ----------------checkFullBookingDate---------------//
  const isFull = (date) => {
    const formattedDate = `${date.year}-${String(date.month + 1).padStart(2, '0')}-${String(
      date.day,
    ).padStart(2, '0')}`;
    return checkFullBookingDate.value.includes(formattedDate);
  };

  // ------------------------------------------------------------------------------------//
  const checkIfBooked = () => {
    if (localSelectedDate.value && Array.isArray(localSelectedDate.value)) {
      const formattedSelectedDates = localSelectedDate.value.map((date) =>
        formatDateToYearMonthDay(date),
      );

      const isDateBooked = formattedSelectedDates.some((date) =>
        dateHaveBooked.value.includes(date),
      );

      return isDateBooked;
    }

    return false;
  };

  const sendCheckChannelBooking = () => {
    const check = checkIfBooked();
    checkDate.value = check;

    emit('update:checkDate', check);
  };

  watch(
    localSelectedDate,
    async (newValue, oldValue) => {
      emit('update:selectedDate', newValue);

      localSelectedDate.value = newValue;

      sendCheckChannelBooking();
    },
    { immediate: true },
  );
  // watch(localSelectedDate, async (newValue) => {
  //   console.log(isDetailVisible.value);

  //   if (isDetailVisible.value) {
  //     emit('update:selectedDate', newValue);
  //   }

  // });
  const handleSelectedDateUpdate = (newSelectedDate) => {
    localSelectedDate.value = newSelectedDate;
  };
  const updateSelectDate = () => {
    emit('update:selectedDate', formatDateToYearMonthDay(localSelectedDate.value));
  };
</script>

<template>
  <div class="flex flex-col h-[430px]">
    <DatePicker
      selectionMode="multiple"
      v-model="localSelectedDate"
      class="w-full"
      placeholder="Select a date"
      inline
      @month-change="onMonthChange"
      @date-select="onDateChange"
      :min-date="today"
    >
      <template #date="slotProps">
        <strong v-if="isFull(slotProps.date)" class="day-full">
          {{ slotProps.date.day }}
        </strong>
        <strong v-else-if="isBooked(slotProps.date)" class="special-day">
          {{ slotProps.date.day }}
        </strong>
        <template v-else>{{ slotProps.date.day }}</template>
      </template>
    </DatePicker>
  </div>
  <DetailDateBooking
    :selectedDate="selectedDate"
    :localSelectedDate="localSelectedDate"
    :checkFullBookingDate="checkFullBookingDate"
    :dataChooseDate="dataChooseDate"
    title="Date Details"
    :isDetailVisible="isDetailVisible"
    @toggleDetailVisible="toggleDetailVisible"
    @updateSelectDate="updateSelectDate"
    @handleSelectedDateUpdate="handleSelectedDateUpdate"
    :isBookedByUser="isBookedByUser"
    @featchBookedDated="featchBookedDated"
  />
</template>

<style>
  .special-day {
    background-color: #e8fdfa;
    color: #13d0b4;
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 2rem;
    height: 2rem;
    text-align: center;
    line-height: 2rem;
    font-weight: normal;
    border: 2px solid #13d0b4;
    box-sizing: border-box;
  }
  .day-full {
    background-color: #ffe6e6;
    color: #b32d00;
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 2rem;
    height: 2rem;
    text-align: center;
    line-height: 2rem;
    font-weight: normal;
    border: 2px solid #b32d00;
    box-sizing: border-box;
  }

  .p-datepicker-day-selected {
    background: #13d0b4 !important;
  }
</style>
