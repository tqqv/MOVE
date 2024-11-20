<script setup>
  import { onMounted, ref } from 'vue';
  import Congratulation from './icons/congratulation.vue';
  import TickRight from './icons/tickRight.vue';
  import Navbar from './Navbar.vue';
  import { useRoute } from 'vue-router';
  import { toast } from 'vue3-toastify';
  import { acpVerifyMail } from '@/services/auth';
  import Expired from './icons/expired.vue';
  import Fail from './icons/fail.vue';

  const token = ref(useRoute().params.token || '');
  const status = ref();
  const verifyToken = async () => {
    try {
      const { data } = await acpVerifyMail(token.value);
      status.value = 'success';
    } catch (error) {
      status.value = 'fail';
      return false;
    }
  };

  onMounted(() => {
    verifyToken();
  });
</script>
<template>
  <Navbar />
  <div class="h-screen flex flex-col">
    <div class="flex flex-grow justify-center items-center">
      <div class="border border-gray-dark rounded-2xl w-[520px] h-[420px] p-10">
        <div v-if="status === 'success'" class="flex flex-col items-center gap-y-5">
          <h1 class="text-3xl font-bold text-primary">Verification successful!</h1>
          <div class="flex justify-center my-3"><Congratulation /></div>
          <div
            class="flex justify-center items-center gap-x-2 px-12 py-4 rounded-md bg-primary/20 text-sm"
          >
            <TickRight fill="#13d0b4" />
            <p>Success! Your email has been verified</p>
          </div>
          <RouterLink
            to="/"
            class="bg-primary rounded-full py-2 px-12 text-white font-semibold mt-2"
            >Continue</RouterLink
          >
        </div>
        <div v-if="status === 'fail'" class="flex flex-col items-center gap-y-5">
          <h1 class="text-3xl font-bold text-[#ff5449]">Verification fail!</h1>
          <div class="flex justify-center my-3"><Expired /></div>
          <div
            class="flex justify-center items-center gap-x-2 px-12 py-5 rounded-md bg-red/40 text-sm"
          >
            <Fail />
            <p>Fail! Verification time has passed</p>
          </div>
          <RouterLink
            to="/personal-profile"
            class="bg-red rounded-full py-2 px-12 text-white font-semibold mt-2"
            >Try again</RouterLink
          >
        </div>
      </div>
    </div>
  </div>
</template>
