<script setup>
  import { ref, onMounted, watch } from 'vue';
  import Dialog from 'primevue/dialog';
  import CheckMarkCustom from '@/components/CheckMarkCustom.vue';

  const props = defineProps({
    isBankDetailsVisible: Boolean,
    title: String,
  });
  const emit = defineEmits(['toogleBankDetailsVisible', 'toogleReceivePaymentVisible']);
  const toogleBankDetailsVisible = () => {
    emit('toogleBankDetailsVisible');
  };
  const backReceivePayment = () => {
    emit('toogleBankDetailsVisible');
    emit('toogleReceivePaymentVisible');
  };
  const isCheckMark = ref(false);
</script>

<template>
  <Dialog
    :visible="isBankDetailsVisible"
    :modal="true"
    :draggable="false"
    :header="props.title"
    @update:visible="toogleBankDetailsVisible"
    :style="{ width: '40rem' }"
    dismissableMask="true"
  >
    <div class="text-black space-y-8">
      <form @submit.prevent="handleUpdate" class="space-y-4">
        <div class="flex flex-col md:flex-row gap-y-4 md:gap-x-3">
          <div class="flex flex-col gap-y-2 w-full md:w-1/2">
            <!-- Bank name -->
            <div class="flex flex-col">
              <label for="username" class="text_para">Bank name</label>
              <div class="relative text-[14px] rounded-lg normal_password flex-1">
                <input type="text" required class="password_custom h-full" />
              </div>
            </div>
            <!-- Bank account number -->
          </div>
          <div class="flex flex-col gap-y-2 w-full md:w-1/2">
            <!-- Bank name -->
            <div class="flex flex-col">
              <label for="username" class="text_para">Bank account number</label>
              <div class="relative text-[14px] rounded-lg normal_password flex-1">
                <input type="text" required class="password_custom h-full" />
              </div>
            </div>
            <!-- Bank account number -->
          </div>
        </div>
        <div class="flex flex-col">
          <label for="username" class="text_para">Bank address</label>
          <div class="relative text-[14px] rounded-lg normal_password flex-1">
            <input type="text" required class="password_custom h-full" />
          </div>
        </div>
        <div class="flex flex-col">
          <label for="username" class="text_para">SWIFT Code</label>
          <div class="relative text-[14px] rounded-lg normal_password flex-1 w-1/2">
            <input type="text" required class="password_custom h-full" />
          </div>
        </div>
        <hr class="text-[#CCCCCC]" />
        <div class="flex flex-col">
          <label for="username" class="text_para">Full name</label>
          <div class="relative text-[14px] rounded-lg normal_password flex-1">
            <input type="text" required class="password_custom h-full" />
          </div>
        </div>
        <div class="flex flex-col">
          <label for="username" class="text_para">Mobile number</label>
          <div class="relative text-[14px] rounded-lg normal_password flex-1 w-1/2">
            <input type="text" required class="password_custom h-full" />
          </div>
        </div>
      </form>
      <div class="text-xs">
        <span class="text-[#777777]">
          By submitting payment information you acknowledge that you have read, understood and agree
          to be bound by MOVE’s
        </span>
        <span class="text-primary"> End User License Agreement, Privacy Policy</span>
        <span class="text-[#777777]"> and</span>
        <span class="text-primary"> Refund Policy</span>.
      </div>
      <CheckMarkCustom
        label="Save my bank details for faster withdrawal in the future."
        :checked="isCheckMark"
        groupName="checkMark"
        @update:modelValue="(value) => (isCheckMark = value)"
      />
      <div class="flex gap-x-12 justify-end">
        <button @click="backReceivePayment" class="text-primary">Back</button>

        <button @click="" class="btn w-[170px]">Next</button>
      </div>
    </div>
  </Dialog>
</template>

<style scoped></style>
