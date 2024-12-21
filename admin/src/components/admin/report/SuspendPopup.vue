<script setup>
  import Dialog from 'primevue/dialog';
  import { usePopupStore } from '@/stores/popup.store';
  import CheckboxCustom from '@/components/CheckboxCustom.vue';
  import { ref, watch } from 'vue';
  import { handleReportAction } from '@/services/report';
  import SmallLoading from '@/components/icons/smallLoading.vue';
  import dayjs from 'dayjs';
  import utc from 'dayjs/plugin/utc';
  import { toast } from 'vue3-toastify';
  const popupStore = usePopupStore();

  const props = defineProps({
    typeReport: String,
    status: String,
    detailReport: Object,
  });

  // HANDLE SUSPEND
  const optionDate = [
    {
      duration: 3,
      value: '3 days',
    },
    {
      duration: 7,
      value: '7 days',
    },
    {
      duration: 14,
      value: '14 days',
    },
    {
      duration: '',
      value: 'Other',
    },
  ];
  const selectedDuration = ref(null);
  const dateSuspend = ref(null);
  const username = ref();
  const inputReason = ref();
  const inputDuration = ref();

  const loadingSubmit = ref(false);
  const emit = defineEmits(['fetchDetailReport']);

  const fetchDetail = () => {
    emit('fetchDetailReport');
  };

  dayjs.extend(utc);
  // HANDLE SELECT TIME
  const updateSelection = (value) => {
    const today = dayjs.utc().add(value, 'day');
    selectedDuration.value = value;
    dateSuspend.value = today.toISOString();
    console.log(dateSuspend.value, selectedDuration.value);
  };

  // HANDLE SUSPEND
  const handleSuspend = async () => {
    if (selectedDuration.value == null) {
      toast.info('Select the period of time');
      return;
    }

    if (inputReason.value == null || inputReason.value.trim() === '') {
      toast.info('Please input a reason');
      return;
    }

    if (
      selectedDuration.value === '' &&
      (inputDuration.value == null || inputDuration.value.trim() === '')
    ) {
      toast.info('Please input other duration');
      return;
    }

    if (selectedDuration.value === '') {
      const sanitizedValue = inputDuration.value;
      if (sanitizedValue !== inputDuration.value) {
        inputDuration.value = sanitizedValue;
      }
      const today = dayjs.utc().add(Number(sanitizedValue), 'day');
      dateSuspend.value = today.toISOString();
    }

    const params = {
      targetReportId:
        props.detailReport?.targetCommentId ||
        props.detailReport?.targetVideoId ||
        props.detailReport?.targetLivestreamId ||
        props.detailReport?.targetAccountId ||
        props.detailReport?.targetChannelId,
      action: 'suspended',
      banned: {
        userId:
          props.detailReport?.Comment?.userId ||
          props.detailReport?.Video?.channel?.User?.id ||
          props.detailReport?.Livestream?.livestreamChannel?.User?.id ||
          props.detailReport?.Account?.User?.id ||
          props.detailReport?.targetUser?.id,
        reason: inputReason.value.trim(),
        expiresAt: dateSuspend.value,
      },
      type: props.typeReport,
    };
    try {
      const response = await handleReportAction(params);
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      handleCancel();
      loadingSubmit.value = false;
      fetchDetail();
    }
  };

  // HANDLE BAN
  const handleBan = async () => {
    if (!inputReason.value || inputReason.value.trim() === '') {
      toast.info('Please enter a reason');
      return;
    }

    const params = {
      targetReportId:
        props.detailReport?.targetCommentId ||
        props.detailReport?.targetVideoId ||
        props.detailReport?.targetLivestreamId ||
        props.detailReport?.targetAccountId ||
        props.detailReport?.targetChannelId,
      action: 'banned',
      banned: {
        userId:
          props.detailReport?.Comment?.userId ||
          props.detailReport?.Video?.channel?.User?.id ||
          props.detailReport?.Livestream?.livestreamChannel?.User?.id ||
          props.detailReport?.Channel?.User?.id ||
          props.detailReport?.targetUser?.id,
        reason: inputReason.value.trim(),
      },
      type: props.typeReport,
    };

    loadingSubmit.value = true;
    try {
      const response = await handleReportAction(params);
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      popupStore.closeShowBan();
      loadingSubmit.value = false;
      fetchDetail();
    }
  };

  // HANDLE ACCEPT
  const handleAccept = () => {
    try {
    } catch (error) {
    } finally {
      popupStore.closeShowAccept();
    }
  };

  // HANDLE REJECT
  const handleReject = () => {
    console.log('Reject');
    popupStore.closeShowReject();
  };

  // HANDLE CLOSE POPUP
  const handleCancel = () => {
    selectedDuration.value = null;
    popupStore.closeShowSuspend();
    popupStore.closeShowBan();
    popupStore.closeShowAccept();
    popupStore.closeShowReject();
  };

  const onHideDialog = () => {
    selectedDuration.value = null;
    inputDuration.value = '';
  };
  watch(
    () => props.detailReport,
    (newValue) => {
      username.value =
        newValue?.Comment?.userComments?.username ||
        newValue?.Video?.channel?.User?.username ||
        newValue?.Livestream?.userComments?.username ||
        newValue?.Channel?.User?.username ||
        newValue?.targetUser?.username ||
        'Unknown';
    },
  );

  // watch(inputDuration, (newValue) => {
  //   if (newValue) {
  //     const today = dayjs.utc().add(newValue, 'day');
  //     dateSuspend.value = today.toISOString();
  //     console.log(dateSuspend.value);
  //   }
  // });
