<script setup>
  import { ref, computed, defineEmits } from 'vue';
  import CheckboxCustom from '../CheckboxCustom.vue';
  import Button from 'primevue/button';

  const username = ref('npmh310');
  const email = ref('No found email');
  const fullname = ref('Minh Hieu');
  const gender = ref('Male');

  const setDisabledEmail = ref('true');
  const handleSetDisabledEmail = () => {};

  const selectedGender = ref(gender);

  function updateSelection(value) {
    selectedGender.value = value;
  }
</script>
<template>
  <form class="my-2">
    <div class="flex flex-col gap-y-5">
      <h1 class="font-bold">Profile picture</h1>
      <div>
        <img
          src="https://scontent.fdad1-2.fna.fbcdn.net/v/t39.30808-6/457513733_122229466964002441_2844223550811568095_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=XzChrlPOGI8Q7kNvgGsRtpt&_nc_ht=scontent.fdad1-2.fna&oh=00_AYD1-_765OQ0K6oQ1_iM01kBg9JFLLJ0emImHh-wRS2XGQ&oe=66E4538B"
          alt="avatar-user"
          class="size-16 rounded-full"
        />
      </div>
      <span class="text-primary cursor-pointer text-[14px] hover:font-medium"
        >Update profile picture</span
      >
    </div>
    <div class="flex flex-col w-full md:w-1/2 my-3">
      <div class="flex flex-col gap-y-4">
        <div class="flex flex-col gap-y-1">
          <label for="username" class="text_para">Username</label>
          <input v-model="username" value="" type="text" class="input_custom" required />
        </div>
        <div class="flex flex-col gap-y-1">
          <label for="email" class="text_para">Email</label>
          <div class="relative">
            <input
              v-model="email"
              type="email"
              :disabled="setDisabledEmail"
              class="input_custom"
              :class="{ 'italic text-body text-[12px] md:text-[14px]': setDisabledEmail }"
              required
            />
            <p
              @click="handleSetDisabledEmail"
              class="absolute text-[13px] right-3 top-2 mt-1 text-primary cursor-pointer"
            >
              Setup email
            </p>
          </div>
        </div>
        <div class="flex flex-col gap-y-1">
          <label for="fullname" class="text_para">Fullname</label>
          <input v-model="fullname" value="" type="text" class="input_custom" required />
        </div>
        <div class="flex flex-col gap-y-6">
          <!--FORGOT PASSWORD  -->
          <div class="flex flex-col gap-y-1">
            <label for="password" class="text_para">Password</label>
            <span class="text-primary cursor-pointer text-[14px] underline">Change password</span>
          </div>
          <!-- GENDER -->
          <div class="flex flex-col gap-y-2">
            <label for="gender" class="text_para">Gender</label>
            <div class="flex gap-x-10">
              <CheckboxCustom
                label="Male"
                groupName="gender"
                :checked="selectedGender === 'Male'"
                @update:modelValue="updateSelection('Male')"
              />
              <CheckboxCustom
                label="Female"
                groupName="gender"
                :checked="selectedGender === 'Female'"
                @update:modelValue="updateSelection('Female')"
              />
            </div>
          </div>
          <!-- DATE OF BIRTH -->
          <div class="flex flex-col gap-y-2 w-full md:w-1/2">
            <label for="gender" class="text_para">Date of birth</label>
            <div class="flex gap-x-4">
              <select
                name="date"
                class="text-md flex-1 px-1 py-1.5 ring-1 ring-gray-dark rounded-md outline-none focus-within:ring-primary"
              >
                <option>31</option>
              </select>
              <select
                name="month"
                class="text-md flex-1 px-1 py-1.5 ring-1 ring-gray-dark rounded-md outline-none focus-within:ring-primary"
              >
                <option>Dec</option>
              </select>
              <select
                name="year"
                class="text-md flex-1 px-1 py-1.5 ring-1 ring-gray-dark rounded-md outline-none focus-within:ring-primary"
              >
                <option>2002</option>
              </select>
            </div>
          </div>
          <!-- COUNTRY VS STATE -->
          <div class="flex flex-col md:flex-row gap-y-4 md:gap-x-3">
            <div class="flex flex-col gap-y-2 flex-1">
              <label for="gender" class="text_para">Country</label>
              <select
                name="country"
                class="text-md px-1 py-1.5 ring-1 ring-gray-dark rounded-md outline-none focus-within:ring-primary"
              >
                <option>Vietnam</option>
              </select>
            </div>
            <div class="flex flex-col gap-y-2 flex-1">
              <label for="gender" class="text_para">State</label>
              <select
                name="country"
                class="text-md px-1 py-1.5 ring-1 ring-gray-dark rounded-md outline-none focus-within:ring-primary"
              >
                <option>Quang Nam</option>
              </select>
            </div>
          </div>
          <!-- CITY -->
          <div class="flex flex-col w-full md:w-1/2 gap-y-2">
            <label for="gender" class="text_para">City</label>
            <input type="text" class="input_custom" />
          </div>
        </div>
      </div>
      <Button label="Save settings" class="btn w-full md:w-1/2 mt-8" />
    </div>
  </form>
</template>
