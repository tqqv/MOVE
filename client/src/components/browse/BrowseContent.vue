<script setup>
  import { ref, markRaw } from 'vue';

  import Tabs from 'primevue/tabs';
  import TabList from 'primevue/tablist';
  import Tab from 'primevue/tab';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';
  import Divider from '@/components/Divider.vue';
  import CategoryImage from '@/components/CategoryImage.vue';
  import TabTopVideo from './TabTopVideo.vue';
  import TabMostView from './TabMostView.vue';
  import TabHighestRated from './TabHighestRated.vue';
  const tabs = ref([
    { title: 'Categories', component: markRaw(CategoryImage), value: '0' },
    { title: 'Top videos', component: markRaw(TabTopVideo), value: '1' },
    { title: 'Most viewed', component: markRaw(TabMostView), value: '2' },
    { title: 'Highest rated', component: markRaw(TabHighestRated), value: '3' },
  ]);
</script>

<template>
  <section class="px-10 flex-grow mr-14">
    <div class="flex items-center pl-4">
      <span class="font-bold text-[24px]">Browse</span>
      <Divider class="flex-grow mx-4" />
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
