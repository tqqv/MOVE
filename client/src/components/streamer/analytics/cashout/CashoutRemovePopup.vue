<script setup>
  import { watch } from 'vue';
  import Dialog from 'primevue/dialog';
  import { removeWithdrawInfor } from '@/services/cashout';
  import { toast } from 'vue3-toastify';
  import { useWithdrawInfor } from '@/stores/withdrawInfor.store';

  const props = defineProps({
    isRemoveVisible: Boolean,
    title: String,
  });
  const emit = defineEmits(['closeRemove']);
  const withdrawInforStore = useWithdrawInfor();

  const lockScroll = () => (document.body.style.overflow = 'hidden');
  const unlockScroll = () => (document.body.style.overflow = 'auto');
  const toggleCloseRemove = () => {
    emit('closeRemove');
  };

  watch(
    () => props.isRemoveVisible,
    (newVal) => {
      if (newVal) lockScroll();
      else unlockScroll();
    },
  );

  const handleDeleteCardInfor = async () => {
    const stripeBankId = withdrawInforStore.withdrawInfor?.stripeBankId;

    if (!stripeBankId) {
      toast.error('Cashout method or intent information is missing.');
      return;
    }

    const res = await removeWithdrawInfor(stripeBankId);
    if (res && res.status === 200) {
      toggleCloseRemove();
      withdrawInforStore.clearWithdrawInfor();
      toast.success('Bank Infor removed successfully.');
    } else {
      toast.error('Bank Infor failed.');
    }
  };
  watch(
    () => withdrawInforStore.withdrawInfor,
    (newBank) => {},
  );
</script>
<template>
  <div class="card flex justify-center">
    <Dialog
      :visible="isRemoveVisible"
      :modal="true"
      :draggable="false"
      :header="props.title"
      @show="lockScroll"
      @hide="unlockScroll"
      @update:visible="toggleCloseRemove"
      :style="{ width: '40rem' }"
    >
      <div class="space-y-6">
        <span
          >Your bank information will be removed and withdraw will not be made. Are you sure you
          want to remove withdraw method?</span
        >
        <div class="flex items-center gap-x-4 justify-end">
          <div @click="toggleCloseRemove" class="text-base text-primary cursor-pointer">Cancel</div>
          <div @click="handleDeleteCardInfor" class="btn cursor-pointer">Remove</div>
        </div>
      </div>
    </Dialog>
  </div>
</template>
