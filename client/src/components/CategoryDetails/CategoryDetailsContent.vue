<script setup>
  import { ref, markRaw } from 'vue';
  import Tabs from 'primevue/tabs';
  import TabList from 'primevue/tablist';
  import Tab from 'primevue/tab';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';
  import CategorySelected from './CategorySelected.vue';
  import TabVideos from './TabVideos.vue';
  import TabLiveChannels from './TabLiveChannels.vue';
  const tabs = ref([
    { title: 'Videos', component: markRaw(TabVideos), value: '0' },
    { title: 'Live Channel', component: markRaw(TabLiveChannels), value: '1' },
  ]);
</script>

<template>
  <section class="px-10 flex-grow mr-14">
    <div class="flex items-center pl-4">
      <CategorySelected />
    </div>
    <div>
      <div class="mt-2">
        <Tabs value="0">
          <TabList>
            <Tab v-for="tab in tabs" :key="tab.title" :value="tab.value">{{ tab.title }}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel v-for="tab in tabs" :key="tab.component" :value="tab.value">
              <component :is="tab.component" :videoDetails="videoDetails" />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
    <div></div>
  </section>
</template>

<style></style>
