<script setup>
  import { ref, onMounted, watch } from 'vue';
  import VisaIcon from '@components/icons/visa.vue';
  import MasterCardIcon from '@components/icons/mastercard.vue';
  import { useContryStore } from '@/stores';
  import { loadStripe } from '@stripe/stripe-js';

  const props = defineProps({
    isPaymentDetailsVisible: Boolean,
    title: String,
  });
  const countryStore = useContryStore();
  const stripe = ref(null);
  const elements = ref(null);
  const cardNumber = ref(null);
  const cardExpiry = ref(null);
  const cardCvc = ref(null);
  const cardName = ref('');
  const country = ref('');


  // const handleElementChange = (event, elementType) => {
  //   // errors[elementType] = event.error ? event.error.message : ''
  //   console.log('lewlewlelw');
  //   console.log(event);

  //   // if (elementType === 'cardNumber' && event.brand) {
  //   //   cardBrand.value = event.brand

  //   // }

  //   // Kiểm tra tất cả các trường đã hoàn thành
  //   const elements = props.elements
  //   isComplete.value = [
  //     elements.getElement('cardNumber'),
  //     elements.getElement('cardExpiry'),
  //     elements.getElement('cardCvc')
  //   ].every(element => element._complete) && formData.cardholderName && formData.country
  // }

  onMounted(async () => {
    stripe.value = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
    elements.value = stripe.value.elements();
    cardNumber.value = elements.value.create('cardNumber');

    cardNumber.value.mount('#card-number-element');

    cardExpiry.value = elements.value.create('cardExpiry');
    cardExpiry.value.mount('#card-expiry-element');

    cardCvc.value = elements.value.create('cardCvc');
    cardCvc.value.mount('#card-cvc-element');

    // cardNumber.value.addEventListener('change', (e) => handleElementChange(e, 'cardNumber'));
    // cardExpiry.on('change', (e) => handleElementChange(e, 'cardExpiry'))
    // cardCvc.on('change', (e) => handleElementChange(e, 'cardCvc'))
  });


  // expose các element và cardName để có thể truy cập từ component cha
  defineExpose({
    stripe,
    elements,
    cardNumber,
    cardExpiry,
    cardCvc,
    cardName,
    country
  });
</script>

<template>
  <form @submit.prevent="handleUpdate">
    <div class="flex flex-col md:flex-row gap-y-4 md:gap-x-3">
      <div class="flex flex-col gap-y-2 w-full md:w-1/2">
        <!-- Cardholder Name -->
        <div class="flex flex-col">
          <label for="username" class="text_para">Cardholder Name</label>
          <div class="relative text-[14px] rounded-lg normal_password flex-1">
            <input
              type="text"
              required
              class="password_custom h-full"
              v-model="cardName"
            />
          </div>
        </div>
        <!-- Card Number -->
        <div class="flex flex-col">
          <label for="cardNumber" class="text_para">Card Number</label>
          <div id="card-number-element" class="card-element relative text-[14px] rounded-lg flex-1">
            <!-- <input
              type="text"
              required
              class="password_custom h-full"
              @input="(e) => capitalizeInput(e, 'cardNumber')"
            /> -->
          </div>
        </div>
        <!-- Expiration date -->
        <div class="flex flex-col w-1/3">
          <label for="expirationDate" class="text_para whitespace-nowrap">Expiration date</label>
          <div id="card-expiry-element" class="card-element relative text-[14px] rounded-lg normal_password flex-1">
            <!-- <input
              id="expirationDate"
              type="text"
              maxlength="5"
              required
              class="password_custom h-full"
              @input="formatExpirationDate"
              placeholder="MM/YY"
            /> -->
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-y-2 w-full md:w-1/2">
        <!-- Country -->
        <div>
          <label for="country" class="text_para">Country</label>
          <select v-model="country" id="country" class="select_custom">
            <option v-if="!country" disabled value="null">Select country</option>
            <option v-else selected>{{ country.name }}</option>
            <option v-for="country in countryStore.countries" :key="country.code" :value="country">
              {{ country.name }}
            </option>
          </select>
        </div>
        <!-- Card Type -->
        <div>
          <label class="text_para">Card Type</label>
          <div class="flex gap-x-4 pt-2">
            <div
              class="cursor-pointer border border-[#CCCCCC] rounded-md p-2 flex items-center opacity-50"
            >
              <VisaIcon />
            </div>
            <div class="cursor-pointer border border-[#CCCCCC] rounded-md p-2">
              <MasterCardIcon />
            </div>
          </div>
        </div>
        <!-- CVV -->

        <div class="flex flex-col w-1/3">
          <label for="cardNumber" class="text_para whitespace-nowrap"
            >CVV2/CVC2 <i class="pi pi-question-circle text-sm" />
          </label>
          <div id="card-cvc-element" class="card-element relative text-[14px] rounded-lg normal_password flex-1">
            <!-- <input
              type="text"
              required
              class="password_custom h-full"
              @input="(e) => capitalizeInput(e, 'cardNumber')"
            /> -->
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped>
.card-element {
  border-radius: 8px;
  padding: 12px 8px;
  border: 1px solid #ccc;
  transition: border-color 0.3s ease;
}

.card-element:focus-within {
  border-color: var(--border-primary, #3b82f6);
}
</style>
