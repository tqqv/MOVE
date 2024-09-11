<script setup>
  import { useConfirm } from 'primevue/useconfirm';
  import Button from 'primevue/button';
  import ConfirmDialog from 'primevue/confirmdialog';

  const confirm = useConfirm();

  const confirm1 = () => {
    confirm.require({
      message:
        'Your video is not published yet, you will lose all details in your video. Are you sure to close this window?',
      header: 'You have not publish your video',
      icon: 'pi pi-info-circle',
      rejectProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptProps: {
        label: 'Confirm',
        severity: 'danger',
      },
      accept: () => {
        console.log('aceept');
      },
      reject: () => {
        console.log('reject');
      },
    });
  };
</script>
<template>
  <ConfirmDialog :style="{ width: '604px' }"></ConfirmDialog>
  <Button @click="confirm1()" label="Save" outlined></Button>
</template>
