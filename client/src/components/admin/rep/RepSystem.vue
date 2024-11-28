<script setup>
  import { ref, onMounted, watch, markRaw } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import Tabs from 'primevue/tabs';
  import TabList from 'primevue/tablist';
  import Tab from 'primevue/tab';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';

  import DiscountItem from './tabs/DiscountItem.vue';
  import DonateItem from './tabs/DonateItem.vue';
  import Cashout from './tabs/Cashout.vue';

  const route = useRoute();
  const activeTab = ref('0');
  const tabs = ref([
    { title: 'Donate Item', component: markRaw(DonateItem), value: '0' },
    { title: 'Discount Item', component: markRaw(DiscountItem), value: '1' },
    { title: 'Cashout', component: markRaw(Cashout), value: '2' },
  ]);

  const onTabChange = (event) => {
    activeTab.value = event;
  };
</script>
<template>
  <section class="bg-[#FAFAFB]">
    <div class="container">
      <div class="bg-white p-4 shadow rounded-lg">
        <h1 class="text-[24px] font-bold">REP$ System</h1>
        <Tabs :value="activeTab" @update:value="onTabChange" class="mt-2">
          <TabList class="!p-0">
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
