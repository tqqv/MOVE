<script setup>
  import { ref } from 'vue';
  import { usePopupStore } from '@/stores';
  import Dialog from 'primevue/dialog';
  import ReportSuccess from './ReportSuccess.vue';
  import CheckboxCustom from '../CheckboxCustom.vue';

  const props = defineProps({
    channelName: String,
    visibleReport: Boolean,
  });
  const popupStore = usePopupStore();
  const selectedReason = ref('');
  const reportOptions = [
    { label: 'Inappropriate username' },
    { label: 'Copyright Infringement' },
    { label: 'Scam or Abuse' },
    { label: 'Spam or Keyword Stuffing' },
    { label: 'Racism' },
  ];

  const handleReportChannel = () => {
    popupStore.closeReportChannel();
    popupStore.openReportSuccess();
  };
</script>
<template>
  <Dialog
    modal
    :draggable="false"
    v-model:visible="popupStore.showReportChannel"
    :header="`Report ${channelName}`"
    class="w-full md:w-[494px]"
    :dismissableMask="true"
    ><div class="flex flex-col gap-y-4 my-2">
      <CheckboxCustom
        v-for="(option, index) in reportOptions"
        :key="index"
        :label="option.label"
        groupName="reportChannel"
        v-model="selectedReason"
      />
      <div class="text-[11px] text-footer">
        <h1 class="mb-3">
          Flagged videos and users are reviewed by MOVE staff 24 hours a day, 7 days a week to
          determine whether they violate Community Guidelines. Accounts are penalised for Community
          Guidelines violations, and serious or repeated violations can lead to account termination.
        </h1>
        <span
          >Please also contact law enforcement if you believe that someone is in immediate
          danger.</span
        >
      </div>
    </div>
    <div class="flex justify-center mt-5">
      <button class="btn px-7" @click="handleReportChannel">Next</button>
    </div>
  </Dialog>
  <ReportSuccess typeReport="channel" :reasonReport="selectedReason" />
</template>

<style scope></style>
