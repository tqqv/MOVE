<script setup>
  import { ref, watch, computed, onMounted } from 'vue';
  import Dialog from 'primevue/dialog';

  import Divider from 'primevue/divider';
  import CheckMarkCustom from '@/components/CheckMarkCustom.vue';
  import FormCardPayment from '@/components/FormCardPayment.vue';
  import { usePopupStore, useGetRepsStore, useUserStore } from '@/stores';
  import { useCardStore } from '@/stores/card.store';
  import { checkout, createCardInfo, getClientSecret } from '@/services/payment';
  import { cashoutSchema, paymentSchema } from '@/utils/vadilation';
  import { createWithdrawInfor, sendMail } from '@/services/cashout';

  import { useWithdrawInfor } from '@/stores/withdrawInfor.store';
  import smallLoading from '@/components/icons/smallLoading.vue';
  import { toast } from 'vue3-toastify';
  import { loadStripe } from '@stripe/stripe-js';

  const props = defineProps({
    title: String,
    isBankDetailsVisible: Boolean,
  });

  const popupStore = usePopupStore();
  const getRepsStore = useGetRepsStore();
  const cardStore = useCardStore();
  const userStore = useUserStore();
  const withdrawInforStore = useWithdrawInfor();
  const isLoadingBankDetail = ref(false);
  const isSubmitting = ref(false);
  const isValidRoutingNumber = ref(true);
  // const bankToken = ref();
  const bankData = ref({
    routingNumber: '',
    bankHolderName: '',
    bankNumber: '',
  });

  const errors = ref({
    routingNumber: '',
    bankHolderName: '',
    bankNumber: '',
  });
  const resetForm = () => {
    bankData.value = {
      routingNumber: '',
      bankHolderName: '',
      bankNumber: '',
    };
    errors.value = {
      routingNumber: '',
      bankHolderName: '',
      bankNumber: '',
    };
  };

  const stripe = ref();

  onMounted(async () => {
    stripe.value = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  });

  const emit = defineEmits([
    'toogleBankDetailsVisible',
    'toogleSelectBankVisible',
    'toogleCloseBankDetailsVisible',
    'handleDataTokenFromBankDetail',
  ]);
  const toogleBankDetailsVisible = () => {
    emit('toogleBankDetailsVisible');
    resetForm();
  };

  const validatePaymentData = async () => {
    try {
      await cashoutSchema.validate(
        {
          bankHolderName: bankData.value.bankHolderName,
          bankNumber: bankData.value.bankNumber,
          routingNumber: bankData.value.routingNumber,
        },
        { abortEarly: false },
      );
      errors.value = {};
      return true;
    } catch (validationErrors) {
      const validationResult = {};
      validationErrors.inner.forEach((error) => {
        validationResult[error.path] = error.message;
      });
      errors.value = validationResult;

      return false;
    }
  };

  const formatRoutingNumber = () => {
    let cleaned = bankData.value.routingNumber.replace(/\D/g, '');

    if (cleaned.length > 4) {
      cleaned = cleaned.slice(0, 4) + '-' + cleaned.slice(4, 7);
    }

    bankData.value.routingNumber = cleaned;

    const regex = /^\d{4}-\d{3}$/;
    isValidRoutingNumber.value = regex.test(bankData.value.routingNumber);
  };

  const handleSubmit = async () => {
    if (isSubmitting.value) return;
    isSubmitting.value = false;
    isLoadingBankDetail.value = true;

    try {
      const isValid = await validatePaymentData();

      if (!isValid) {
        isLoadingBankDetail.value = false;
        return;
      }

      // Create bank account token
      const result = await stripe.value.createToken('bank_account', {
        country: 'SG',
        currency: 'sgd',
        account_holder_name: bankData.value.bankHolderName,
        routing_number: bankData.value.routingNumber, // Routing number giả cho test
        account_number: bankData.value.bankNumber,
      });

      if (result.error) {
        console.log(result.error.message);
        toast.error('Bank info does not exist. Please check your information again.');
      } else {
        popupStore.showVerificationPopup = true;

        emit('toogleCloseBankDetailsVisible');
        resetForm();
        emit('handleDataTokenFromBankDetail', result.token.id);

        const res = await sendMail();
        console.log(res);
      }

      // const res = await createWithdrawInfor(bankData.value);

      // if (res && res.status === 200) {
      //   await withdrawInforStore.fetchWithdrawInfor();
      //   emit('toogleCloseBankDetailsVisible');
      //   resetForm();
      // } else {
      //   toast.error('Bank info does not exist. Please check your information again.');
      // }
    } catch (error) {
      console.error('Error during submission:', error);
    } finally {
      isLoadingBankDetail.value = false;
    }
  };
  const validateField = async (field) => {
    try {
      if (field === 'bankHolderName' && !bankData.value.bankHolderName) return;
      if (field === 'bankNumber' && !bankData.value.bankNumber) return;
      if (field === 'routingNumber' && !bankData.value.routingNumber) return;

      if (field === 'bankHolderName') {
        await cashoutSchema.validateAt('bankHolderName', {
          bankHolderName: bankData.value.bankHolderName,
        });
        errors.value.bankHolderName = '';
      } else if (field === 'bankNumber') {
        await cashoutSchema.validateAt('bankNumber', {
          bankNumber: bankData.value.bankNumber,
        });
        errors.value.bankNumber = '';
      } else if (field === 'routingNumber') {
        await cashoutSchema.validateAt('routingNumber', {
          routingNumber: bankData.value.routingNumber,
        });
        errors.value.routingNumber = '';
      }
    } catch (validationError) {
      if (field === 'bankHolderName') {
        errors.value.bankHolderName = validationError.message;
      } else if (field === 'bankNumber') {
        errors.value.bankNumber = validationError.message;
      } else if (field === 'routingNumber') {
        errors.value.routingNumber = validationError.message;
      }
    }
  };
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      :visible="isBankDetailsVisible"
      :modal="true"
      :draggable="false"
      :header="props.title"
      @update:visible="toogleBankDetailsVisible()"
      :style="{ width: '40rem' }"
    >
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Row 1: Bank Name and Bank Account Name -->
        <div class="flex flex-col gap-y-2">
          <div class="flex flex-col">
            <label for="cardName" class="text_para pb-2">Bank Holder Name</label>
            <div
              class="relative text-[14px] rounded-lg flex-1"
              :class="errors.bankHolderName ? 'error_password' : 'normal_password'"
            >
              <input
                type="text"
                required
                class="password_custom h-full"
                v-model="bankData.bankHolderName"
                @input="bankData.bankHolderName = bankData.bankHolderName.toUpperCase()"
                placeholder="Enter your bank holder name"
                @blur="validateField('bankHolderName')"
                maxlength="50"
              />
            </div>
            <span v-if="errors.bankHolderName" class="error_message">{{
              errors.bankHolderName
            }}</span>
          </div>
        </div>
        <div class="flex flex-col gap-y-2">
          <div class="flex flex-col">
            <label for="cardName" class="text_para pb-2">Bank Account Number</label>
            <div
              class="relative text-[14px] rounded-lg flex-1"
              :class="errors.bankNumber ? 'error_password' : 'normal_password'"
            >
              <input
                type="text"
                required
                class="password_custom h-full"
                v-model="bankData.bankNumber"
                placeholder="Enter your bank account number"
                @blur="validateField('bankNumber')"
                maxlength="16"
              />
            </div>
            <span v-if="errors.bankNumber" class="error_message">{{ errors.bankNumber }}</span>
          </div>
        </div>

        <!-- Row 2: Card Number and Card Type -->

        <div class="flex flex-col gap-y-2">
          <div class="flex flex-col w-1/2">
            <label for="cardName" class="text_para pb-2">Bank Code - Branch Code</label>
            <div
              class="relative text-[14px] rounded-lg flex-1"
              :class="errors.routingNumber ? 'error_password' : 'normal_password'"
            >
              <input
                type="text"
                required
                class="password_custom h-full"
                v-model="bankData.routingNumber"
                placeholder="BankCode-BranchCode"
                :class="{ invalid: !isValidRoutingNumber }"
                @input="formatRoutingNumber"
                @blur="validateField('routingNumber')"
              />
            </div>
            <span v-if="errors.routingNumber" class="error_message">{{
              errors.routingNumber
            }}</span>
          </div>
        </div>
      </form>
      <div class="space-y-4 pt-8">
        <div class="text-xs">
          <span class="text-[#777777]">
            By submitting payment information you acknowledge that you have read, understood and
            agree to be bound by MOVE’s
          </span>
          <span class="text-primary"> End User License Agreement, Privacy Policy</span>
          <span class="text-[#777777]"> and</span>
          <span class="text-primary"> Refund Policy</span>.
        </div>
        <!-- <CheckMarkCustom
          label="Save my payment details for faster checkout in the future."
          :checked="isCheckMark"
          groupName="checkMark"
          @update:modelValue="(value) => (isCheckMark = value)"
        /> -->
        <div class="flex justify-end py-4">
          <button @click="handleSubmit" class="btn w-1/3" :disabled="isSubmitting">
            <smallLoading v-if="isLoadingBankDetail" fill="white" fill_second="#13d0b4" />
            <span v-else>Submit</span>
          </button>
        </div>
      </div>
    </Dialog>
  </div>
</template>
