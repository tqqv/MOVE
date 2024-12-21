<script setup>
  import { ref, markRaw, onMounted, watch } from 'vue';
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
  import Skeleton from 'primevue/skeleton';

  const route = useRoute();
  const categoryTitle = ref(route.params.category);
  const categoryDetail = ref({});
  const loading = ref(true);

  const tabs = ref([
    { title: 'Videos', component: markRaw(TabVideos), value: '0' },
    { title: 'Live Channel', component: markRaw(TabLiveChannels), value: '1' },
  ]);

  const fetchCategoryByTitle = async (title) => {
    try {
      const loading = ref(true);
      const response = await getCategoryByTitle(title);
      categoryDetail.value = response.data;
      console.log(categoryDetail.value);
    } catch (error) {
      console.error(error.message);
    } finally {
      loading.value = false;
    }
  };
  watch(
    () => route.params.category,
    (newCategory) => {
      categoryTitle.value = newCategory;
      fetchCategoryByTitle(newCategory);
    },
  );
  onMounted(() => {
    fetchCategoryByTitle(categoryTitle.value);
  });
</script>

<template>
  <section class="px-10 flex-grow mr-14 space-y-4">
    <div v-if="loading" class="flex items-start pl-4 gap-x-4">
      <Skeleton width="9.2rem" height="13rem"></Skeleton>
      <div class="flex flex-col gap-y-2">
        <Skeleton width="4rem" height="1rem"></Skeleton>
        <Skeleton width="10rem" height="1rem"></Skeleton>
        <Skeleton width="6rem" height="1.4rem" class="mt-3"></Skeleton>
      </div>
    </div>
    <div v-else class="flex items-center pl-4">
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
