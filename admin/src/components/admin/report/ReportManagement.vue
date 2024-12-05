<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import Tag from 'primevue/tag';
  import Button from 'primevue/button';
  import Filter from '@/components/Filter.vue';

  const router = useRouter();
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
      status: 'pending',
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
      status: 'pending',
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
        type: 'videos',
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

  const handleAccept = () => {
    alert('something');
  };
</script>

<template>
  <section class="px-8">
    <div class="container">
      <div class="flex justify-between items-start mb-7">
        <h1 class="text-2xl font-semibold">Report management</h1>
        <div class="flex flex-col gap-y-2">
          <Filter />
        </div>
      </div>
      <div class="bg-white p-4 shadow rounded-lg">
        <DataTable :value="reports" @row-click="handleRowClick">
          <Column field="id" header="ID"></Column>
          <Column header="Target">
            <template #body="{ data }">
              <div class="flex items-center gap-4">
                <img
                  :alt="data.targetAccount.imgUrl"
                  :src="data.targetAccount.imgUrl"
                  style="width: 40px"
                  class="rounded-full"
                />
                <div>
                  <p class="font-semibold">{{ data.targetAccount.username }}</p>
                  <p>{{ data.targetAccount.email }}</p>
                </div>
              </div>
            </template>
          </Column>
          <Column field="reportType.type" header="Type" class="capitalize"></Column>
          <!-- <Column field="reportType.description" header="Description"></Column> -->
          <!-- <Column header="Target">
            <template #body="{ data }">
              <div class="flex items-center gap-4">
                <img
                  :alt="data.targetAccount.imgUrl"
                  :src="data.targetAccount.imgUrl"
                  style="width: 40px"
                  class="rounded-full"
                />
                <div>
                  <p class="font-semibold">{{ data.targetAccount.username }}</p>
                  <p>{{ data.targetAccount.email }}</p>
                </div>
              </div>
            </template>
          </Column> -->
          <Column field="qualityReport" header="Number of reports"></Column>
          <Column field="status" header="Status" dataType="boolean">
            <template #body="{ data }">
              <div class="flex items-center gap-x-2">
                <div class="size-2 mt-0.5 bg-blue rounded-full"></div>
                <span class="capitalize text-blue font-semibold">{{ data.status }}</span>
              </div>
            </template>
          </Column>
          <Column header="Action" class="max-w-48">
            <template #body="{ data }">
              <div class="flex items-center gap-x-3">
                <button class="btn-success" @click.stop="handleAccept">Accept</button>
                <button class="btn-reject">Reject</button>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </section>
</template>

<style lang="css" scoped>
  ::v-deep(.p-row-even:hover) {
    cursor: pointer;
  }
  ::v-deep(.p-row-odd:hover) {
    cursor: pointer;
  }
</style>
