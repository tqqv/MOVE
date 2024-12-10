<script setup>
  import { onMounted, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import Filter from '@/components/Filter.vue';
  import Status from '@/components/Status.vue';
  import { usePopupStore } from '@/stores';
  import {
    getAllReportAccount,
    getAllReportChannel,
    getAllReportComment,
    getAllReportLivestream,
    getAllReportVideo,
  } from '@/services/report';
  import { formatView } from '@/utils';
  import EmptyImage from '@/components/icons/emptyImage.vue';
  import EmptyPage from '@/pages/EmptyPage.vue';
  import Skeleton from 'primevue/skeleton';
  import { list } from 'postcss';

  const router = useRouter();
  const popupStore = usePopupStore();
  const page = ref(1);
  const totalPage = ref(0);
  const totalItem = ref(0);
  const listReport = ref([]);
  const isLoading = ref(true);
  const selectedReport = ref(null);
  // ROUTE
  const handleRowClick = (rowData) => {
    selectedReport.value = rowData;
    router.push(
      `report/${
        selectedReport.value.data.targetCommentId ||
        selectedReport.value.data.targetVideoId ||
        selectedReport.value.data.targetLivestreamId ||
        selectedReport.value.data.targetChannelId ||
        selectedReport.value.data.targetAccountId
      }`,
    );
  };

  // HANDLE FILTER
  const sortByStatus = [
    { id: 0, name: 'All', value: '' },
    { id: 1, name: 'Pending', value: 'pending' },
    { id: 2, name: 'Approved', value: 'approved' },
    { id: 3, name: 'Rejected', value: 'rejected' },
    { id: 4, name: 'Suspended', value: 'suspended' },
    { id: 5, name: 'Banned', value: 'banned' },
  ];

  const sortByType = [
    { id: 0, name: 'Comment', value: 'comment' },
    { id: 1, name: 'Video', value: 'video' },
    { id: 2, name: 'Live stream', value: 'livestream' },
    { id: 3, name: 'Channel', value: 'channel' },
    { id: 4, name: 'Account', value: 'account' },
  ];

  const selectedSortByStatus = ref(sortByStatus[0].value);
  const selectedSortByType = ref(sortByType[0].value);

  const handleSortChange = (newValue) => {
    selectedSortByStatus.value = newValue.value || '';
  };

  const handleSortType = (newValue) => {
    selectedSortByType.value = newValue.value || '';
  };

  // PANGING
  const pageSizeOptions = [
    { id: 1, name: 10, value: 10 },
    { id: 2, name: 20, value: 20 },
    { id: 3, name: 30, value: 30 },
  ];
  const selectedPageSize = ref(pageSizeOptions[0].value);

  // CALL LIST REPORT
  const fetchReportComment = async () => {
    try {
      isLoading.value = true;
      const params = {
        page: page.value,
        pageSize: selectedPageSize.value,
        status: selectedSortByStatus.value || undefined,
      };
      let response;
      if (selectedSortByType.value == 'comment') {
        response = await getAllReportComment(params);
        listReport.value = response.data.data.listReportComment;
      } else if (selectedSortByType.value == 'video') {
        response = await getAllReportVideo(params);
        listReport.value = response.data.data.listReportVideo;
      } else if (selectedSortByType.value == 'livestream') {
        response = await getAllReportLivestream(params);
        listReport.value = response.data.data.listReportLivestream;
      } else if (selectedSortByType.value == 'channel') {
        response = await getAllReportChannel(params);
        listReport.value = response.data.data.listReportChannel;
      } else if (selectedSortByType.value == 'account') {
        response = await getAllReportAccount(params);
        listReport.value = response.data.data.listReportAccount;
      }
      totalPage.value = response.data.data.totalPages;
      totalItem.value = response.data.data.count;
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  };

  // PANGING
  const goToPreviousPage = () => {
    if (page.value > 1) {
      page.value--;
      fetchReportComment();
    }
  };

  const goToNextPage = () => {
    if (page.value < totalPage.value) {
      page.value++;
      fetchReportComment();
    }
  };

  watch([selectedPageSize, selectedSortByType, selectedSortByStatus], () => {
    page.value = 1;
    fetchReportComment();
  });

  onMounted(() => {
    fetchReportComment();
  });
</script>

<template>
  <section>
    <div class="container">
      <div class="flex justify-between items-start mb-7">
        <h1 class="text-2xl font-bold">Report management</h1>
        <div class="flex gap-x-6">
          <Filter title="Type report" :options="sortByType" @change="handleSortType" />
          <Filter title="Status" :options="sortByStatus" @change="handleSortChange" />
        </div>
      </div>
      <div class="bg-white p-4 shadow rounded-lg text-sm">
        <DataTable
          v-if="isLoading"
          :value="
            Array(5).fill({
              imgUrl: '',
              title: '',
              description: '',
              videoCount: '',
              livestreamCount: '',
              totalViews: '',
            })
          "
          stripedRows
        >
          <Column header="Content">
            <template #body>
              <Skeleton
                class="my-3"
                :class="{
                  'py-10 ': selectedSortByType === 'video' || selectedSortByType === 'livestream',
                }"
              />
            </template>
          </Column>
          <Column v-if="selectedSortByType === 'comment'" style="width: 120px" header="REPs">
            <template #body>
              <Skeleton />
            </template>
          </Column>
          <Column header="Target">
            <template #body>
              <Skeleton />
            </template>
          </Column>
          <Column header="Quantity">
            <template #body>
              <Skeleton />
            </template>
          </Column>
          <Column header="Status">
            <template #body>
              <Skeleton />
            </template>
          </Column>
          <Column style="width: 7rem">
            <template #body>
              <Skeleton />
            </template>
          </Column>
        </DataTable>
        <DataTable
          v-else-if="listReport.length > 0 && !isLoading"
          class="cursor-pointer"
          stripedRows
          :value="listReport"
          @row-click="handleRowClick"
        >
          <template #header>
            <div class="flex flex-wrap gap-2 items-center justify-between">
              <h1 class="font-bold text-[20px] mb-3">Report {{ selectedSortByType }} list</h1>
            </div>
          </template>
          <!-- CONTENT -->
          <Column
            v-if="selectedSortByType !== 'channel' && selectedSortByType !== 'account'"
            :style="{ width: selectedSortByType === 'video' ? '500px' : '400px' }"
            header="Content"
          >
            <!-- COMMENT -->
            <template v-if="selectedSortByType === 'comment'" #body="{ data }">
              <div class="flex gap-x-3" :title="data.Comment?.content">
                <span class="line-clamp-3 overflow-hidden text-ellipsis">
                  {{ data.Comment?.content }}
                </span>
              </div>
            </template>
            <!-- VIDEO -->
            <template v-if="selectedSortByType === 'video'" #body="{ data }">
              <div class="flex gap-x-3" :title="data.Video?.title">
                <img
                  class="w-36 h-20 rounded-md object-cover flex-shrink-0"
                  :src="data.Video?.thumbnailUrl"
                  alt=""
                />
                <span class="line-clamp-3 overflow-hidden text-ellipsis">
                  {{ data.Video?.title }}
                </span>
              </div>
            </template>
            <!-- LIVE -->
            <template v-if="selectedSortByType === 'livestream'" #body="{ data }">
              <div class="flex gap-x-3" :title="data.Livestream?.title">
                <img
                  class="w-36 h-20 rounded-md object-cover flex-shrink-0"
                  :src="data.Livestream?.thumbnailUrl"
                  alt=""
                />
                <span class="line-clamp-3 overflow-hidden text-ellipsis">
                  {{ data.Livestream?.title }}
                </span>
              </div>
            </template>
          </Column>
          <!-- REPS -->
          <Column v-if="selectedSortByType === 'comment'" class="px-12" header="REPs">
            <template #body="{ data }">
              <div class="flex gap-x-3">
                <span class="font-semibold">{{
                  data.Comment?.rep === 0 ? '' : formatView(data.Comment?.rep)
                }}</span>
              </div>
            </template>
          </Column>
          <!-- TAEGET -->
          <Column header="Target">
            <!-- COMMENT -->
            <template v-if="selectedSortByType === 'comment'" #body="{ data }">
              <div class="flex items-center gap-4">
                <img
                  :alt="data.Comment?.userComments.avatar"
                  :src="data.Comment?.userComments.avatar"
                  class="flex-shrink-0 size-10 rounded-full"
                />
                <div>
                  <p class="font-semibold">{{ data.Comment?.userComments.username }}</p>
                  <p>{{ data.Comment?.userComments.email }}</p>
                </div>
              </div>
            </template>
            <!-- VIDEO -->
            <template v-if="selectedSortByType === 'video'" #body="{ data }">
              <div class="flex items-center gap-4">
                <img
                  :alt="data.Video?.channel.avatar"
                  :src="data.Video?.channel.avatar"
                  class="flex-shrink-0 size-10 rounded-full object-cover"
                />
                <div>
                  <p class="font-semibold">{{ data.Video?.channel.channelName }}</p>
                  <p class="">@{{ data.Video?.channel.User.username }}</p>
                </div>
              </div>
            </template>
            <!-- LIVE -->
            <template v-if="selectedSortByType === 'livestream'" #body="{ data }">
              <div class="flex items-center gap-4">
                <img
                  :alt="data.Livestream?.livestreamChannel.avatar"
                  :src="data.Livestream?.livestreamChannel.avatar"
                  class="flex-shrink-0 size-10 rounded-full object-cover"
                />
                <div>
                  <p class="font-semibold">{{ data.Livestream?.livestreamChannel.channelName }}</p>
                  <p class="">@{{ data.Livestream?.livestreamChannel?.User.username }}</p>
                </div>
              </div>
            </template>
            <!-- CHANNEL -->
            <template v-if="selectedSortByType === 'channel'" #body="{ data }">
              <div class="flex items-center gap-4">
                <img
                  :alt="data.Channel?.avatar"
                  :src="data.Channel?.avatar"
                  class="flex-shrink-0 size-10 rounded-full object-cover"
                />
                <div>
                  <p class="font-semibold">{{ data.Channel?.channelName }}</p>
                  <p class="">@{{ data.Channel?.User.username }}</p>
                </div>
              </div>
            </template>
            <!-- ACCOUNT -->
            <template v-if="selectedSortByType === 'account'" #body="{ data }">
              <div class="flex items-center gap-4">
                <img
                  :alt="data.targetUser?.avatar"
                  :src="data.targetUser?.avatar"
                  class="flex-shrink-0 size-10 rounded-full object-cover"
                />
                <div>
                  <p class="font-semibold">{{ data.targetUser?.username }}</p>
                  <p class="">@{{ data.targetUser?.email }}</p>
                </div>
              </div>
            </template>
          </Column>
          <!-- QUALITY VS STATUS -->
          <Column style="min-width: 140px" field="reportCount" header="Quantity"></Column>
          <Column style="min-width: 120px" field="status" header="Status" dataType="boolean">
            <template #body="{ data }">
              <Status :status="data.status" />
            </template>
          </Column>
        </DataTable>
        <!-- EMPTY -->
        <div v-if="listReport.length == 0 && !isLoading" class="p-4">
          <h1 class="font-bold text-[20px] mb-3 text-[#334155]">
            Report {{ selectedSortByType }} list
          </h1>
          <EmptyPage title="No matching results" subTitle="Please try again" />
        </div>
        <!-- PANGING -->
        <div
          v-if="listReport.length > 0"
          class="flex justify-end gap-x-12 items-center px-12 pt-6 mb-[20px]"
        >
          <Filter
            :title="'Rows per page'"
            :options="pageSizeOptions"
            @change="selectedPageSize = $event.value"
          />
          <div>
            <span>
              {{ (page - 1) * selectedPageSize + 1 }}
            </span>
            -
            <span>
              {{ Math.min(page * selectedPageSize, totalItem) }}
            </span>
            <span> of {{ totalItem }} results</span>
          </div>
          <div class="flex gap-x-4 justify-center">
            <i
              @click="goToPreviousPage"
              class="pi pi-chevron-left cursor-pointer text-md hover:text-primary"
              :class="{ 'text-gray-dark hover:text-gray-dark cursor-auto': page === 1 }"
            ></i>
            <i
              @click="goToNextPage"
              class="pi pi-chevron-right cursor-pointer text-md hover:text-primary"
              :class="{
                'text-gray-dark hover:text-gray-dark cursor-auto': page === totalPage,
              }"
            ></i>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
