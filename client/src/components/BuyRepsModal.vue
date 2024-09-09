<script setup>
  import { ref } from 'vue';
  import Button from 'primevue/button';

  const pricingOptions = [
    {
      id: 1,
      quantity: 300,
      price: 1.5,
      discount: 29,
      specialDiscount: true,
    },
    {
      id: 2,
      quantity: 500,
      price: 3.5,
      discount: 0,
      specialDiscount: false,
    },
    {
      id: 3,
      quantity: 1500,
      price: 9.95,
      discount: 5,
      specialDiscount: false,
    },
    {
      id: 4,
      quantity: 5000,
      price: 32.5,
      discount: 7,
      specialDiscount: false,
    },
    {
      id: 5,
      quantity: 10000,
      price: 63.0,
      discount: 10,
      specialDiscount: false,
    },
    {
      id: 6,
      quantity: 25000,
      price: 154.0,
      discount: 12,
      specialDiscount: false,
    },
  ];
</script>

<template>
  <div class="w-[441px] shadow-xl rounded-lg">
    <div class="flex flex-col">
      <!-- HEADER MODAL -->
      <div class="flex flex-col gap-y-1 mx-5 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text_subTitle text-[16px] md:text-[24px]">Buy REPs</h1>
          <div
            class="flex justify-center items-center p-2 rounded-full cursor-pointer hover:bg-gray-dark"
          >
            <i class="pi pi-times !font-bold text-lg"></i>
          </div>
        </div>
        <h2 class="text-[11px] md:text-[15px]">You have <span class="font-bold">0 REPs</span></h2>
        <h2 class="text-body text-[11px] md:text-[13px]">
          Prices are shown in USD and include VAT
        </h2>
      </div>
      <hr class="h-[1px] bg-gray-dark border-0" />
      <!-- CONTENT MODAL -->
      <div class="flex flex-col">
        <div v-for="pricingOption in pricingOptions" :key="pricingOption.id">
          <div class="flex justify-between items-center px-4 py-3">
            <div class="flex flex-col">
              <h1 class="text_subTitle text-[14px] md:text-[16px]">
                {{ pricingOption.quantity }} REPs
              </h1>
              <p
                class="text-body text-[11px] md:text-[13px]"
                :class="{ 'text-red': pricingOption.specialDiscount }"
              >
                {{
                  pricingOption.specialDiscount
                    ? `${pricingOption.discount}% discount for first time buyer!`
                    : pricingOption.discount > 0
                    ? `${pricingOption.discount}% disocunt`
                    : ''
                }}
              </p>
            </div>
            <Button class="btn px-3 min-w-[104px] text-nowrap text-[12px] md:text-[16px]"
              >US${{ pricingOption.price }}</Button
            >
          </div>
          <hr class="h-[1px] bg-gray-dark border-0" />
        </div>
      </div>
    </div>
  </div>
</template>
