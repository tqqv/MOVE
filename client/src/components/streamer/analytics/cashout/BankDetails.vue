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

  const props = defineProps({
    title: String,
    isBankDetailsVisible: Boolean,
  });

  const popupStore = usePopupStore();
  const getRepsStore = useGetRepsStore();
  const cardStore = useCardStore();
  const userStore = useUserStore();
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
        <div class="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-3">
          <!-- Row 1: Bank Name and Bank Account Name -->
          <div class="flex flex-col gap-y-2">
            <div class="flex flex-col">
              <label for="cardName" class="text_para">Bank Name</label>
              <div
                class="relative text-[14px] rounded-lg flex-1"
                :class="errors.bankName ? 'error_password' : 'normal_password'"
              >
                <input type="text" required class="password_custom h-full" v-model="cardName"
                placeholder="Enter your card name"
              </div>
              <span v-if="errors.cardName" class="error_message">{{ errors.cardName }}</span>
            </div>
          </div>

          <div class="flex flex-col gap-y-2">
            <div class="flex flex-col">
              <label for="cardName" class="text_para">Bank account number</label>
              <div
                class="relative text-[14px] rounded-lg flex-1"
                :class="errors.bankAccountNumber ? 'error_password' : 'normal_password'"
              >
                <input
                  type="text"
                  required
                  class="password_custom h-full"
                  v-model="cardName"
                  placeholder="Enter your card name"
                />
              </div>
              <span v-if="errors.bankAccountNumber" class="error_message">{{
                errors.bankAccountNumber
              }}</span>
            </div>
          </div>
        </div>
        <!-- Row 2: Card Number and Card Type -->

        <div class="flex flex-col gap-y-2">
          <div class="flex flex-col">
            <label for="cardName" class="text_para">Bank Address</label>
            <div
              class="relative text-[14px] rounded-lg flex-1"
              :class="errors.bankAddress ? 'error_password' : 'normal_password'"
            >
              <input type="text" required class="password_custom h-full" v-model="bankAddress"
              placeholder="Enter your card name"
            </div>
            <span v-if="errors.bankAddress" class="error_message">{{ errors.bankAddress }}</span>
          </div>
        </div>
        <!-- Row 2: Card Number and Card Type -->

        <div class="flex flex-col gap-y-2">
          <div class="flex flex-col w-1/2">
            <label for="cardName" class="text_para">SWIFT Code</label>
            <div
              class="relative text-[14px] rounded-lg flex-1"
              :class="errors.swiftCode ? 'error_password' : 'normal_password'"
            >
              <input type="text" required class="password_custom h-full" v-model="swiftCode"
              placeholder="Enter your card name"
            </div>
            <span v-if="errors.swiftCode" class="error_message">{{ errors.swiftCode }}</span>
          </div>
        </div>
        <Divider class="w-full text-[#CCCCCC]" />
        <!-- Row 3: FullName -->
        <div class="flex flex-col">
          <div class="flex flex-col">
            <label for="cardName" class="text_para">Full name</label>
            <div
              class="relative text-[14px] rounded-lg flex-1"
              :class="errors.fullName ? 'error_password' : 'normal_password'"
            >
              <input type="text" required class="password_custom h-full" v-model="fullName"
              placeholder="Enter your card name"
            </div>
            <span v-if="errors.fullName" class="error_message">{{ errors.fullName }}</span>
          </div>
        </div>
        <!-- Row 3: Mobile number -->
        <div class="flex flex-col">
          <div class="flex flex-col">
            <label for="cardName" class="text_para">Mobile number</label>
            <div
              class="relative text-[14px] rounded-lg flex-1"
              :class="errors.mobileNumber ? 'error_password' : 'normal_password'"
            >
              <input type="text" required class="password_custom h-full" v-model="mobileNumber"
              placeholder="Enter your card name"
            </div>
            <span v-if="errors.mobileNumber" class="error_message">{{ errors.mobileNumber }}</span>
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
        <CheckMarkCustom
          label="Save my payment details for faster checkout in the future."
          :checked="isCheckMark"
          groupName="checkMark"
          @update:modelValue="(value) => (isCheckMark = value)"
        />
        <div class="flex justify-end py-4">
          <button @click="handleBack" class="text-primary w-1/3">Back</button>

          <button @click="handleNext" class="btn w-1/3">Next</button>
        </div>
      </div>
    </Dialog>
  </div>
</template>
