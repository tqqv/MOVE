<script setup>
  import { watch } from 'vue';
  import Dialog from 'primevue/dialog';
  import { deleteCardInfo } from '@/services/payment';
  import { toast } from 'vue3-toastify';
  import { useCardStore } from '@/stores/card.store';

  const props = defineProps({
    isRemoveVisible: Boolean,
    title: String,
  });
  const emit = defineEmits(['closeRemove']);
  const cardStore = useCardStore();

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
    const res = await deleteCardInfo(cardStore.card.paymentMethodId);
    if (res && res.status === 200) {
      toggleCloseRemove();
      cardStore.clearCard();
      toast.success('Card removed successfully.');
    } else {
      toast.error('Card remove failed.');
    }
  };
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
      :dismissableMask="true"
    >
      <div class="space-y-6">
        <span
          >Your card information will be removed and payment will not be made. Are you sure you want
          to remove payment method?</span
        >
        <div class="flex items-center gap-x-4 justify-end">
          <div @click="toggleCloseRemove" class="text-base text-primary cursor-pointer">Cancel</div>
          <div @click="handleDeleteCardInfor" class="btn cursor-pointer">Remove</div>
        </div>
      </div>
    </Dialog>
  </div>
</template>
