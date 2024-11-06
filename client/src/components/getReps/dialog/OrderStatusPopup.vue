<script setup>
  import { watch, computed } from 'vue';
  import Dialog from 'primevue/dialog';

  const props = defineProps({
    isOpenOrder: Boolean,
    money: Number,
    reps: Number,
    isOrderSuccessful: Boolean,
  });

  const emit = defineEmits(['toggleOrder']);

  const title = computed(() => (props.isOrderSuccessful ? 'Order success' : 'Order failed'));
  const description = computed(() =>
    props.isOrderSuccessful
      ? 'Thank you for completing the transaction! Your REPs have been successfully added to your account. If you have any questions or need further assistance, please contact us.'
      : 'Sorry, your transaction was unsuccessful. Please check your payment information or try again later. If you need assistance, please contact us for help.',
  );

  const lockScroll = () => (document.body.style.overflow = 'hidden');
  const unlockScroll = () => (document.body.style.overflow = 'auto');

  const closeOrder = () => {
    emit('toggleOrder');
  };

  watch(
    () => props.isOpenOrder,
    (newVal) => {
      if (newVal) lockScroll();
      else unlockScroll();
    },
  );
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      :visible="isOpenOrder"
      :modal="true"
      :draggable="false"
      :header="title"
      @show="lockScroll"
      @hide="unlockScroll"
      @update:visible="closeOrder"
      :style="{ width: '40rem' }"
    >
      <div class="space-y-6">
        <!-- Order Status Message -->
        <div class="text-base text-[#666666] font-bold">
          <template v-if="isOrderSuccessful">
            Your purchase of {{ reps }} REPs is successful!
          </template>
          <template v-else> Your purchase of {{ reps }} REPs was not successful! </template>
        </div>

        <!-- Description -->
        <div class="text-xs">
          <span class="text-[#777777]">
            {{ description }}
          </span>
        </div>

        <!-- Button -->
        <div class="flex justify-center">
          <button @click="closeOrder" class="btn w-1/3">Okay</button>
        </div>
      </div>
    </Dialog>
  </div>
</template>
