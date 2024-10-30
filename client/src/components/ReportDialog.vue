<script setup>
  import { watch } from 'vue';
  import CheckboxReport from './CheckboxReport.vue';
  import Dialog from 'primevue/dialog';

  const props = defineProps({
    title: String,
    groupName: String,
    titleReport: String,
    isReportVisible: Boolean,
    isReportSuccessVisible: Boolean,
    reportType: Array,
    selectedReport: {
      type: Object,
      default: () => null,
    },
  });

  const emit = defineEmits(['close', 'hide', 'hideSuccess', 'submit', 'update:selectedReport']);

  const lockScroll = () => (document.body.style.overflow = 'hidden');
  const unlockScroll = () => (document.body.style.overflow = 'auto');

  const updateSelectedReport = (value) => {
    emit('update:selectedReport', value);
  };

  const handleSubmitReport = () => {
    emit('submit');
  };

  const closeReportSuccess = () => {
    emit('close');
  };

  const hideReport = () => {
    emit('hide');
  };

  const hideReportSuccess = () => {
    console.log('success hiddens');
    emit('hideSuccess');
  };

  watch(
    () => props.isReportVisible,
    (newVal) => {
      if (newVal) lockScroll();
      else unlockScroll();
    },
  );
</script>

<template>
  <Dialog
    :visible="isReportVisible"
    :modal="true"
    :draggable="false"
    :header="props.titleReport"
    :style="{ width: '40rem' }"
    @update:visible="hideReport"
  >
    <div v-for="reportType in reportType" :key="reportType.id" class="flex gap-4 items-center mt-3">
      <CheckboxReport
        :label="reportType.description"
        :value="reportType.id"
        :groupName="groupName"
        @change="(event) => updateSelectedReport(reportType)"
      />
      <i class="pi pi-question-circle text-[#CCCCCC]"></i>
    </div>
    <p class="text-footer text-[12px] mt-4">
      Flagged videos and users are reviewed by MOVE staff 24 hours a day, 7 days a week to determine
      whether they violate Community Guidelines. Accounts are penalised for Community Guidelines
      violations, and serious or repeated violations can lead to account termination.
    </p>
    <p class="mt-5 text-footer text-[12px]">
      Please also contact law enforcement if you believe that someone is in immediate danger.
    </p>
    <div class="mt-7 flex justify-center w-full">
      <button
        @click="handleSubmitReport"
        :class="[selectedReport ? 'btn' : 'btnDisable cursor-not-allowed']"
        :disabled="!selectedReport"
      >
        Next
      </button>
    </div>
  </Dialog>
  <Dialog
    :visible="isReportSuccessVisible"
    :modal="true"
    :draggable="false"
    header="Thank you for reporting"
    :style="{ width: '40rem' }"
    @update:visible="hideReportSuccess"
    @show="lockScroll"
    @hide="unlockScroll"
  >
    <p class="text-[14px] text-footer">You reported the {{ title }} for:</p>
    <h2>{{ selectedReport.description }}</h2>
    <p class="text-[14px] text-footer mt-4">
      If we find this channel violated
      <a href="/" class="underline">Community Guidelines</a>, the channel will be suspended
    </p>
    <div class="mt-7 flex justify-center w-full">
      <button @click="closeReportSuccess" class="btn">Close</button>
    </div>
  </Dialog>
</template>