</script>
<template>
  <!-- SUSPEND -->
  <Dialog
    v-if="props.status === 'suspend'"
    modal
    :draggable="false"
    :dismissableMask="true"
    v-model:visible="popupStore.showSuspend"
    :header="`Suspend ${username}`"
    class="w-full md:w-[474px] mx-3 md:mx-0"
    @hide="onHideDialog"
  >
    <div class="flex flex-col gap-y-3">
      <p class="text-[11px] md:text-[14px] italic">
        Select the period of time you want to suspend
        <span class="font-semibold">
          {{ username }}
        </span>
      </p>
      <div class="flex justify-between mt-4">
        <CheckboxCustom
          v-for="(option, index) in optionDate"
          :key="index"
          :label="option.value"
          groupName="durationOptions"
          :checked="selectedDuration === option.value"
          @update:modelValue="updateSelection(option.duration)"
        />
      </div>
      <div v-if="selectedDuration == ''" class="pt-5">
        <div class="relative">
          <input
            v-model="inputDuration"
            name="reason"
            type="text"
            placeholder=""
            autocomplete="off"
            class="border-b border-gray-300 py-1 focus:border-b-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit w-full"
            @input="inputDuration = inputDuration.replace(/[^0-9]/g, '')"
          />
          <label
            for="reason"
            class="absolute -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm peer-focus:text-primary peer-focus:font-semibold"
          >
            Another date
          </label>
        </div>
      </div>
      <div class="pt-4">
        <div class="relative">
          <input
            v-model="inputReason"
            name="reason"
            type="text"
            placeholder=""
            autocomplete="off"
            class="border-b border-gray-300 py-1 focus:border-b-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit w-full"
          />
          <label
            for="reason"
            class="absolute -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm peer-focus:text-primary peer-focus:font-semibold"
          >
            Reason
          </label>
        </div>
      </div>
      <div class="flex gap-x-12 justify-center mt-4">
        <button
          class="btn-suspend"
          :class="{
            'bg-yellow-dark/50 cursor-not-allowed':
              selectedDuration == null ||
              inputReason == null ||
              inputReason.trim() === '' ||
              (selectedDuration === '' && (inputDuration == null || inputDuration.trim() === '')),
          }"
          @click="handleSuspend"
        >
          <span v-if="!loadingSubmit">Suspend</span>
          <SmallLoading fill="#ffb564" v-else />
        </button>
        <button class="btn-cancel" @click="handleCancel">Cancel</button>
      </div>
    </div>
  </Dialog>

  <!-- BAN -->
  <Dialog
    v-if="props.status === 'ban'"
    modal
    :draggable="false"
    :dismissableMask="true"
    v-model:visible="popupStore.showBan"
    :header="`Ban ${username}`"
    class="w-full md:w-[474px] mx-3 md:mx-0"
  >
    <div class="flex flex-col gap-y-3">
      <p class="text-[11px] md:text-[14px]">
        Enter the reason you want to ban account
        <span class="font-semibold">
          {{ username }}
        </span>
        permanently
      </p>
      <div class="py-4">
        <div class="relative">
          <input
            v-model="inputReason"
            name="reason"
            type="text"
            placeholder=""
            autocomplete="off"
            class="border-b border-gray-300 py-1 focus:border-b-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit w-full"
          />
          <label
            for="reason"
            class="absolute -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm peer-focus:text-primary peer-focus:font-semibold"
          >
            Reason
          </label>
        </div>
      </div>
      <div class="flex gap-x-12 justify-center">
        <button
          :class="{
            'bg-dark/70 cursor-not-allowed': inputReason == null || inputReason.trim() === '',
          }"
          class="btn-ban"
          @click="handleBan"
        >
          <span v-if="!loadingSubmit">Ban</span>
          <SmallLoading fill="#000" v-else />
        </button>
        <button class="btn-cancel" @click="handleCancel">Cancel</button>
      </div>
    </div>
  </Dialog>

  <!-- ACCEPT -->
  <Dialog
    v-if="props.status === 'approved'"
    modal
    :draggable="false"
    :dismissableMask="true"
    v-model:visible="popupStore.showAccept"
    :header="`Accept report to ${username}`"
    class="w-full md:w-[474px] mx-3 md:mx-0"
  >
    <div class="flex flex-col gap-y-3">
      <p class="text-[11px] md:text-[14px] mb-3">
        After accepting, the <span class="font-semibold">{{ props.typeReport }}</span> will be
        deleted and the system will send a notification to the
        <span class="font-semibold">
          {{ username }}
        </span>
      </p>

      <div class="flex gap-x-12 justify-center">
        <button class="btn-success" @click="handleAccept">Approve</button>
        <button class="btn-cancel" @click="handleCancel">Cancel</button>
      </div>
    </div>
  </Dialog>

  <!-- REJECT -->
  <Dialog
    v-if="props.status === 'rejected'"
    modal
    :draggable="false"
    :dismissableMask="true"
    v-model:visible="popupStore.showReject"
    :header="`Reject report to ${username}`"
    class="w-full md:w-[474px] mx-3 md:mx-0"
  >
    <div class="flex flex-col gap-y-3">
      <p class="text-[11px] md:text-[14px] mb-3">Reject report if this is an incorrect report.</p>

      <div class="flex gap-x-12 justify-center">
        <button class="btn-reject" @click="handleReject">Reject</button>
        <button class="btn-cancel" @click="handleCancel">Cancel</button>
      </div>
    </div>
  </Dialog>
</template>
