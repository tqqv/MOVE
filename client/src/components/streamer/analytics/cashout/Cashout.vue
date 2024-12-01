<script setup>
  import ProgressBar from 'primevue/progressbar';
  import WithdrawPopup from './WithdrawPopup.vue';
  import { onMounted, ref } from 'vue';
  import ProcessingPaymentPopup from './ProcessingPaymentPopup.vue';
  import SelectBank from './SelectBank.vue';
  import BankDetails from './BankDetails.vue';
  import VerificationPopup from '@/components/popup/VerificationPopup.vue';
  import { useWithdrawInfor } from '@/stores/withdrawInfor.store';
  import { getLinkStripeVerify, removeWithdrawInfor, updateStripeVerify } from '@/services/cashout';
  import { useUserStore } from '@/stores';
  import { formatNumber, formatPercentage, formatView } from '@/utils';
  import Skeleton from 'primevue/skeleton';
  import CashoutRemovePopup from './CashoutRemovePopup.vue';
  import { RouterLink } from 'vue-router';
  import smallLoading from '@/components/icons/smallLoading.vue';

  const props = defineProps({
    reps: Number,
    estimatedValue: Number,
    nameCard: String,
  });
  const withdrawInforStore = useWithdrawInfor();

  const userStore = useUserStore();
  const exchangeRate = ref(0.005);
  const minWithdraw = ref(2500);
  const isRemoveVisible = ref(false);
  const isUpdateSuccessful = ref(false);
  const isWithdrawVisible = ref(false);
  const isProcessingPaymentVisible = ref(false);
  const isLoadingVerify = ref(false);
  // const isSelectBankVisible = ref(false);
  const isBankDetailsVisible = ref(false);
  const withdrawValue = ref();
  const tokenBank = ref();

  const handleDataFromWithdraw = (data) => {
    withdrawValue.value = data;
  };
  const handleDataTokenFromBankDetail = (data) => {
    tokenBank.value = data;
  };
  const toggleOpenRemove = async () => {
    isRemoveVisible.value = !isRemoveVisible.value;
  };

  const toggleCloseRemove = () => {
    isRemoveVisible.value = false;
  };
  const toogleCloseBankDetailsVisible = () => {
    isBankDetailsVisible.value = false;
  };

  const toogleBankDetailsVisible = () => {
    isBankDetailsVisible.value = !isBankDetailsVisible.value;
  };

  const toogleWithdrawVisible = () => {
    isWithdrawVisible.value = !isWithdrawVisible.value;
  };
  const toogleProcessingPaymentVisible = () => {
    isProcessingPaymentVisible.value = !isProcessingPaymentVisible.value;
  };

  const handleStripeVerify = async () => {
    isLoadingVerify.value = false;
    try {
      const res = await getLinkStripeVerify();
      if (res && res.status === 200) {
        window.open(res.data.data, '_self');
      }
    } catch (error) {
      console.error('Error during Stripe verification:', error);
    } finally {
      isLoadingVerify.value = true;
    }
  };

  onMounted(async () => {
    const urlParams = new URLSearchParams(window.location.search);

    await withdrawInforStore.fetchWithdrawInfor();
    const verifyStatus = urlParams.get('verify');

    if (verifyStatus === 'success') {
      try {
        const res = await updateStripeVerify();
        if (res && res.status === 200) {
          const baseUrl = window.location.origin;
          const redirectUrl = `${baseUrl}/dashboard-streamer/cashout`;

          window.location.href = redirectUrl;
        }
      } catch (error) {
        console.error('Error updating stripe verify:', error);
      }
      // await withdrawInforStore.fetchWithdrawInfor();
    }
  });
