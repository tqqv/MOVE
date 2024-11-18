<script setup>
  import { ref, onMounted, watch } from 'vue';
  import Dialog from 'primevue/dialog';
  import { fetchCountries } from '@/services/address';
  import VisaIcon from '@components/icons/visa.vue';
  import MasterCardIcon from '@components/icons/mastercard.vue';
  import FormCardPayment from '@/components/FormCardPayment.vue';
  import { createCardInfo, getClientSecret } from '@/services/payment';
  import { toast } from 'vue3-toastify';
  import { useCardStore } from '@/stores/card.store';
  import { paymentSchema } from '@/utils/vadilation';

  const props = defineProps({
    isPaymentDetailsVisible: Boolean,
    title: String,
  });
  const countries = ref([]);

  const cardStore = useCardStore();
  const errors = ref();
  const emit = defineEmits(['closePayment']);

  const lockScroll = () => (document.body.style.overflow = 'hidden');
  const unlockScroll = () => (document.body.style.overflow = 'auto');
  const toggleClosePayment = () => {
    emit('closePayment');
    errors.value = '';
  };

  const loadCountries = async () => {
    try {
      countries.value = await fetchCountries();
    } catch (error) {
      console.error(error);
    }
  };

  watch(
    () => props.isPaymentDetailsVisible,
    (newVal) => {
      if (newVal) lockScroll();
      else unlockScroll();
    },
  );

  onMounted(() => {
    loadCountries();
  });

  ////// Payment with Stripeq
  const cardForm = ref(null);

  const setupIntentClientSecret = async () => {
    const res = await getClientSecret();
    if (res) {
      // console.log(res);
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
  const handleSubmit = async () => {
    const isValid = await validatePaymentData();

    if (!cardForm.value || !cardForm.value.stripe) {
      console.error('cardForm or Stripe is undefined');
      return;
    }

    const { cardNumber, cardName, stripe, country, elements, isComplete } = cardForm.value;

    try {
      const clientSecret = await setupIntentClientSecret();
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
        if (!isComplete || !isValid) {
          return;
        }
        const res = await createCardInfo(data);

        if (res && res.status === 200) {
          cardStore.fetchCard();
          toast.success('Saved successfully.');
          toggleClosePayment();
        } else {
          toast.error('Insert failed');
        }
      } else {
        console.error('Error: Confirmation failed');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      :visible="isPaymentDetailsVisible"
      :modal="true"
      :draggable="false"
      :header="props.title"
      @show="lockScroll"
      @hide="unlockScroll"
      @update:visible="toggleClosePayment"
      :style="{ width: '40rem' }"
      :dismissableMask="true"
    >
      <div class="space-y-4">
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
        <div class="flex justify-center mt-4">
          <button @click="handleSubmit" class="btn w-1/3">Submit</button>
        </div>
      </div>
    </Dialog>
  </div>
</template>
