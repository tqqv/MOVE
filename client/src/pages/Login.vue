<script setup>
  import { watch } from 'vue';
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
  import { usePopupStore } from '@/stores/popup.store';

  import { computed } from 'vue';
  const tabStore = useTabStore();

  const scrollableTabs = [
    { title: 'Login', value: '0', component: LoginForm },
    { title: 'Sign Up', value: '1', component: SignupForm },
  ];
  const popupStore = usePopupStore();
  const activeTab = computed(() => tabStore.activeTab);

  const onTabChange = (event) => {
    console.log('Tab changed to:', event);
    tabStore.setActiveTab(event);
  };
</script>

<template>
  <Dialog
    :visible="popupStore.showLoginPopup"
    :modal="true"
    :draggable="false"
    @update:visible="
      popupStore.showLoginPopup = !popupStore.showLoginPopup && tabStore.clearActiveTab()
    "
    class="w-[560px]"
    dismissableMask="true"
  >
    <template #header>
      <img :src="logoBlack" alt="Logo" class="h-8 mx-auto" />
    </template>
    <Tabs :value="activeTab" @update:value="onTabChange" scrollable class="mb-4">
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
