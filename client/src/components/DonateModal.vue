<script setup>
  import { ref } from 'vue';
  import Button from 'primevue/button';
  import REPs1 from './icons/REPsItems/REPs1.vue';
  import REPs2 from './icons/REPsItems/REPs2.vue';
  import REPs3 from './icons/REPsItems/REPs3.vue';
  import REPs4 from './icons/REPsItems/REPs4.vue';
  import REPs5 from './icons/REPsItems/REPs5.vue';
  import { usePopupStore } from '@/stores';

  const popupStore = usePopupStore();

  const emit = defineEmits(['toggleButtonGiftVisible', 'toggleGetREPsMenu']);
  const donateValueList = [
    { value: 100 },
    { value: 1000 },
    { value: 5000 },
    { value: 10000 },
    { value: 25000 },
  ];
  const icons = [REPs1, REPs2, REPs3, REPs4, REPs5];

  const presentMessages = [
    { id: 1, message: 'Best workout yet!' },
    { id: 2, message: 'Well done!' },
    { id: 3, message: 'You have done the unthinkable!' },
    { id: 4, message: 'You are awesome!' },
  ];

  const toggleClose = () => {
    emit('toggleButtonGiftVisible');
  };
  const toggleGetREPsMenu = () => {
    emit('toggleButtonGiftVisible');

    emit('toggleGetREPsMenu');
  };
  const user = {
    id: 1,
    REPs: 300,
  };

  const selectedValue = ref(null);
  const handleSelectValue = (value) => {
    selectedValue.value = selectedValue.value === value ? null : value;
  };

  const inputMessage = ref(true);
  const handleOpenInputMessage = () => {
    inputMessage.value = !inputMessage.value;
  };

  const selectPresentMessage = ref(presentMessages[0].id);
  const handleSelectPresentMessage = (id) => {
    selectPresentMessage.value = selectPresentMessage.value === id ? null : id;
  };
</script>

<template>
  <div class="w-[441px] shadow-xl rounded-lg">
    <div class="flex flex-col">
      <!-- HEADER MODAL -->
      <div class="flex flex-col gap-y-1 mx-3 py-2">
        <div class="flex items-center justify-between">
          <h1 class="text_subTitle text-[12px] md:text-[16px]">
            Support your instructor with REPs!
          </h1>
          <div
            class="flex justify-center items-center p-2 rounded-full cursor-pointer hover:bg-gray-dark"
            @click="toggleClose"
          >
            <i class="pi pi-times !font-bold text-lg"></i>
          </div>
        </div>
        <h2 class="text-[11px] md:text-[13px]">Select amount of REPs to send to the instructor</h2>
        <h2 class="text_link cursor-pointer">How do I support instructor?</h2>
      </div>
      <hr class="h-[2px] bg-gray-dark border-0" />

      <!-- BUTTON MODAL -->
      <div class="flex justify-between mx-3 py-3">
        <div
          v-for="(donateValue, index) in donateValueList"
          :key="donateValue.value"
          class="flex flex-col justify-center items-center gap-y-1"
        >
          <component
            class="cursor-pointer"
            @click="handleSelectValue(donateValue.value)"
            :reps="donateValue.value"
            :is="icons[index]"
          />
        </div>
      </div>

      <!-- INPUT MODAL -->
      <hr v-if="selectedValue" class="h-[2px] bg-gray-dark border-0" />
      <form v-if="selectedValue" class="flex flex-col gap-y-4 mx-5 py-4">
        <input
          v-if="inputMessage"
          type="text"
          placeholder="Send a message (optional)"
          class="w-full px-3 py-3 rounded-lg text-sm border-2 border-gray-dark focus:outline-primary focus:caret-primary"
        />
        <div v-if="!inputMessage" class="flex flex-col gap-y-2">
          <div
            v-for="message in presentMessages"
            :key="message.id"
            class="p-3 border-2 text-[12px] rounded-xl cursor-pointer md:text-[15px]"
            :class="{
              'border-primary bg-primary-light/20': selectPresentMessage === message.id,
              'border-gray-dark bg-white': selectPresentMessage !== message.id,
            }"
            @click="handleSelectPresentMessage(message.id)"
          >
            {{ message.message }}
          </div>
        </div>
        <div class="flex justify-between">
          <h2 class="text_link cursor-pointer" @click="handleOpenInputMessage">
            {{ inputMessage ? 'or select from preset message' : 'or enter custom message' }}
          </h2>
          <Button
            class="btn px-4 text-nowrap text-[12px] md:text-[15px]"
            :class="{ 'bg-body': user.REPs < selectedValue }"
            :disabled="user.REPs < selectedValue"
          >
            Send {{ selectedValue }} REPs
          </Button>
        </div>
      </form>

      <!-- FOOTER MODAL -->
      <div class="py-4 bg-[#008370] rounded-b-lg">
        <div class="flex justify-between px-5 items-center text-white">
          <h1 class="text-[12px] md:text-[16px]">
            You have <span class="font-bold">{{ user.REPs }} REPs</span>
          </h1>
          <Button @click="toggleGetREPsMenu" class="btn px-4 text-nowrap text-[12px] md:text-[15px]"
            >Get REPs</Button
          >
        </div>
      </div>
    </div>
  </div>
</template>
