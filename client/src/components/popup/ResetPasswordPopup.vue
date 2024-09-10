<script setup>
  import { ref, computed } from 'vue';
  import Dialog from 'primevue/dialog';
  import Button from 'primevue/button';

  const password = ref('');
  const confirmPassword = ref('');
  const showPassword = ref(false);
  const showConfirmPassword = ref(false);
  const showResetPopup = ref(false);

  const isButtonDisabled = computed(() => {
    return (
      !(password.value.trim() && confirmPassword.value.trim()) ||
      password.value !== confirmPassword.value
    );
  });

  const buttonColor = computed(() => {
    return !isButtonDisabled.value ? 'btn' : 'btnDisable';
  });

  const togglePasswordVisibility = (type) => {
    if (type === 'password') {
      showPassword.value = !showPassword.value;
    } else if (type === 'confirmPassword') {
      showConfirmPassword.value = !showConfirmPassword.value;
    }
  };

  const submitResetForm = () => {
    if (!isButtonDisabled.value) {
      console.log('Form Submitted', {
        password: password.value,
        confirmPassword: confirmPassword.value,
      });
    }
  };
</script>

<template>
  <div>
    <Button label="Show Reset" @click="showResetPopup = true" />

    <Dialog
      v-model:visible="showResetPopup"
      header="Create new password"
      :draggable="false"
      class="w-[424px]"
    >
      <div class="space-y-4">
        <span class="text_para">
          Please enter your new password. Ensure it is alphanumeric and at least 8 characters long.
        </span>

        <form @submit.prevent="submitResetForm" class="w-full mt-4 space-y-4">
          <div class="space-y-2">
            <div class="relative">
              <label for="password" class="text_para">New Password</label>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="input_custom"
                required
              />
              <button
                @click="togglePasswordVisibility('password')"
                type="button"
                class="absolute inset-y-1/2 end-0 z-20 px-3 cursor-pointer text-[#666666]"
              >
                <i :class="showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
              </button>
            </div>

            <div class="relative">
              <label for="confirmPassword" class="text_para">Confirm Password</label>
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="input_custom"
                required
              />
              <button
                @click="togglePasswordVisibility('confirmPassword')"
                type="button"
                class="absolute inset-y-1/2 end-0 z-20 px-3 cursor-pointer text-[#666666]"
              >
                <i :class="showConfirmPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
              </button>
            </div>
          </div>
          <div class="flex justify-center">
            <button type="submit" :class="['w-1/2 p-2', buttonColor]" :disabled="isButtonDisabled">
              Confirm
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
