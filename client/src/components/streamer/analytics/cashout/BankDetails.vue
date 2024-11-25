<script setup>
  import { ref, watch, computed } from 'vue';
  import Dialog from 'primevue/dialog';

  import Divider from 'primevue/divider';
  import CheckMarkCustom from '@/components/CheckMarkCustom.vue';
  import FormCardPayment from '@/components/FormCardPayment.vue';
  import { usePopupStore, useGetRepsStore, useUserStore } from '@/stores';
  import { useCardStore } from '@/stores/card.store';
  import { checkout, createCardInfo, getClientSecret } from '@/services/payment';
  import { paymentSchema } from '@/utils/vadilation';
import { createWithdrawInfor } from '@/services/cashout';
import { useWithdrawInfor } from '@/stores/withdrawInfor.store';

  const props = defineProps({
    title: String,
    isBankDetailsVisible: Boolean,
  });

  const popupStore = usePopupStore();
  const getRepsStore = useGetRepsStore();
  const cardStore = useCardStore();
  const userStore = useUserStore();
  const withdrawInforStore = useWithdrawInfor();


  const isValidRoutingNumber = ref(true);
  const bankData = ref({
    routingNumber: '',
    bankHolderName: '',
    bankNumber: '',
  })

  const errors = ref({
    bankName: '',
    bankAccountNumber: '',
    bankAddress: '',
    swiftCode: '',
    fullName: '',
    mobileNumber: '',
  });
  const cardForm = ref(null);

  const isCheckMark = ref(false);
  const emit = defineEmits(['toogleBankDetailsVisible', 'toogleSelectBankVisible']);
  const toogleBankDetailsVisible = () => {
    emit('toogleBankDetailsVisible');
  };
  const handleBack = () => {
    emit('toogleBankDetailsVisible');
    emit('toogleSelectBankVisible');
  };
  const handleNext = () => {
    emit('toogleBankDetailsVisible');

    popupStore.toggleVerificationPopup();
  };
  const validatePaymentData = async () => {
    try {
      await paymentSchema.validate(
        {
          cardName: cardForm.value.cardName,
          country: cardForm.value.country.name,
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
    let cleaned = bankData.value.routingNumber.replace(/\D/g, "");

    if (cleaned.length > 4) {
      cleaned = cleaned.slice(0, 4) + "-" + cleaned.slice(4, 7);
    }

    bankData.value.routingNumber = cleaned;

    const regex = /^\d{4}-\d{3}$/;
    isValidRoutingNumber.value = regex.test(bankData.value.routingNumber);
  };

  const handleSubmit = async() => {
    console.log(bankData.value.bankHolderName);

    if(!bankData.value.bankHolderName || !bankData.value.bankNumber || !bankData.value.routingNumber){
      console.log("abccc");

      return
    }

    const res = await createWithdrawInfor(bankData.value);
    if(res && res.status === 200) {
      // xử lý thành công ở đây
      await withdrawInforStore.fetchWithdrawInfor()
      console.log("success");

    }else {
      // log cái messages của cái ra
      console.log(res.message);
    }
  }
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      :visible="isBankDetailsVisible"
      :modal="true"
      :draggable="false"
      :header="props.title"
      @show="lockScroll"
      @hide="unlockScroll"
      @update:visible="toogleBankDetailsVisible()"
      :style="{ width: '40rem' }"
    >
      <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Row 1: Bank Name and Bank Account Name -->
        <div class="flex flex-col gap-y-2">
          <div class="flex flex-col">
            <label for="cardName" class="text_para">Bank Holder Name</label>
            <div
              class="relative text-[14px] rounded-lg flex-1"
              :class="errors.bankHolderName ? 'error_password' : 'normal_password'"
            >
              <input type="text" required class="password_custom h-full" v-model="bankData.bankHolderName"
                placeholder="Enter your bank holder name"
              />
            </div>
            <span v-if="errors.bankHolderName" class="error_message">{{ errors.bankHolderName }}</span>
          </div>
        </div>
        <div class="flex flex-col gap-y-2">
          <div class="flex flex-col">
            <label for="cardName" class="text_para">Bank account number</label>
            <div
              class="relative text-[14px] rounded-lg flex-1"
              :class="errors.bankAccountNumber ? 'error_password' : 'normal_password'"
            >
              <input type="text" required class="password_custom h-full" v-model="bankData.bankNumber"
                placeholder="Enter your bank account number"
              />
            </div>
            <span v-if="errors.bankAccountNumber" class="error_message">{{ errors.bankAccountNumber }}</span>
          </div>
        </div>


        <!-- Row 2: Card Number and Card Type -->

        <div class="flex flex-col gap-y-2">
          <div class="flex flex-col w-1/2">
            <label for="cardName" class="text_para">Bank code - Branch code</label>
            <div
              class="relative text-[14px] rounded-lg flex-1"
              :class="errors.swiftCode ? 'error_password' : 'normal_password'"
            >
              <input type="text" required class="password_custom h-full" v-model="bankData.routingNumber"
                placeholder="BankCode-BranchCode"
                :class="{'invalid': !isValidRoutingNumber}"
                @input="formatRoutingNumber"
              />
            </div>
            <span v-if="errors.swiftCode" class="error_message">{{ errors.swiftCode }}</span>
          </div>
        </div>
        <Divider class="w-full text-[#CCCCCC]" />
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
          <button @click="handleBack" class="text-primary w-1/3">Back</button>

          <button @click="handleSubmit" class="btn w-1/3">Submit</button>
        </div>
      </div>
    </Dialog>
  </div>
</template>
