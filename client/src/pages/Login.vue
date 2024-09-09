<script setup>
  import LoginForm from '@/components/login/LoginPopup.vue';
  import SignupForm from '@/components/login/SignupPopup.vue';
  import ForgotPasswordPopup from '@/pages/ForgotPasswordPopup.vue';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  import Tabs from 'primevue/tabs';
  import TabList from 'primevue/tablist';
  import Tab from 'primevue/tab';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';
  import { ref } from 'vue';
  import logoBlack from '@assets/logoBlack.svg';

  const showLoginPopup = ref(false);
  const showForgotPasswordPopup = ref(false);

  const scrollableTabs = [
    { title: 'Login', value: '0', component: LoginForm },
    { title: 'Sign Up', value: '1', component: SignupForm },
  ];

  const openForgotPassword = () => {
    showLoginPopup.value = false;
    showForgotPasswordPopup.value = true;
  };

  const backToLoginPopup = () => {
    showForgotPasswordPopup.value = false;
    showLoginPopup.value = true;
  };
</script>

<template>
  <div>
    <Button label="Show" @click="showLoginPopup = true" />

    <Dialog v-model:visible="showLoginPopup" :draggable="false" class="w-[560px]">
      <template #header>
        <img :src="logoBlack" alt="Logo" class="h-8 mx-auto" />
      </template>
      <Tabs value="0" scrollable class="mb-4 custom-tabs">
        <TabList>
          <Tab v-for="tab in scrollableTabs" :key="tab.value" :value="tab.value">
            {{ tab.title }}
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel v-for="tab in scrollableTabs" :key="tab.value" :value="tab.value">
            <component :is="tab.component" @openForgotPassword="openForgotPassword" />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Dialog>

    <ForgotPasswordPopup
      v-model:visible="showForgotPasswordPopup"
      @backToLogin="backToLoginPopup"
    />
  </div>
</template>

<style>
  .p-tablist-active-bar {
    background-color: #13d0b4;
    height: 4px;
  }
  .p-tab-active {
    color: #13d0b4;
  }
</style>
