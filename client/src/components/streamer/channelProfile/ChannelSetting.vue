<script setup>
  import { ref, markRaw } from 'vue';
  import Divider from '@/components/Divider.vue';
  import Tabs from 'primevue/tabs';
  import TabList from 'primevue/tablist';
  import Tab from 'primevue/tab';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';
  import ChannelProfileSetting from './ChannelProfileSetting.vue';
  import ChannelNotificationSetting from './ChannelNotificationSetting.vue';

  const tabs = ref([
    { title: 'Channel', component: markRaw(ChannelProfileSetting), value: '0' },
    { title: 'Notification', component: markRaw(ChannelNotificationSetting), value: '1' },
  ]);
</script>
<template>
  <section class="px-10 pb-0 flex-grow">
    <div>
      <div class="flex items-center flex-nowrap gap-x-[30px]">
        <h1 class="text_title">Channel Settings</h1>
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
  </section>
</template>

<style scoped>
  .p-tablist {
    padding: 0 0;
  }
</style>
