<script setup>
  import { ref, watch, computed } from 'vue';
  import Dialog from 'primevue/dialog';
  import { createPayout } from '@/services/cashout';
  import { toast } from 'vue3-toastify';
  import { useUserStore } from '@/stores';
  import { formatNumber, formatPercentage, formatView } from '@/utils';
  import smallLoading from '@/components/icons/smallLoading.vue';

  const repInput = ref();
  const userStore = useUserStore();
  const isLoadingWithdraw = ref(false);
  const props = defineProps({
    isWithdrawVisible: Boolean,
    title: String,
    minWithdraw: String,
    exchangeRate: Number,
    clearInput: Boolean,
    systemConfigByKey: Number,
  });

  const emit = defineEmits([
    'toogleWithdrawVisible',
    'toogleProcessingPaymentVisible',
    'dataFromWithdraw',
  ]);
  const toogleWithdrawVisible = () => {
    emit('toogleWithdrawVisible');
  };

  const handleWithdrawAll = () => {
    repInput.value = userStore.user?.Channel.rep || 0;
  };

  const toogleProcessingPaymentVisible = async () => {
    if (!repInput || repInput.value < 2500) {
      toast.error(`You need to enter a REPs value greater than ${props.minWithdraw}.`);
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
      console.log(repInput.value);

      const res = await createPayout(repInput.value);
      console.log(res);
      console.log(repInput.value);

      if (res && res.status === 200) {
        emit('toogleProcessingPaymentVisible');
        emit('dataFromWithdraw', estimatedValue);
        toogleWithdrawVisible();

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
    return (repValue * props.systemConfigByKey * 0.015).toFixed(2);
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
      :visible="isWithdrawVisible"
      :modal="true"
      :draggable="false"
      :header="props.title"
      @update:visible="toogleWithdrawVisible"
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
            <div>Withdraw value</div>
            <div>(Estimated value ${{ formatNumber(estimatedValue) }})</div>
          </div>
          <div class="flex items-center gap-x-4">
            <div class="relative text-[14px] rounded-lg normal_password flex-1">
              <input
                type="number"
                required
                class="password_custom h-full"
                :placeholder="minWithdraw"
                v-model="repInput"
                :max="userStore.user?.Channel.rep"
              />
            </div>
            <div class="text-primary cursor-pointer" @click="handleWithdrawAll">Withdraw all</div>
          </div>
        </div>
        <div class="flex justify-end">
          <button @click="toogleProcessingPaymentVisible" class="btn w-[170px]">
            <smallLoading v-if="isLoadingWithdraw" fill="white" fill_second="#13d0b4" />
            <span v-else>Withdraw</span>
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
