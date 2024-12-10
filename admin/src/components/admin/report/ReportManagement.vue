<script setup>
  import { onMounted, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import Filter from '@/components/Filter.vue';
  import Status from '@/components/Status.vue';
  import { usePopupStore } from '@/stores';
  import SuspendPopup from './SuspendPopup.vue';
  import { getAllReportComment } from '@/services/report';
  import { list } from 'postcss';

  const router = useRouter();
  const popupStore = usePopupStore();
  const page = ref(1);
  const pageSize = ref(5);

  const listReport = ref([]);
  const reports = ref([
    {
      id: '1',
      reporter: {
        imgUrl: 'https://img.upanh.tv/2024/06/18/user-avatar.png',
        username: 'yetserlewlewlelew',
        email: 'viet@gmail.com',
      },
      targetAccount: {
        imgUrl:
          'https://res.cloudinary.com/dg9imqwrd/image/upload/v1731636775/ftd2kx7oxzbpur1llk2e.jpg',
        username: 'thehoang.17',
        email: 'channel@gmail.com',
      },
      qualityReport: 3,
      reportType: {
        type: 'comment',
        description: 'Nudity or sexual activity',
      },
      targetId: '12313123',
      status: 'pending',
      createAt: '09/11/2024',
    },
    {
      id: '2',
      reporter: {
        imgUrl: 'https://img.upanh.tv/2024/06/18/user-avatar.png',
        username: 'yetserlewlewlelew',
        email: 'viet@gmail.com',
      },
      targetAccount: {
        imgUrl:
          'https://res.cloudinary.com/dg9imqwrd/image/upload/v1731636775/ftd2kx7oxzbpur1llk2e.jpg',
        username: 'thehoang.17',
        email: 'channel@gmail.com',
      },
      qualityReport: 3,
      reportType: {
        type: 'video',
        description: 'Nudity or sexual activity',
      },
      targetId: '12313123',
      status: 'accepted',
      createAt: '09/11/2024',
    },
    {
      id: '3',
      reporter: {
        imgUrl: 'https://img.upanh.tv/2024/06/18/user-avatar.png',
        username: 'yetserlewlewlelew',
        email: 'viet@gmail.com',
      },
      targetAccount: {
        imgUrl:
          'https://res.cloudinary.com/dg9imqwrd/image/upload/v1731636775/ftd2kx7oxzbpur1llk2e.jpg',
        username: 'thehoang.17',
        email: 'channel@gmail.com',
      },
      qualityReport: 3,
      reportType: {
        type: 'account',
        description: 'Nudity or sexual activity',
      },
      targetId: '12313123',
      status: 'rejected',
      createAt: '09/11/2024',
    },
    {
      id: '4',
      reporter: {
        imgUrl: 'https://img.upanh.tv/2024/06/18/user-avatar.png',
        username: 'yetserlewlewlelew',
        email: 'viet@gmail.com',
      },
      targetAccount: {
        imgUrl:
          'https://res.cloudinary.com/dg9imqwrd/image/upload/v1731636775/ftd2kx7oxzbpur1llk2e.jpg',
        username: 'thehoang.17',
        email: 'channel@gmail.com',
      },
      qualityReport: 3,
      reportType: {
        type: 'live stream',
        description: 'Nudity or sexual activity',
      },
      targetId: '12313123',
      status: 'pending',
      createAt: '09/11/2024',
    },
  ]);

  const handleRowClick = (event) => {
    console.log('row click:', event.data.id);
    router.push(`report/${event.data.id}`);
  };

  // HANDLE FILTER
  const sortByStatus = [
    { id: 0, name: 'All', value: '' },
    { id: 1, name: 'Pending', value: 'pending' },
    { id: 2, name: 'Accept', value: 'accept' },
    { id: 3, name: 'Reject', value: 'reject' },
  ];

  const sortByType = [
    { id: 0, name: 'Comment', value: 'comment' },
    { id: 1, name: 'Video', value: 'video' },
    { id: 2, name: 'Live stream', value: 'livestream' },
    { id: 3, name: 'Account', value: 'account' },
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

  const fetchReportComment = async () => {
    try {
      const params = {
        page: page.value,
        pageSize: pageSize.value,
      };
      if (selectedSortByStatus.value) {
        params.status = selectedSortByStatus.value;
      }
      const response = await getAllReportComment(params);
      listReport.value = response.data.data.listReportComment;
      console.log(listReport.value);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  watch([selectedSortByStatus, selectedSortByType], () => {
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
      <div class="bg-white p-4 shadow rounded-lg">
        <DataTable stripedRows :value="listReport" @row-click="handleRowClick">
          <template #header>
            <div class="flex flex-wrap gap-2 items-center justify-between">
              <h1 class="font-bold text-[20px] mb-3">Report {{ selectedSortByType }} list</h1>
            </div>
          </template>
          <Column header="STT" :body="(rowData, options) => options.rowIndex + 1"></Column>
          <Column header="Target">
            <template #body="{ data }">
              <div class="flex items-center gap-4">
                <!-- <img
                  :alt="data.targetAccount.imgUrl"
                  :src="data.targetAccount.imgUrl"
                  style="width: 40px"
                  class="rounded-full"
                /> -->
                <!-- <div>
                  <p class="font-semibold">{{ data.targetAccount.username }}</p>
                  <p>{{ data.targetAccount.email }}</p>
                </div> -->
              </div>
            </template>
          </Column>
          <Column field="reportCount" header="Number of reports"></Column>
          <Column field="status" header="Status" dataType="boolean">
            <template #body="{ data }">
              <Status :status="data.status" />
            </template>
          </Column>
        </DataTable>

        <!-- PANGING -->
        <div class="flex justify-end gap-x-12 items-center px-12 pt-6 mb-[20px]">
          <Filter
            :title="'Rows per page'"
            :options="pageSizeOptions"
            @change="selectedPageSize = $event.value"
          />
          <div>
            <span>
              {{ (currentPage - 1) * selectedPageSize + 1 }}
            </span>
            -
            <span>
              {{ Math.min(currentPage * selectedPageSize, totalRequest) }}
            </span>
            <span> of {{ totalRequest }} results</span>
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
  </section>
</template>
