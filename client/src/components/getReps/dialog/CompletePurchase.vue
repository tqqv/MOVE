<script setup>
  import { ref, watch, computed } from 'vue';
  import Dialog from 'primevue/dialog';
  import VisaIcon from '@components/icons/visa.vue';
  import MasterCardIcon from '@components/icons/mastercard.vue';
  import Divider from 'primevue/divider';
  import CheckMarkCustom from '@/components/CheckMarkCustom.vue';
  import FormCardPayment from '@/components/FormCardPayment.vue';
  import { usePopupStore, useGetRepsStore, useUserStore } from '@/stores';
  import { useCardStore } from '@/stores/card.store';
  import { checkout, createCardInfo, getClientSecret } from '@/services/payment';
  import { paymentSchema } from '@/utils/vadilation';
  import smallLoading from '@/components/icons/smallLoading.vue';
  import { toast } from 'vue3-toastify';

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
  const isLoadingSubmit = ref(false);
  const showPaymentOnceTime = ref(false);
  const cardForm = ref(null);
  const isSubmitting = ref(false);
  const isCheckMark = ref(false);
  const emit = defineEmits(['toggleOpenOrder']);

  const togglePaymentOnceTime = () => {
    showPaymentOnceTime.value = !showPaymentOnceTime.value;
  };
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

      if (confirm.setupIntent) {
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
        toast.error(confirm.error.message);
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

    const { stripe, elements, cardNumber, cardExpiry, cardCvc, cardName, country, isComplete } =
      cardForm.value;

    try {
      const paymentMethod = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumber, // cardNumber ở đây phải là một đối tượng Stripe Card từ frontend, không phải chuỗi số thẻ trực tiếp
        billing_details: { name: cardName },
      });

      return paymentMethod.paymentMethod?.id;
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleCheckout = async (paymentMethodId) => {
    isLoadingSubmit.value = true;
    try {
      // Thiết lập data cho checkout
      const dataCheckout = {
        paymentMethodId: paymentMethodId,
        repPackageId: getRepsStore.selectedOption?.id,
      };

      //  hiển thị popup loading
      popupStore.showLoadingPayment = true;
      popupStore.showOpenBuyREPs = false;
      popupStore.isCompletePurchaseVisible = false;
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
        toast.error(res.message)
      }
    } catch (error) {
      console.error('Error during checkout:', error.message);
      emit('toggleOpenOrder');
    } finally {
      isLoadingSubmit.value = false;

      popupStore.showLoadingPayment = false;
    }
  };

  const toggleLoadPayment = async () => {
    if (isSubmitting.value) return;
    isSubmitting.value = true;
    isLoadingSubmit.value = true;
    try {
      if (cardStore.card) {
        await handleCheckout(cardStore.card.paymentMethodId); // Checkout nếu đã có thẻ
      } else {
        const isValid = await validatePaymentData();
        const { stripe, cardNumber, cardName } = cardForm.value;

        // if (!isValid) return;

        if (isCheckMark.value) {
          await handleSaveCard();
          await cardStore.fetchCard();

          if (!cardStore.card?.paymentMethodId) {
            console.error('paymentMethodId not found after saving card.');
            return;
          }
          await handleCheckout(cardStore.card.paymentMethodId);
        } else {
          const paymentMethodId = await handleUseCardOneTime();
          if (!paymentMethodId) {
            console.error('Error: PaymentMethodId not generated.');
            return;
          }
          await handleCheckout(paymentMethodId);
        }
      }
    } catch (error) {
      console.error('Error in toggleLoadPayment:', error.message);
    } finally {
      isLoadingSubmit.value = false;
      isSubmitting.value = false;
      popupStore.showLoadingPayment = false;
      popupStore.showOpenBuyREPs = false;
    }
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
      :visible="popupStore.isCompletePurchaseVisible"
      :modal="true"
      :draggable="false"
      :header="props.title"
      @show="lockScroll"
      @hide="unlockScroll"
      @update:visible="popupStore.toggleCompletePurchaseVisible"
      :style="{ width: '40rem' }"
    >
      <div class="space-y-4">
        <div class="text-base text-[#666666] font-bold">Order Summary</div>
        <div class="flex justify-between">
          <div class="font-bold text-base">{{ getRepsStore.selectedOption?.rep }} REP$</div>
          <div class="text-base">
            US$
            {{
              (
                getRepsStore.selectedOption?.amount -
                getRepsStore.selectedOption?.amount * getRepsStore.selectedOption?.discount
              )
                .toFixed(2)
                .replace(/\.00$/, '')
            }}
          </div>
        </div>
      </div>
      <div v-if="isFirstTime" class="text-sm text-[#777777]">
        One-time charge on {{ currentDate }}.
      </div>
      <Divider />
      <div class="flex gap-x-6 justify-end">
        <div>Total</div>
        <div class="text-base font-bold">
          US$
          {{
            (
              getRepsStore.selectedOption?.amount -
              getRepsStore.selectedOption?.amount * getRepsStore.selectedOption?.discount
            )
              .toFixed(2)
              .replace(/\.00$/, '')
          }}
        </div>
      </div>

      <div class="space-y-4">
        <div class="text-base text-[#666666] font-bold">Payment Details</div>

        <!-- NO INFO -->
        <FormCardPayment v-if="!cardStore.card" ref="cardForm" :errors="errors" />
        <!--------------->

        <!-- HAVE INFO -->
        <div v-else>
          <div class="flex gap-x-4 py-4 items-center">
            <div
              v-if="cardStore.card.cardType === 'visa'"
              class="cursor-pointer border border-[#CCCCCC] rounded-md p-2 flex items-center"
            >
              <VisaIcon />
            </div>
            <div
              v-else-if="cardStore.card.cardType === 'mastercard'"
              class="cursor-pointer border border-[#CCCCCC] rounded-md p-2"
            >
              <MasterCardIcon />
            </div>
            <div class="flex justify-between items-center text-sm w-full">
              <div>
                <span v-if="cardStore.card.cardType === 'visa'">
                  Visa ending with <span class="font-bold">{{ cardStore.card.cardNumber }}</span>
                </span>
                <span v-else-if="cardStore.card.cardType === 'mastercard'">
                  MasterCard ending with
                  <span class="font-bold">{{ cardStore.card.cardNumber }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <!--------------->

        <div class="text-xs pt-2">
          <span class="text-[#777777]">
            By submitting payment information you acknowledge that you have read, understood and
            agree to be bound by MOVE’s
          </span>
          <span class="text-primary"> End User License Agreement, Privacy Policy</span>
          <span class="text-[#777777]"> and</span>
          <span class="text-primary"> Refund Policy</span>.
        </div>
        <CheckMarkCustom
          v-if="!cardStore.card"
          label="Save my payment details for faster checkout in the future."
          :checked="isCheckMark"
          groupName="checkMark"
          @update:modelValue="(value) => (isCheckMark = value)"
        />
        <div class="flex gap-x-6 justify-center items-center">
          <div class="flex gap-x-2 justify-end">
            <div>Total</div>
            <div class="text-base font-bold">
              US$
              {{
                (
                  getRepsStore.selectedOption?.amount -
                  getRepsStore.selectedOption?.amount * getRepsStore.selectedOption?.discount
                )
                  .toFixed(2)
                  .replace(/\.00$/, '')
              }}
            </div>
          </div>
          <div>
            <button @click="toggleLoadPayment" class="btn" :disabled="isSubmitting">
              <smallLoading v-if="isLoadingSubmit" fill="white" fill_second="#13d0b4" />
              <span v-else>Paynow</span>
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>
