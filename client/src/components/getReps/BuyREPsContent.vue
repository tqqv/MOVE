<script setup>
  import { ref, onMounted, watch } from 'vue';

  import BuyREPsCard from './BuyREPsCard.vue';
  import GetREPS from './GetREPS.vue';
  const emit = defineEmits(['toogleGetREPsMenu']);
  const toogleGetREPsMenu = () => {
    emit('toogleGetREPsMenu');
  };
  const purchaseOptions = ref([
    { reps: 300, money: 1.5, discount: '29', firstTime: true },
    { reps: 500, money: 3.5, discount: '' },
    { reps: 1500, money: 9.95, discount: '5' },
    { reps: 5000, money: 32.5, discount: '7' },
    { reps: 25000, money: 154.0, discount: '12' },
  ]);
</script>
<template>
  <GetREPS @toogleGetREPsMenu="toogleGetREPsMenu" />
  <div v-for="(option, index) in purchaseOptions" :key="index" class="mt-4">
    <BuyREPsCard :purchaseOptions="option" @toogleGetREPsMenu="toogleGetREPsMenu" />
  </div>
</template>
