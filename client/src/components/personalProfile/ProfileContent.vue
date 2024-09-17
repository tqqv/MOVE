<script setup>
  import { ref, markRaw } from 'vue';
  import Divider from '@/components/Divider.vue';
  import Button from 'primevue/button';
  import Tabs from 'primevue/tabs';
  import TabList from 'primevue/tablist';
  import Tab from 'primevue/tab';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';
  import ProfileEdit from '@components/personalProfile/ProfileEdit.vue';
  import NotificationEdit from '@components/personalProfile/NotificationEdit.vue';
  import { useUserStore } from '@/stores/user.store';

  const tabs = ref([
    { title: 'Profile', component: markRaw(ProfileEdit), value: '0' },
    { title: 'Notification', component: markRaw(NotificationEdit), value: '1' },
  ]);

  const userStore = useUserStore();
</script>

<template>
  <section class="px-10 pb-0 flex-grow">
    <!-- EMAIL EMPTY -->
    <div class="flex gap-y-4 gap-x-2 items-start justify-between notification_custom relative">
      <h1 class="text_para text-left">
        Your email is not setup yet. You may not be able to receive any
        <span class="font-bold">billing information</span> or
        <span class="font-bold">announcement</span> from MOVE.
      </h1>
      <Button label="Setup email now" class="btn hidden md:block" />
      <button @click="close" class="pi pi-times block md:hidden" />
    </div>
    <!-- CONTENT -->
    <div>
      <div class="flex items-center gap-x-[30px]">
        <h1 class="text_title">Settings</h1>
        <Divider />
      </div>
      <div class="mt-2">
        <Tabs value="0">
          <TabList>
            <Tab v-for="tab in tabs" :key="tab.title" :value="tab.value">{{ tab.title }}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel v-for="tab in tabs" :key="tab.component" :value="tab.value">
              <component :is="tab.component" />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
    <div></div>
  </section>
</template>

<style></style>
