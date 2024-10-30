<script setup>
  import { ref, markRaw, onMounted } from 'vue';
  import Tabs from 'primevue/tabs';
  import TabList from 'primevue/tablist';
  import Tab from 'primevue/tab';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';
  import CategorySelected from './CategorySelected.vue';
  import TabVideos from './TabVideos.vue';
  import TabLiveChannels from './TabLiveChannels.vue';
  import { getCategoryByTitle } from '@services/categories';

  import { useRoute } from 'vue-router';

  const route = useRoute();
  const categoryTitle = route.params.category;
  const props = defineProps({
    categoryTitle: {
      type: String,
    },
  });
  const categoryDetail = ref({});

  const tabs = ref([
    { title: 'Videos', component: markRaw(TabVideos), value: '0' },
    { title: 'Live Channel', component: markRaw(TabLiveChannels), value: '1' },
  ]);

  const fetchCategoryByTitle = async (title) => {
    try {
      const response = await getCategoryByTitle(title);
      console.log(response);

      categoryDetail.value = response.data;
      console.log(categoryDetail.value);
    } catch (error) {
      console.error(error.message);
    }
  };

  onMounted(() => {
    fetchCategoryByTitle(categoryTitle);
  });
</script>

<template>
  <section class="px-10 flex-grow mr-14 space-y-4">
    <div class="flex items-center pl-4">
      <CategorySelected
        :categoryDetail="categoryDetail[0]"
        @updateFollow="fetchCategoryByTitle(categoryTitle)"
      />
    </div>
    <div>
      <div>
        <Tabs value="0">
          <TabList>
            <Tab v-for="tab in tabs" :key="tab.title" :value="tab.value">{{ tab.title }}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel v-for="tab in tabs" :key="tab.component" :value="tab.value">
              <component :is="tab.component" :categoryTitle="categoryTitle" />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
    <div></div>
  </section>
</template>
