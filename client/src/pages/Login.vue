<script setup>
  import LoginForm from '@/components/login/LoginPopup.vue';
  import SignupForm from '@/components/login/SignupPopup.vue';
  import Dialog from 'primevue/dialog';
  import Tabs from 'primevue/tabs';
  import TabList from 'primevue/tablist';
  import Tab from 'primevue/tab';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';
  import logoBlack from '@assets/logoBlack.svg';
  import { useTabStore } from '@/stores/tab.store';
  import { computed } from 'vue';

  const scrollableTabs = [
    { title: 'Login', value: '0', component: LoginForm },
    { title: 'Sign Up', value: '1', component: SignupForm },
  ];
  const tabStore = useTabStore();
  const onTabChange = (event) => {
    tabStore.setActiveTab(event.value);
  };
  const activeTab = computed(() => tabStore.activeTab);

  console.log(tabStore.activeTab);
</script>

<template>
  <Dialog modal :draggable="false" class="w-[560px]">
    <template #header>
      <img :src="logoBlack" alt="Logo" class="h-8 mx-auto" />
    </template>
    <Tabs :value="activeTab" @tab-change="onTabChange" scrollable class="mb-4">
      <TabList>
        <Tab v-for="tab in scrollableTabs" :key="tab.value" :value="tab.value">
          {{ tab.title }}
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel v-for="tab in scrollableTabs" :key="tab.value" :value="tab.value">
          <component :is="tab.component" />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </Dialog>
</template>
<style scoped></style>
