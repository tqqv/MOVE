<script setup>
  import { ref, watch, computed } from 'vue';
  import Dialog from 'primevue/dialog';
  import { createExchange } from '@/services/cashout';
  import { toast } from 'vue3-toastify';
  import { useUserStore } from '@/stores';
  import { formatNumber, formatPercentage, formatView } from '@/utils';
  import smallLoading from '@/components/icons/smallLoading.vue';

  const repInput = ref();
  const userStore = useUserStore();
  const isLoadingWithdraw = ref(false);
  const props = defineProps({
    isExchangeVisible: Boolean,
    title: String,
    exchangeRate: Number,
    clearInput: Boolean,
    systemConfigByKey: Number,
  });

  const emit = defineEmits([
    'toogleExchangeVisible',
    'toogleProcessingPaymentVisible',
    'dataFromExchange',
  ]);
  const toogleExchangeVisible = () => {
    emit('toogleExchangeVisible');
  };

  const handleWithdrawAll = () => {
    repInput.value = userStore.user?.Channel.rep || 0;
  };

  const toogleProcessingPaymentVisible = async () => {
    if (!repInput || repInput.value < 100) {
      toast.error(`You need to enter a REPs value greater than 100.`);
      return;
    }
    if (
      !repInput.value ||
      isNaN(repInput.value) ||
      repInput.value <= 0 ||
      !Number.isInteger(+repInput.value)
    ) {
      toast.error('Please enter a valid integer value.');
      return;
    }
    isLoadingWithdraw.value = true;

    try {
      const res = await createExchange(repInput.value);

      if (res && res.status === 200) {
        emit('dataFromExchange', estimatedValue);
        toogleExchangeVisible();
        toast.success('Exchange REPs Channel Wallet to User Wallet successful');
        await userStore.fetchUserProfile();
      } else {
        console.error(res.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      isLoadingWithdraw.value = false;
    }
  };

  const estimatedValue = computed(() => {
    const repValue = parseFloat(repInput.value) || 0;
    return Math.round(repValue * props.systemConfigByKey);
  });
  watch(repInput, (newValue) => {
    const maxRep = userStore.user?.Channel.rep || 0;
    if (newValue > maxRep) {
      repInput.value = maxRep;
    }
  });
  watch(
    () => props.clearInput,
    (newValue) => {
      if (newValue) {
        repInput.value = '';
      }
    },
  );
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      :visible="isExchangeVisible"
      :modal="true"
      :draggable="false"
      :header="props.title"
      @update:visible="toogleExchangeVisible"
      :style="{ width: '40rem' }"
    >
      <div class="text-black space-y-4">
        <div>
          <div class="text-base font-bold">Remaining amount:</div>
          <div class="text-[32px] font-bold">
            {{ formatNumber(userStore.user?.Channel.rep) }} REPs
          </div>
        </div>
        <div class="flex flex-col text-base w-2/3">
          <div class="flex gap-x-2 pb-2">
            <div>REPs value</div>
            <div>(Estimated received {{ formatNumber(estimatedValue) }} REPS)</div>
          </div>
          <div class="flex items-center gap-x-4">
            <div class="relative text-[14px] rounded-lg normal_password flex-1">
              <input
                type="number"
                required
                class="password_custom h-full"
                v-model="repInput"
                :max="userStore.user?.Channel.rep"
              />
            </div>
            <div class="text-primary cursor-pointer" @click="handleWithdrawAll">Exchange all</div>
          </div>
        </div>
        <div class="flex justify-end">
          <button @click="toogleProcessingPaymentVisible" class="btn w-[170px]">
            <smallLoading v-if="isLoadingWithdraw" fill="white" fill_second="#13d0b4" />
            <span v-else>Exchange</span>
          </button>
        </div>
      </div>
    </Dialog>
  </div>
</template>
<style>
  /* Ẩn nút tăng giảm trên các trình duyệt khác nhau */
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield; /* Dành cho Firefox */
  }
</style>
