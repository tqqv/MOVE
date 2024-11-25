<script setup>
  import { ref, onMounted, watch } from 'vue';
  import Dialog from 'primevue/dialog';
import { createPayout } from '@/services/cashout';
import { toast } from 'vue3-toastify';

  const props = defineProps({
    isWithdrawVisible: Boolean,
    title: String,
  });
  const emit = defineEmits(['toogleWithdrawVisible', 'toogleProcessingPaymentVisible']);
  const toogleWithdrawVisible = () => {
    emit('toogleWithdrawVisible');
  };

  const repInput = ref();

  const toogleProcessingPaymentVisible = async() => {
    const res = await createPayout(repInput.value);

    if(res && res.status === 200) {
      emit('toogleProcessingPaymentVisible');
      emit('toogleWithdrawVisible');
    }else {
      toast.error(res.message)
    }
  };
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
          <div class="text-[32px] font-bold">{{ reps || 1000 }} REPs</div>
        </div>
        <div class="flex flex-col text-base w-2/3">
          <div class="flex gap-x-4 pb-2">
            <div>Withdraw value</div>
            <div>(Estimated value ${{ estimatedValue || 64.0 }})</div>
          </div>
          <div class="flex items-center gap-x-4">
            <div class="relative text-[14px] rounded-lg normal_password flex-1">
              <input
                type="text"
                required
                class="password_custom h-full"
                placeholder="2500"
                v-model="repInput"
              />
            </div>
            <div class="text-primary cursor-pointer">Withdraw all</div>
          </div>
        </div>
        <div class="flex justify-end">
          <button @click="toogleProcessingPaymentVisible" class="btn w-[170px]">Withdraw</button>
        </div>
      </div>
    </Dialog>
  </div>
</template>
