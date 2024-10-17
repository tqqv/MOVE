<script setup>
  import { ref, onMounted, watch } from 'vue';
  import { formatRating, formatDatePosted } from '@/utils';
  import rate from '@/components/icons/rate.vue';
  import rep from '@/components/icons/rep.vue';

  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import { getVideoSetting, deleteVideoById } from '@services/video';
  import { genreDuration } from '@/utils';
  import { toast } from 'vue3-toastify';
  import { usePopupStore } from '@/stores';
  import Filter from '@/components/Filter.vue';
  const popupStore = usePopupStore();
  const currentPage = ref(1);
  const totalPage = ref();
  const totalVideo = ref(0);
  const selectedProduct = ref();
  const videos = ref([]);
  const showMenu = ref(false);

  const toggleShowMenu = () => {
    showMenu.value = !showMenu.value;
  };

  const pageSizeOptions = [
    { id: 1, name: 10, value: 10 },
    { id: 2, name: 20, value: 20 },
    { id: 3, name: 30, value: 30 },
  ];
  const selectedPageSize = ref(pageSizeOptions[0].name);

  const fetchVideos = async () => {
    try {
      const response = await getVideoSetting(currentPage.value, selectedPageSize.value);
      videos.value = response.data.listVideo.rows;
      totalVideo.value = response.data.listVideo.count;
      totalPage.value = response.data.totalPages;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };
  const goToNextPage = () => {
    if (currentPage.value < totalPage.value) {
      currentPage.value++;
    }
  };
  watch(selectedProduct, () => {
    console.log(selectedProduct);
  });
  watch([selectedPageSize], () => {
    currentPage.value = 1;
    fetchVideos();
  });
  onMounted(() => {
    fetchVideos();
  });
</script>
<template>
  <div class="container">
    <div class="flex justify-between">
      <h1 class="p-[16px] font-bold text-[24px]">Video analytics</h1>
      <div class="flex gap-4">
        <!-- <Filter :title="'SORT BY'" />
        <Filter :title="'SHOW'" /> -->
      </div>
    </div>

    <div class="card">
      <DataTable
        v-model:selection="selectedProduct"
        :value="videos"
        rowGroupMode="subheader"
        dataKey="id"
        tableStyle="min-width: 50rem"
      >
        <Column header="Videos">
          <template #body="{ data }">
            <img :src="data.thumbnailUrl" class="w-[180px] h-[100px] object-cover" />
          </template>
        </Column>
        <Column header="Details">
          <template #body="{ data }">
            <div class="space-y-4">
              <div>
                <h1 class="font-bold">{{ data.title }}</h1>
                <h1 v-if="data.category">{{ data.category.title }}</h1>
              </div>
              <div>{{ formatDatePosted(data.createdAt) }}</div>
            </div>
          </template>
        </Column>
        <Column header="Views">
          <template #body="{ data }">
            <span>{{ data.viewCount || 0 }}</span>
          </template>
        </Column>
        <Column header="Avg. view time">
          <template #body="{ data }">
            <span></span>
          </template>
        </Column>
        <Column header="Ratings">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <span>{{ formatRating(data.ratings) }}</span>
              <rate class="scale-125" />
            </div>
          </template>
        </Column>
        <Column header="REPs Received" class="!text-center">
          <template #body="{ data }">
            <div class="flex items-center gap-2"><rep /><span>500</span></div>
          </template></Column
        >

        <Column header="Viewer Gifted">
          <template #body="{ data }"> <span>500</span> </template>
        </Column>

        <Column field="" header="" style="display: none"></Column>
      </DataTable>
      <div class="flex justify-end gap-x-12 items-center px-12 py-3">
        <Filter :title="'Rows per page'" :options="pageSizeOptions" v-model="selectedPageSize" />
        <div class="">
          <span>
            {{ (currentPage - 1) * selectedPageSize + 1 }}
          </span>
          -
          <span>
            {{ Math.min(currentPage * selectedPageSize, totalVideo) }}
          </span>
          <span> of {{ totalVideo }} results</span>
        </div>
        <div class="flex gap-x-4 justify-center">
          <i
            @click="goToPreviousPage"
            class="pi pi-chevron-left cursor-pointer text-md hover:text-primary"
            :class="{ 'text-gray-dark hover:text-gray-dark cursor-auto': currentPage === 1 }"
          ></i>
          <i
            @click="goToNextPage"
            class="pi pi-chevron-right cursor-pointer text-md hover:text-primary"
            :class="{
              'text-gray-dark hover:text-gray-dark cursor-auto': currentPage === totalPage,
            }"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>
