<script setup>
  import { ref } from 'vue';
  import Dialog from 'primevue/dialog';
  import Button from 'primevue/button';
  import { usePopupStore } from '@/stores/popup.store';

  const popupStore = usePopupStore();
</script>
<template>
  <Dialog
    modal
    :draggable="false"
    v-model:visible="popupStore.showChangePasswordSuccess"
    header="Change Password"
    class="w-full md:w-[474px] mx-3 md:mx-0"
  >
    <div class="flex flex-col gap-y-3">
      <p class="mb-4 text-[11px] md:text-[14px]">Your password has been successfully updated</p>
      <div class="flex justify-center">
        <Button
          @click="popupStore.closeChangePasswordSuccess"
          type="submit"
          class="btn w-full md:w-1/2"
          >Okay</Button
        >
      </div>
    </div>
  </Dialog>
</template>
