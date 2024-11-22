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
  import smallLoading from '@/components/icons/smallLoading.vue';

  const props = defineProps({
    title: String,
    isFirstTime: Boolean,
  });

  const currentDate = computed(() => {
    const date = new Date();
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  });

  const popupStore = usePopupStore();
  const getRepsStore = useGetRepsStore();
  const cardStore = useCardStore();
  const userStore = useUserStore();
  const errors = ref();
  const isLoandingSubmit = ref(false);

  const cardForm = ref(null);

  const isCheckMark = ref(false);
  const emit = defineEmits(['toggleOpenOrder']);

  const setupIntentClientSecret = async () => {
    const res = await getClientSecret();
    if (res) {
      return res.data.data;
    } else {
      console.error('Get Client Secret failed');
      return;
    }
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
  const handleSaveCard = async () => {
    if (!cardForm.value || !cardForm.value.stripe) {
      return;
    }

    const { stripe, elements, cardNumber, cardExpiry, cardCvc, cardName, country, isComplete } =
      cardForm.value;

    const clientSecret = await setupIntentClientSecret();

    try {
      const confirm = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardNumber,
          billing_details: { name: cardName },
        },
      });

      if (confirm) {
        const data = {
          cardName,
          paymentMethodId: confirm.setupIntent.payment_method,
          country: country.name,
        };

        const res = await createCardInfo(data);

        if (res && res.status === 200) {
          cardStore.fetchCard();
        } else {
        }
      } else {
        console.error('Error: Confirmation failed');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleUseCardOneTime = async () => {
    if (!cardForm.value || !cardForm.value.stripe) {
      console.error('cardForm or Stripe is undefined');
      return;
    }

    const { cardNumber, cardName, stripe, country, isComplete } = cardForm.value;

    try {
      const paymentMethod = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumber, // cardNumber ở đây phải là một đối tượng Stripe Card từ frontend, không phải chuỗi số thẻ trực tiếp
        billing_details: { name: cardName },
      });

      return paymentMethod.paymentMethod.id;
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleCheckout = async (paymentMethodId) => {
    try {
      // Thiết lập data cho checkout
      const dataCheckout = {
        paymentMethodId: paymentMethodId,
        repPackageId: getRepsStore.selectedOption?.id,
      };

      //  hiển thị popup loading
      popupStore.showLoadingPayment = true;
      popupStore.showOpenBuyREPs = false;
      //cancel
      if (popupStore.isCancelPayment) return;
      const res = await checkout(dataCheckout);

      // Kiểm tra kết quả trả về từ API
      if (res && res.status === 200) {
        userStore.user.REPs += getRepsStore.selectedOption?.rep;
        // console.log('Payment successful.');
        emit('toggleOpenOrder'); // Hiện popup "Order Success"
        popupStore.isOrderSuccessful = true;
      } else if (res.status === 201) {
        // console.log('Payment has been initiated, please wait.');
        emit('toggleOpenOrder'); // Hiện popup "Order Pending"
      } else {
        // console.log('Payment failed!');
        emit('toggleOpenOrder'); // Hiện popup "Payment Failed"
        popupStore.isOrderSuccessful = false;
      }
    } catch (error) {
      console.error('Error during checkout:', error.message);
      emit('toggleOpenOrder');
    } finally {
      popupStore.showLoadingPayment = false;
    }
  };

  const toggleLoadPayment = async () => {
    isLoandingSubmit.value = true;

    const isValid = await validatePaymentData();
    const { cardNumber, cardName, stripe, country, isComplete } = cardForm.value;

    if (isCheckMark.value) {
      if (!isComplete || !isValid) {
        isLoandingSubmit.value = false;

        return;
      }
      await handleSaveCard();
      await cardStore.fetchCard();

      if (!cardStore.card?.paymentMethodId) {
        console.error('paymentMethodId not found after saving card.');
        isLoandingSubmit.value = false;

        return;
      }
      await handleCheckout(cardStore.card?.paymentMethodId);
    } else {
      const paymentMethodId = await handleUseCardOneTime();

      if (!isComplete || !isValid) {
        isLoandingSubmit.value = false;

        return;
      }
      await handleCheckout(paymentMethodId);
    }

    // Đảm bảo ẩn popup loading sau khi thanh toán
    popupStore.showLoadingPayment = false;
    popupStore.showOpenBuyREPs = false;
  };

  const toggleBuyREPs = () => {
    popupStore.showOpenBuyREPs = !popupStore.showOpenBuyREPs;
    getRepsStore.clearSelectedOption();
    errors.value = '';
  };
  watch(
    () => cardStore.card,
    (newCard) => {
      if (!newCard) {
      }
    },
  );
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      :visible="popupStore.showOpenBuyREPs"
      :modal="true"
      :draggable="false"
      :header="props.title"
      @show="lockScroll"
      @hide="unlockScroll"
      @update:visible="toggleBuyREPs"
      :style="{ width: '40rem' }"
    >
      <div class="space-y-4">
        <div class="text-base text-[#666666] font-bold">Order Summary</div>
        <div class="flex justify-between">
          <div class="font-bold text-base">{{ getRepsStore.selectedOption?.rep }} REP$</div>
          <div class="text-base">US${{ getRepsStore.selectedOption?.amount }}</div>
        </div>
      </div>
      <div v-if="isFirstTime" class="text-sm text-[#777777]">
        One-time charge on {{ currentDate }}.
      </div>
      <Divider />
      <div class="flex gap-x-6 justify-end">
        <div>Total</div>
        <div class="text-base font-bold">US${{ getRepsStore.selectedOption?.amount }}</div>
      </div>

      <div class="space-y-4">
        <div class="text-base text-[#666666] font-bold">Payment Details</div>

        <FormCardPayment ref="cardForm" :errors="errors" />

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
        <div class="flex justify-center mt-4">
          <button @click="toggleLoadPayment" class="btn w-1/3">
            <smallLoading v-if="isLoandingSubmit" fill="white" fill_second="#13d0b4" />
            <span v-else>Submit</span>
          </button>
        </div>
      </div>
    </Dialog>
  </div>
</template>
