<script setup>
  import { computed, ref } from 'vue';

  import { usePopupStore, useUserStore } from '@/stores';
  import VerificationPopup from '@/components/popup/VerificationPopup.vue';
</script>

<template><VerificationPopup /></template>
