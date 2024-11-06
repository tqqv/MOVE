<script setup>
  import { ref, onMounted, watch } from 'vue';
  import VisaIcon from '@components/icons/visa.vue';
  import MasterCardIcon from '@components/icons/mastercard.vue';
  import { useContryStore } from '@/stores';

  const props = defineProps({
    isPaymentDetailsVisible: Boolean,
    title: String,
  });
  const countryStore = useContryStore();
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
              @input="(e) => capitalizeInput(e, 'fullName')"
            />
          </div>
        </div>
        <!-- Card Number -->
        <div class="flex flex-col">
          <label for="cardNumber" class="text_para">Card Number</label>
          <div class="relative text-[14px] rounded-lg normal_password flex-1">
            <input
              type="text"
              required
              class="password_custom h-full"
              @input="(e) => capitalizeInput(e, 'cardNumber')"
            />
          </div>
        </div>
        <!-- Expiration date -->
        <div class="flex flex-col w-1/3">
          <label for="expirationDate" class="text_para whitespace-nowrap">Expiration date</label>
          <div class="relative text-[14px] rounded-lg normal_password flex-1">
            <input
              id="expirationDate"
              type="text"
              maxlength="5"
              required
              class="password_custom h-full"
              @input="formatExpirationDate"
              placeholder="MM/YY"
            />
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-y-2 w-full md:w-1/2">
        <!-- Country -->
        <div>
          <label for="country" class="text_para">Country</label>
          <select id="country" class="select_custom">
            <option disabled value="null">Select country</option>

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
          <div class="relative text-[14px] rounded-lg normal_password flex-1">
            <input
              type="text"
              required
              class="password_custom h-full"
              @input="(e) => capitalizeInput(e, 'cardNumber')"
            />
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
