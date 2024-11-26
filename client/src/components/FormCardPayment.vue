<script setup>
  import { ref, onMounted, watch } from 'vue';
  import VisaIcon from '@components/icons/visa.vue';
  import MasterCardIcon from '@components/icons/mastercard.vue';
  import { useContryStore } from '@/stores';
  import { loadStripe } from '@stripe/stripe-js';
  import { paymentSchema } from '@/utils/vadilation';

  const props = defineProps({
    isPaymentDetailsVisible: Boolean,
    title: String,
    errors: Object,
  });

  const countryStore = useContryStore();
  const stripe = ref(null);
  const elements = ref(null);
  const cardNumber = ref(null);
  const cardExpiry = ref(null);
  const cardCvc = ref(null);
  const cardName = ref('');
  const country = ref('');
  const cardBrand = ref(null);
  const isComplete = ref(false);
  const errors = ref({
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: props.errors?.cardName || '',
    country: props.errors?.country || '',
  });
  watch(
    () => props.errors,
    (newErrors) => {
      errors.value.cardName = newErrors?.cardName || '';
      errors.value.country = newErrors?.country || '';
    },
    { immediate: true },
  );

  const handleElementChange = (event, elementType) => {
    console.log(event);

    errors.value[elementType] = event.error ? event.error.message : '';

    if (elementType === 'cardNumber' && event.brand) {
      cardBrand.value = event.brand;
      if (event.brand !== 'visa' && event.brand !== 'mastercard') {
        errors.value.cardNumber = 'Your card number is incomplete.';
      }
    }
    console.log(cardBrand.value);

    isComplete.value = event.complete;
  };

  onMounted(async () => {
    stripe.value = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
    elements.value = stripe.value.elements();

    cardNumber.value = elements.value.create('cardNumber', {
      placeholder: 'Enter your card number',
    });
    cardNumber.value.mount('#card-number-element');
    cardNumber.value.addEventListener('change', (event) =>
      handleElementChange(event, 'cardNumber'),
    );
    // cardNumber.value.on('focus', () => {
    //   document.querySelector('#card-number-element').style.borderColor = '#13D0B4';
    // });

    // cardNumber.value.on('blur', () => {
    //   document.querySelector('#card-number-element').style.borderColor = '#dee3e9';
    // });
    cardExpiry.value = elements.value.create('cardExpiry');
    cardExpiry.value.mount('#card-expiry-element');
    cardExpiry.value.addEventListener('change', (event) =>
      handleElementChange(event, 'cardExpiry'),
    );
    // cardExpiry.value.on('focus', () => {
    //   if (!errors.value.cardExpiry) {
    //     document.querySelector('#card-expiry-element').style.borderColor = '#13d0b4';
    //   } else {
    //     document.querySelector('#card-expiry-element').style.borderColor = '#dee3e9';
    //   }
    // });

    // cardExpiry.value.on('blur', () => {
    //   if (!errors.value.cardExpiry) {
    //     document.querySelector('#card-expiry-element').style.borderColor = '#13d0b4';
    //   } else {
    //     document.querySelector('#card-expiry-element').style.borderColor = '#FF647A';
    //   }
    // });
    cardCvc.value = elements.value.create('cardCvc');
    cardCvc.value.mount('#card-cvc-element');
    cardCvc.value.addEventListener('change', (event) => handleElementChange(event, 'cardCvc'));
    // cardCvc.value.on('focus', () => {
    //   document.querySelector('#card-cvc-element').style.borderColor = '#13D0B4';
    // });

    // cardCvc.value.on('blur', () => {
    //   document.querySelector('#card-cvc-element').style.borderColor = '#dee3e9';
    // });
  });

  // expose các element và cardName để có thể truy cập từ component cha
  defineExpose({
    stripe,
    elements,
    cardNumber,
    cardExpiry,
    cardCvc,
    cardName,
    country,
    isComplete,
  });

  const validateField = async (field) => {
    try {
      if (field === 'cardName' && !cardName.value) return;
      if (field === 'country' && !country.value?.name) return;
      if (field === 'cardName') {
        await paymentSchema.validateAt('cardName', { cardName: cardName.value });
        errors.value.cardName = '';
      } else if (field === 'country') {
        await paymentSchema.validateAt('country', { country: country.value.name });
        errors.value.country = '';
      }
    } catch (validationError) {
      if (field === 'cardName') {
        errors.value.cardName = validationError.message;
      } else if (field === 'country') {
        errors.value.country = validationError.message;
      }
    }
  };
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-3">
      <!-- Row 1: Cardholder Name and Country -->
      <div class="flex flex-col gap-y-2">
        <div class="flex flex-col">
          <label for="cardName" class="text_para pb-2">Cardholder Name</label>
          <div
            class="relative text-[14px] rounded-lg flex-1"
            :class="errors.cardName ? 'error_payment' : 'normal_payment'"
          >
            <input
              type="text"
              required
              class="password_custom h-full"
              v-model="cardName"
              placeholder="Enter your card name"
              @input="cardName = cardName.toUpperCase()"
              @blur="validateField('cardName')"
            />
          </div>
          <span v-if="errors.cardName" class="error_message">{{ errors.cardName }}</span>
        </div>
      </div>

      <div class="flex flex-col gap-y-2">
        <div class="flex flex-col">
          <label for="country" class="text_para pb-2">Country</label>
          <select
            :class="errors.country ? 'select_custom_error' : 'select_customPayment'"
            v-model="country"
            id="country"
            @blur="validateField('country')"
          >
            <option v-if="!country" disabled value="">Select country</option>
            <option v-else :selected="country">
              {{ country.name }}
            </option>
            <option v-for="country in countryStore.countries" :key="country.code" :value="country">
              {{ country.name }}
            </option>
          </select>
          <span v-if="errors.country" class="error_message">{{ errors.country }}</span>
        </div>
      </div>

      <!-- Row 2: Card Number and Card Type -->
      <div class="flex flex-col">
        <div class="flex flex-col">
          <label for="cardNumber" class="text_para pb-2">Card Number</label>
          <div
            id="card-number-element"
            class="card-element relative text-[14px] rounded-lg flex-1"
            :class="errors.cardNumber ? 'error_payment' : 'normal_password'"
          ></div>
          <p v-if="errors.cardNumber" class="error_message">{{ errors.cardNumber }}</p>
        </div>
      </div>

      <div class="flex flex-col">
        <label class="text_para pb-2">Card Type</label>
        <div class="flex gap-x-4 pt-2">
          <div
            class="cursor-pointer border border-[#CCCCCC] rounded-md p-2 flex items-center"
            :class="{
              'opacity-100': cardBrand === 'visa',
              'opacity-40': cardBrand !== 'visa',
            }"
          >
            <VisaIcon />
          </div>
          <div
            class="cursor-pointer border border-[#CCCCCC] rounded-md p-2"
            :class="{
              'opacity-100': cardBrand === 'mastercard',
              'opacity-40': cardBrand !== 'mastercard',
            }"
          >
            <MasterCardIcon />
          </div>
        </div>
      </div>

      <!-- Row 3: Expiration Date and CVV2/CVC2 -->
      <div class="flex flex-col">
        <div class="flex flex-col">
          <label for="cardExpiry" class="text_para pb-2 whitespace-nowrap">Expiration date</label>
          <div
            id="card-expiry-element"
            class="card-element relative text-[14px] rounded-lg flex-1 w-1/3"
            :class="errors.cardExpiry ? 'error_payment' : 'normal_password'"
          ></div>
          <p v-if="errors.cardExpiry" class="error_message">{{ errors.cardExpiry }}</p>
        </div>
      </div>

      <div class="flex flex-col">
        <label for="cardCvc" class="text_para pb-2 whitespace-nowrap">CVV2/CVC2</label>
        <div
          id="card-cvc-element"
          class="card-element relative text-[14px] rounded-lg flex-1 w-1/3"
          :class="errors.cardCvc ? 'error_payment' : 'normal_password'"
        ></div>
        <p v-if="errors.cardCvc" class="error_message">{{ errors.cardCvc }}</p>
      </div>
    </div>
  </form>
</template>

<style>
  .card-element {
    border-radius: 8px;
    padding: 12px 8px;
    border: 1px solid #ccc;
    transition: border-color 0.3s ease;
  }

  input::placeholder {
    color: #757575;
  }
</style>
