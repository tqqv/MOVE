<script setup>
  import ProgressBar from 'primevue/progressbar';
  import WithdrawPopup from './WithdrawPopup.vue';
  import { onMounted, ref } from 'vue';
  import ProcessingPaymentPopup from './ProcessingPaymentPopup.vue';
  import SelectBank from './SelectBank.vue';
  import BankDetails from './BankDetails.vue';
  import VerificationPopup from '@/components/popup/VerificationPopup.vue';
import { useWithdrawInfor } from '@/stores/withdrawInfor.store';
import { getLinkStripeVerify } from '@/services/cashout';

  const props = defineProps({
    reps: Number,
    estimatedValue: Number,
    nameCard: String,
  });
  const withdrawInforStore = useWithdrawInfor();

  onMounted(async() => {
    await withdrawInforStore.fetchWithdrawInfor()
  })

  const hasInfo = ref(false);
  const isUpdateSuccessful = ref(false);
  const isWithdrawVisible = ref(false);
  const isProcessingPaymentVisible = ref(false);
  const isSelectBankVisible = ref(false);
  const isBankDetailsVisible = ref(false);
  const toogleBankDetailsVisible = () => {
    isBankDetailsVisible.value = !isBankDetailsVisible.value;
  };
  const toogleSelectBankVisible = () => {
    isSelectBankVisible.value = !isSelectBankVisible.value;
  };
  const toogleWithdrawVisible = () => {
    isWithdrawVisible.value = !isWithdrawVisible.value;
  };
  const toogleProcessingPaymentVisible = () => {
    isProcessingPaymentVisible.value = !isProcessingPaymentVisible.value;
  };

  const handleStripeVerify = async() => {
    const res = await getLinkStripeVerify();
    if(res && res.status === 200) {
      window.open(res.data.data, '_self');
    }
  }
</script>
<template>
  <div class="container">
    <div v-if="!isUpdateSuccessful" class="flex justify-between pt-2">
      <h1 class="py-8 px-4 font-bold text-[24px]">Cashout</h1>
    </div>
    <div v-else class="mt-8 mb-2 p-4 border-primary border-2 rounded-lg bg-[#E6FFFB] py-3">
      <span> Your bank information has been updated successfully.</span>
    </div>
    <!-- CARD -->
    <div class="bg-white shadow-lg p-6 rounded-md text-black w-[762px]">
      <span class="text-lg font-bold whitespace-nowrap">Total REPs earned</span>
      <div class="space-y-2">
        <div class="flex gap-x-8 items-center">
          <div class="text-[32px] font-bold">{{ reps || 1000 }} REPs</div>
          <div class="text-base">(Estimated value ${{ estimatedValue || 64.0 }})</div>
        </div>
        <div class="card">
          <ProgressBar :value="50"></ProgressBar>
        </div>
        <div class="text-sm">
          You need to earn at least <span class="font-bold">2500 REPs</span> to withdraw.
        </div>
      </div>
      <div class="pt-8 space-y-4">
        <!-- HAVE INFO -->
        <div v-if="withdrawInforStore.withdrawInfor">
          <div v-if="withdrawInforStore.withdrawInfor.status !== 'verified'" class="text-sm text-[#C96868]">Your account has not been verified</div>
          <div class="flex items-center justify-between">
            <div class="space-y-2">
              <div class="text-[17px] font-bold">Bank transfer to **** {{ withdrawInforStore.withdrawInfor.bankNumber }}</div>
              <div class="text-base">{{ withdrawInforStore.withdrawInfor.bankHolderName }}</div>
            </div>
            <button v-if="withdrawInforStore.withdrawInfor.status === 'verified'" @click="toogleWithdrawVisible" class="btn">Withdraw</button>
            <button v-else @click="handleStripeVerify" class="btn bg-[#C96868] text-[#ffffff]">Verify</button>

          </div>
        </div>

        <!-- NO INFO -->
        <div v-else>
          <div @click="toogleSelectBankVisible" class="text-sm text-primary cursor-pointer">
            Setup bank information
          </div>
          <div class="flex items-center justify-between">
            <div class="space-y-2">
              <div class="text-[17px] font-bold">No bank information available</div>
            </div>
            <button @click="" class="btn bg-[#707070] text-[#CCCCCC]">Withdraw</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <WithdrawPopup
    :isWithdrawVisible="isWithdrawVisible"
    title="Withdraw"
    @toogleWithdrawVisible="toogleWithdrawVisible"
    @toogleProcessingPaymentVisible="toogleProcessingPaymentVisible"
  />
  <ProcessingPaymentPopup
    :isProcessingPaymentVisible="isProcessingPaymentVisible"
    title="Processing payment"
    @toogleProcessingPaymentVisible="toogleProcessingPaymentVisible"
  />
  <SelectBank
    :isSelectBankVisible="isSelectBankVisible"
    @toogleSelectBankVisible="toogleSelectBankVisible"
    @toogleBankDetailsVisible="toogleBankDetailsVisible"
    title="I want to receive payment via"
  />
  <BankDetails
    title="Enter bank details"
    :isBankDetailsVisible="isBankDetailsVisible"
    @toogleBankDetailsVisible="toogleBankDetailsVisible"
    @toogleSelectBankVisible="toogleSelectBankVisible"
  />
  <VerificationPopup />
</template>
