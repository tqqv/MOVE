<script setup>
  import { ref, onMounted } from 'vue';
  import { toast } from 'vue3-toastify';
  import { postLogin } from '@/services/auth'; // Hàm gọi API đăng nhập
  import logoBlack from '@assets/logoBlack.svg';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores';

  const email = ref('');
  const password = ref('');
  const errorMessage = ref('');
  const router = useRouter();
  const userStore = useUserStore();

  const handleLogin = async () => {
    try {
      errorMessage.value = '';
      const response = await postLogin({ email: email.value, password: password.value });
      if (response.status === 200) {
        userStore.fetchUserProfile();
        router.push('/dashboard');
        toast.success('Login successful!');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      errorMessage.value =
        error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error('Login failed');
    }
  };
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  onMounted(() => {
    const isLogin = getCookie('isLogin');
    if (isLogin === 'true') {
      router.push('/dashboard');
    }
  });
</script>

<template>
  <section>
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <img class="w-[200px] h-10 mb-5" :src="logoBlack" alt="logo" />
      <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl">
            Sign in to your account
          </h1>
          <form @submit.prevent="handleLogin" class="space-y-4 md:space-y-6">
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900"
                >Your email</label
              >
              <input
                v-model="email"
                type="email"
                name="email"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900"
                >Password</label
              >
              <input
                v-model="password"
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required
              />
            </div>
            <div v-if="errorMessage" class="text-sm text-red">{{ errorMessage }}</div>
            <div class="flex items-center justify-between">
              <a href="#" class="text-sm font-medium text-primary-600 hover:underline"
                >Forgot password?</a
              >
            </div>
            <button
              type="submit"
              class="w-full text-white bg-primary focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
