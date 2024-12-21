<script setup>
  import { ref, onMounted, watch } from 'vue';
  import Dialog from 'primevue/dialog';
  import PaymentIcon from '@/components/icons/payment.vue';
  import { usePopupStore } from '@/stores';
  import { toast } from 'vue3-toastify';

  const props = defineProps({
    isLoadPayment: Boolean,
  });
  const emit = defineEmits(['toggleLoadPayment', 'toggleOpenOrder']);
  const popupStore = usePopupStore();

  const lockScroll = () => (document.body.style.overflow = 'hidden');
  const unlockScroll = () => (document.body.style.overflow = 'auto');
  const toggleCancel = () => {
    popupStore.toggleLoadingPayment;
    popupStore.isCancelPayment = true;
    toast.success('You have successfully canceled your payment');
  };
  watch(
    () => props.isLoadPayment,
    (newVal) => {
      if (newVal) lockScroll();
      else unlockScroll();
    },
  );
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      :visible="popupStore.showLoadingPayment"
      :modal="true"
      :draggable="false"
      @update:visible="popupStore.toggleLoadingPayment"
      :closable="false"
      :style="{ width: '40rem' }"
    >
      <div class="p-8 text-base">
        <div class="space-y-4">
          <div class="flex justify-center"><PaymentIcon /></div>
          <div class="text-primary font-bold flex justify-center">Processing your payment…</div>
        </div>
      </div>
      <!-- <div class="flex justify-center cursor-pointer">
        <button @click="toggleCancel" class="text-primary">Cancel</button>
      </div> -->
    </Dialog>
  </div>
</template>
