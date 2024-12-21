<script setup>
  import { usePopupStore } from '@/stores';
  import Dialog from 'primevue/dialog';

  const props = defineProps({
    typeReport: String,
    reasonReport: String,
  });
  const popupStore = usePopupStore();
</script>
<template>
  <Dialog
    modal
    :draggable="false"
    v-model:visible="popupStore.showReportSuccess"
    :header="`Thank you for reporting`"
    class="w-full md:w-[494px]"
    :dismissableMask="true"
  >
    <div class="flex flex-col my-2">
      <h1 class="text-footer text-sm">You reported the {{ props.typeReport }}</h1>
      <p class="">{{ props.reasonReport }}</p>
    </div>
    <p class="mt-7 text-footer text-[11px]">
      If we find this channel violated Community Guidelines, the comment will be removed
    </p>
    <div class="flex justify-center mt-5">
      <button class="btn px-7" @click="() => popupStore.closeReportSuccess()">Close</button>
    </div>
  </Dialog>
</template>
