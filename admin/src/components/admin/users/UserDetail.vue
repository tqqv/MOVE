<script setup>
  import { ref, onMounted, watch, markRaw } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { getProfilebyUserId } from '@/services/user';
  import Informations from './tabs/Informations.vue';
  import Tabs from 'primevue/tabs';
  import TabList from 'primevue/tablist';
  import Tab from 'primevue/tab';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';
  import Videos from './tabs/Videos.vue';
  import TransactionHistory from './tabs/TransactionHistory.vue';
  import Button from 'primevue/button';
  import Tag from 'primevue/tag';

  const route = useRoute();
  const router = useRouter();
  const activeTab = ref('0');
  const id = ref(route.params.id);
  const channel = ref(null);

  const onTabChange = (event) => {
    activeTab.value = event;
  };

  const fetchChannelData = async () => {
    const result = await getProfilebyUserId(id.value);
    channel.value = result.data.data.Channel;
    if (result.status === 404) {
      router.push('/404');
    }
  };

  onMounted(async () => {
    await fetchChannelData();
  });

  watch(
    () => route.params.id,
    async (newId) => {
      id.value = newId;
      activeTab.value = '0';
      fetchChannelData();
    },
  );
</script>
<template>
  <section class="bg-[#FAFAFB]">
    <div class="container">
      <div class="bg-white p-4 shadow rounded-lg">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-[24px] font-bold">
              User Detail <span class="opacity-50 text-[20px]">#{{ id }}</span>
            </h1>
            <div class="flex gap-x-4 items-center mt-4">
              <h2 class="font-semibold">Status:</h2>
              <Tag value="Normal" severity="info" />
            </div>
          </div>
          <div class="flex gap-x-5">
            <Button label="Suspend" severity="danger" />
            <Button label="Delete" severity="secondary" />
          </div>
        </div>
        <Tabs :value="activeTab" @update:value="onTabChange" class="mt-2">
          <TabList class="!p-0">
            <Tab value="0">Informations</Tab>
            <Tab value="1" v-if="channel">Videos</Tab>
            <Tab value="2">Transaction History</Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="0">
              <Informations :userId="id" />
            </TabPanel>
            <TabPanel value="1" v-if="channel">
              <Videos :channel="channel" />
            </TabPanel>
            <TabPanel value="2">
              <TransactionHistory />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  </section>
</template>
