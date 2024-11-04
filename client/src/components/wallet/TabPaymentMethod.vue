<script setup>
  import CardPayment from './CardPayment.vue';
  import { ref } from 'vue';
  const isDisplay = ref(true);
</script>
<template>
  <div class="space-y-2">
    <span class="text-base font-bold">Your payment method</span>

    <!-- Card -->
    <CardPayment v-if="isDisplay" username="Phillip Giggs" number="1234123412341234" />

    <!-- No card -->
    <div v-else class="flex items-center justify-center pt-[10%]">
      <div class="space-y-6 text-center">
        <div class="justify-center">
          <div class="text-base font-bold">No payment method setup</div>
          <div class="text-base italic">You do not have any saved payment information.</div>
        </div>
        <div>
          <button class="btn">Setup payment method</button>
        </div>
      </div>
    </div>
  </div>
</template>
