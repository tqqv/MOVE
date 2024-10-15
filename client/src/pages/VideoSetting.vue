<script setup>
  import { ref, onMounted, watch } from 'vue';
  import { formatRating, formatDatePosted } from '@/utils';
  import rate from '@/components/icons/rate.vue';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Filter from '@/components/Filter.vue';
  import { getVideoSetting, deleteVideoById } from '@services/video';
  import { genreDuration } from '@/utils/calculatorDate';
  import { toast } from 'vue3-toastify';
  import { usePopupStore } from '@/stores';

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
  const handleDeleteVideo = async (videoId) => {
    try {
      const response = await deleteVideoById(videoId);
      if (response.status === 200) {
        toast.success('Video deleted successfully');
        fetchVideos();
      }
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
  <h1 class="p-[16px] font-bold text-[24px]">Videos</h1>
  <div v-if="videos.length > 0" class="card">
    <DataTable
      v-model:selection="selectedProduct"
      :value="videos"
      rowGroupMode="subheader"
      dataKey="id"
      tableStyle="min-width: 50rem"
    >
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column header="Videos">
        <template #body="{ data }">
          <img :src="data.thumbnailUrl" class="w-[180px] h-[100px] object-cover" />
        </template>
      </Column>
      <Column header="Details">
        <template #body="{ data }">
          <h1 class="font-bold">{{ data.title }}</h1>
          <h1 v-if="data.category">{{ data.category.title }}</h1>
          <div class="flex gap-3 mt-2">
            <span class="bg-[#EEEEEE] rounded-full text-black py-2 px-4" v-if="data.levelWorkout">
              {{ data.levelWorkout.levelWorkout }}</span
            >
            <span class="bg-[#EEEEEE] rounded-full text-black py-2 px-4">{{
              genreDuration(data.duration)
            }}</span>
          </div>
        </template>
      </Column>
      <Column header="Date Posted">
        <template #body="{ data }">
          <span>{{ formatDatePosted(data.createdAt) }}</span>
        </template>
      </Column>
      <Column header="Views">
        <template #body="{ data }">
          <span>{{ data.viewCount || 0 }}</span>
        </template>
      </Column>
      <Column field="comments" header="Comments" class="!text-center"></Column>
      <Column header="Ratings">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span>{{ formatRating(data.ratings) }}</span>
            <rate class="scale-125" />
          </div>
        </template>
      </Column>
      <Column header="Status">
        <template #body="{ data }">
          <span
            :class="`rounded-2xl ${
              data.status === 'private' ? 'bg-gray-dark' : 'bg-primary-light'
            } text-center px-6 py-1 pb-[6px] inline-block capitalize`"
          >
            {{ data.status }}
          </span>
        </template>
      </Column>
      <Column class="w-[136px] !text-end">
        <template #body="{ data }">
          <div class="video-settings">
            <div class="flex justify-between">
              <button class="pi pi-upload text-primary hover:text-primary-light"></button>
              <button class="pi pi-pencil text-primary hover:text-primary-light"></button>
              <div class="relative">
                <button
                  class="pi pi-ellipsis-v text-primary hover:text-primary-light"
                  @click="toggleShowMenu"
                ></button>
                <div
                  v-if="showMenu"
                  class="absolute bottom-7 right-0 bg-white p-4 rounded-lg border-primary-light border-2"
                >
                  <button
                    class="flex gap-3 items-center text-primary cursor-pointer hover:text-primary-light"
                    @click="handleDeleteVideo(data.id)"
                  >
                    <button class="pi pi-trash"></button>
                    <span class="text-nowrap">Delete video</span>
                  </button>
                  <button
                    class="flex gap-3 mt-3 items-center text-primary cursor-pointer hover:text-primary-light"
                  >
                    <button class="pi pi-download"></button>
                    <span class="text-nowrap">Download video</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Column>
      <Column field="" header="" style="display: none"></Column>
      <template #groupheader="{ data }">
        <div
          class="flex gap-10 justify-center border-primary border-2 rounded-lg bg-[#E6FFFB] py-3"
        >
          <span> <span class="font-bold">2</span> videos on this page has been selected.</span>
          <button class="font-bold text-primary hover:text-primary-light">
            Select all videos.
          </button>
        </div>
      </template>
    </DataTable>
    <div class="flex justify-end gap-x-12 items-center px-12 pt-3">
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
          :class="{ 'text-gray-dark hover:text-gray-dark cursor-auto': currentPage === totalPage }"
        ></i>
      </div>
    </div>
  </div>
  <div v-else class="px-[16px]">
    <h3 class="italic">You have not uploaded any videos yet.</h3>
    <button
      class="flex flex-row items-center gap-x-2 btn hover:bg-primary outline-none mt-3"
      @click="popupStore.openUploadVideoPopup"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <g id="Group_2444" data-name="Group 2444" transform="translate(-15 -46)">
          <rect
            id="Rectangle_855"
            data-name="Rectangle 855"
            width="24"
            height="24"
            transform="translate(15 46)"
            fill="none"
          />
          <g id="Group_2443" data-name="Group 2443" transform="translate(-322.5 -847.9)">
            <path
              id="Path_1069"
              data-name="Path 1069"
              d="M360.342,898.468l-4.421,2.675v-.963a4.191,4.191,0,0,0-4.211-4.279h-10a4.191,4.191,0,0,0-4.211,4.279v7.81a4.191,4.191,0,0,0,4.211,4.279h6.316a5.216,5.216,0,0,1,5.053-4.386h0a5.157,5.157,0,0,1,2.737.856c0-.214.105-.535.105-.749v-.963l4.421,2.675a.766.766,0,0,0,1.158-.749v-9.628C361.5,898.468,360.868,898.147,360.342,898.468Zm-10.316,5.884-4.842,2.781c-.211.107-.632,0-.632-.321v-5.563a.416.416,0,0,1,.632-.321l4.842,2.781C350.237,903.71,350.237,904.245,350.026,904.352Z"
              fill="#fff"
            />
            <path
              id="Path_1070"
              data-name="Path 1070"
              d="M352.3,907.8a4.2,4.2,0,1,0,4.2,4.2A4.225,4.225,0,0,0,352.3,907.8Zm2.2,4.9H353v1.5a.7.7,0,1,1-1.4,0v-1.5h-1.5a.7.7,0,0,1,0-1.4h1.5v-1.5a.7.7,0,1,1,1.4,0v1.5h1.5a.684.684,0,0,1,.7.7A.751.751,0,0,1,354.5,912.7Z"
              transform="translate(0.883 1.068)"
              fill="#fff"
            />
          </g>
        </g>
      </svg>

      <h1 class="mb-1">Upload a video</h1>
    </button>
  </div>
</template>