</script>
<template>
  <section class="container">
    <div class="flex justify-between pb-4">
      <h1 class="text_title">Cashout</h1>
    </div>
    <!-- <div v-if="!isUpdateSuccessful" class="flex justify-between pt-2">
      <h1 class="text_title">Cashout</h1>
    </div>
    <div v-else class="mt-8 mb-6 p-4 border-primary border-2 rounded-lg bg-[#E6FFFB] py-3">
      <span> Your bank information has been updated successfully.</span>
    </div> -->
    <!-- CARD -->
    <Skeleton
      v-if="withdrawInforStore.isLoadingWithdrawInfor"
      width="762px"
      height="15rem"
    ></Skeleton>

    <div v-else class="bg-white shadow-lg p-6 rounded-md text-black w-[762px]">
      <span class="text-lg font-bold whitespace-nowrap">Total REPs earned</span>
      <div class="space-y-2">
        <div class="flex gap-x-8 items-center">
          <div class="text-[30px] font-bold">
            {{ formatNumber(userStore.user?.Channel.rep) }} REPs
          </div>
          <div class="text-base">
            (Estimated value ${{ (userStore.user?.Channel.rep * exchangeRate).toFixed(2) }})
          </div>
        </div>
        <div class="card">
          <ProgressBar
            :value="
              userStore.user?.Channel.rep / minWithdraw >= 1
                ? 100
                : (userStore.user?.Channel.rep / minWithdraw) * 100
            "
          ></ProgressBar>
        </div>
        <div class="text-sm">
          You need to earn at least <span class="font-bold">{{ minWithdraw }} REPs</span> to
          withdraw.
        </div>
      </div>
      <div class="pt-8 space-y-4">
        <!-- HAVE INFO -->
        <div v-if="withdrawInforStore.withdrawInfor">
          <div
            v-if="withdrawInforStore.withdrawInfor.status !== 'verified'"
            class="text-sm text-[#C96868]"
          >
            Your account has not been verified
          </div>
          <div v-if="withdrawInforStore.withdrawInfor.status === 'verified'" class="flex gap-x-4">
            <span @click="toggleOpenRemove" class="text-[#E24848] cursor-pointer text-sm"
              >Remove</span
            >
          </div>
          <div class="flex items-center justify-between">
            <div class="space-y-2">
              <div class="text-[17px] font-bold">
                Bank transfer to **** {{ withdrawInforStore.withdrawInfor.bankNumber }}
              </div>

              <div class="text-base">{{ withdrawInforStore.withdrawInfor.bankHolderName }}</div>
            </div>
            <button
              v-if="withdrawInforStore.withdrawInfor.status === 'verified'"
              @click="toogleWithdrawVisible"
              class="btn"
              :class="userStore.user?.Channel.rep === 0 ? 'btn bg-[#ccc] ' : ''"
              :disabled="userStore.user?.Channel.rep === 0"
            >
              Withdraw
            </button>

            <button v-else @click="handleStripeVerify" class="btn bg-[#C96868] text-[#ffffff]">
              <smallLoading v-if="isLoadingVerify" fill="white" fill_second="#C96868" />
              <span v-else>Verify</span>
            </button>
          </div>
        </div>
        <!-- NO INFO -->
        <div v-else>
          <div @click="toogleBankDetailsVisible" class="text-sm text-primary cursor-pointer">
            Setup bank information
          </div>
          <div class="flex items-center justify-between">
            <div class="space-y-2">
              <div class="text-[17px] font-bold">No bank information available</div>
            </div>
            <button class="btn bg-[#707070] text-[#CCCCCC]">Withdraw</button>
          </div>
        </div>
      </div>
    </div>
  </section>
  <WithdrawPopup
    v-if="isWithdrawVisible"
    :isWithdrawVisible="isWithdrawVisible"
    title="Withdraw"
    @toogleWithdrawVisible="toogleWithdrawVisible"
    @toogleProcessingPaymentVisible="toogleProcessingPaymentVisible"
    @dataFromWithdraw="handleDataFromWithdraw"
    :minWithdraw="minWithdraw"
    :exchangeRate="exchangeRate"
    :clearInput="isWithdrawVisible"
  />
  <ProcessingPaymentPopup
    :isProcessingPaymentVisible="isProcessingPaymentVisible"
    title="Processing payment"
    @toogleProcessingPaymentVisible="toogleProcessingPaymentVisible"
    :withdrawValue="withdrawValue"
  />
  <!-- <SelectBank
    :isSelectBankVisible="isSelectBankVisible"
    @toogleSelectBankVisible="toogleSelectBankVisible"
    @toogleBankDetailsVisible="toogleBankDetailsVisible"
    title="I want to receive payment via"
  /> -->
  <BankDetails
    v-if="isBankDetailsVisible"
    title="Enter bank details"
    :isBankDetailsVisible="isBankDetailsVisible"
    @toogleBankDetailsVisible="toogleBankDetailsVisible"
    @toogleSelectBankVisible="toogleSelectBankVisible"
    @toogleCloseBankDetailsVisible="toogleCloseBankDetailsVisible"
    @handleDataTokenFromBankDetail="handleDataTokenFromBankDetail"
  />
  <CashoutRemovePopup
    title="Remove bank"
    :isRemoveVisible="isRemoveVisible"
    @closeRemove="toggleCloseRemove"
  />
  <VerificationPopup title="Save your bank information" :tokenBank="tokenBank" />
</template>
