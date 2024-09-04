<script setup>
  import { ref } from 'vue';
  import Button from 'primevue/button';
  import visa from '@icons/visa.vue';
  import mastercard from '@icons/mastercard.vue';

  const completed = ref(false);
</script>

<template>
  <!-- COMPLETED -->
  <div v-if="completed" class="w-full md:w-[604px] shadow-xl mx-3 rounded-lg">
    <div class="flex flex-col mx-5">
      <!-- HEADER MODAL -->
      <div class="flex flex-col py-4">
        <div class="flex items-center justify-between">
          <h1 class="text_title text-[16px] md:text-[24px]">Complete Purchase</h1>
          <div
            class="flex justify-center items-center p-2 rounded-full cursor-pointer hover:bg-gray-dark"
          >
            <i class="pi pi-times !font-bold text-lg"></i>
          </div>
        </div>
        <h2 class="text-[11px] my-2 md:text-[15px] font-bold text-body">Order Summary</h2>
        <div class="flex justify-between items-center my-1 text-[14px] md:text-[16px]">
          <h2 class="font-bold">300 REPs</h2>
          <h2>US$1.50</h2>
        </div>
        <span class="text_secondary text-[12px] md:text-[14px]"
          >One-time charge on 20 Jul 2020.</span
        >
      </div>
      <hr class="h-[1px] bg-gray-dark border-0" />
      <!-- CONTENT MODAL -->
      <div class="flex flex-col py-4">
        <div class="flex gap-x-9 justify-between items-center mb-4 md:justify-end">
          <h2 class="text_secondary text-body">Total including VAT</h2>
          <h2 class="text_subTitle">US$1.50</h2>
        </div>
        <div class="flex flex-col gap-y-4">
          <h1 class="text-body font-bold text-[14px] md:text-[16px]">Payment Details</h1>
          <div class="flex flex-col md:flex-row justify-between gap-y-2 md:gap-x-5 mb-2">
            <div class="flex flex-col gap-y-1 w-full md:w-1/2">
              <label class="text_para" for="">Cardholder Name</label>
              <input
                type="text"
                class="p-2 text-[14px] rounded-lg border border-gray-dark focus:outline-primary focus:caret-primary"
              />
            </div>
            <div class="flex flex-col gap-y-1 w-full md:w-1/2">
              <label class="text_para" for="">Country</label>
              <select
                id="countries"
                class="bg-gray-50 border border-gray-dark text-gray-900 text-sm rounded-lg focus: focus:border-primary block w-full p-2.5"
              >
                <option selected>Choose a country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="FR">France</option>
                <option value="DE">Germany</option>
              </select>
            </div>
          </div>
          <div class="flex flex-col md:flex-row justify-between gap-y-2 md:gap-x-5 mb-2">
            <div class="flex flex-col gap-y-1 w-full md:w-1/2">
              <label class="text_para" for="">Card number</label>
              <input
                type="text"
                class="p-2 text-[14px] rounded-lg border border-gray-dark focus:outline-primary focus:caret-primary"
              />
            </div>
            <div class="flex flex-col justify-between gap-y-1 w-full md:w-1/2">
              <label class="text_para" for="">Card type</label>
              <div class="flex gap-x-2 items-center">
                <button
                  class="relative w-9 h-6 flex justify-center items-center px-1 py-2 border border-gray-dark in rounded-md hover:border-primary"
                >
                  <visa class="opacity-40" />
                </button>
                <button
                  class="w-9 h-6 flex justify-center items-center px-1 py-2 border border-gray-dark in rounded-md hover:border-primary"
                >
                  <mastercard class="opacity-40" />
                </button>
              </div>
            </div>
          </div>
          <div class="flex justify-between gap-x-5 mb-1">
            <div class="flex flex-col gap-y-1 w-1/2">
              <label class="text_para" for="">Expiration date</label>
              <div class="flex gap-x-2">
                <input
                  type="text"
                  maxlength="2"
                  placeholder="MM"
                  class="w-14 p-2 text-[14px] border border-gray-300 rounded text-center border-gray-dark focus:outline-primary focus:caret-primary"
                />
                <input
                  type="text"
                  maxlength="2"
                  placeholder="YY"
                  class="w-14 p-2 text-[14px] border border-gray-300 rounded text-center border-gray-dark focus:outline-primary focus:caret-primary"
                />
              </div>
            </div>
            <div class="flex flex-col gap-y-1 w-1/2">
              <div class="flex gap-x-4 items-center">
                <label class="text_para" for="">CVV2/CVC2</label>
                <i class="pi pi-question-circle text-[18px]"></i>
              </div>
              <input
                type="text"
                maxlength="5"
                class="w-20 p-2 text-[14px] border border-gray-300 rounded text-center border-gray-dark focus:outline-primary focus:caret-primary"
              />
            </div>
          </div>
          <p class="text-[12px] mb-7">
            By submitting payment information you acknowledge that you have read, understood and
            agree to be bound by MOVE’s
            <a class="text-primary cursor-pointer text-wrap"
              >End User License Agreement, Privacy Policy and Refund Policy.</a
            >
          </p>
          <div class="flex gap-x-2 items-center">
            <input
              type="checkbox"
              class="size-7 bg-white border-gray-300 !rounded-2xl !focus:ring-white checked:accent-primary"
            />
            <label for="default-checkbox" class="ms-2 text-sm text-body"
              >Save my payment details for faster checkout in the future.</label
            >
          </div>
          <div class="flex justify-center items-center mt-3 gap-x-6">
            <h1 class="text-[16px]">Total <span class="font-bold">US$1.50</span></h1>
            <Button class="btn px-5 min-w-[104px] text-nowrap text-[12px] md:text-[16px]"
              >Pay now</Button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- UNCOMPLETED -->

  <div v-else class="w-full md:w-[604px] shadow-xl mx-3 rounded-lg">
    <div class="flex flex-col mx-5">
      <!-- HEADER MODAL -->
      <div class="flex flex-col py-4">
        <div class="flex items-center justify-between">
          <h1 class="text_title text-[16px] md:text-[24px]">Complete Purchase</h1>
          <div
            class="flex justify-center items-center p-2 rounded-full cursor-pointer hover:bg-gray-dark"
          >
            <i class="pi pi-times !font-bold text-lg"></i>
          </div>
        </div>
        <h2 class="text-[11px] my-2 md:text-[15px] font-bold text-body">Order Summary</h2>
        <div class="flex justify-between items-center my-1 text-[14px] md:text-[16px]">
          <h2 class="font-bold">300 REPs</h2>
          <h2>US$1.50</h2>
        </div>
        <span class="text_secondary text-[12px] md:text-[14px]"
          >One-time charge on 20 Jul 2020.</span
        >
      </div>
      <hr class="h-[1px] bg-gray-dark border-0" />
      <!-- CONTENT MODAL -->
      <div class="flex flex-col py-4">
        <div class="flex gap-x-9 justify-between items-center mb-4 md:justify-end">
          <h2 class="text_secondary text-body">Total including VAT</h2>
          <h2 class="text_subTitle">US$1.50</h2>
        </div>
        <div class="flex flex-col py-4 gap-y-4">
          <h1 class="text-body font-bold text-[14px] md:text-[16px]">Payment Details</h1>
          <div class="flex justify-between items-center">
            <div class="flex gap-x-4 items-center">
              <button class="px-1 py-2 border border-gray-dark in rounded-md">
                <visa class="" />
              </button>
              <h1 class="text_para">Visa ending with <span class="font-bold">1234</span></h1>
            </div>
            <h1 class="text-[12px] text-primary font-medium">Change</h1>
          </div>
          <p class="text-[12px] text-body mt-3 mb-7">
            By submitting payment information you acknowledge that you have read, understood and
            agree to be bound by MOVE’s
            <a class="text-primary cursor-pointer text-wrap"
              >End User License Agreement, Privacy Policy and Refund Policy.</a
            >
          </p>
          <div class="flex justify-center items-center mt-3 gap-x-6">
            <h1 class="text-[16px]">Total <span class="font-bold">US$1.50</span></h1>
            <Button class="btn px-5 min-w-[104px] text-nowrap text-[12px] md:text-[16px]"
              >Pay now</Button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
