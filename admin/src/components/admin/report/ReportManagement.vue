<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import Tag from 'primevue/tag';
  import Button from 'primevue/button';

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
  <section class="bg-[#FAFAFB]">
    <div class="container">
      <div class="card bg-white p-4 shadow rounded-lg">
        <DataTable :value="reports" stripedRows showGridlines @row-click="handleRowClick">
          <template #header>
            <div class="flex flex-wrap gap-2 items-center justify-between">
              <h1 class="font-bold text-[20px]">Manage Report</h1>
            </div>
          </template>
          <Column field="id" header="ID"></Column>
          <Column header="Reporter">
            <template #body="{ data }">
              <div class="flex items-center gap-4">
                <img
                  :alt="data.reporter.imgUrl"
                  :src="data.reporter.imgUrl"
                  style="width: 40px"
                  class="rounded-full"
                />
                <div>
                  <p class="font-semibold">{{ data.reporter.username }}</p>
                  <p>{{ data.reporter.email }}</p>
                </div>
              </div>
            </template>
          </Column>
          <Column field="reportType.type" header="Type" class="capitalize"></Column>
          <Column field="reportType.description" header="Description"></Column>
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
          <Column field="status" header="Status" dataType="boolean">
            <template #body="{ data }">
              <Tag v-if="data.status" :value="data.status" severity="info" class="capitalize" />
            </template>
          </Column>
          <Column>
            <template #body="{ data }">
              <div class="flex justify-between">
                <Button label="Accept" severity="warn" @click.stop="handleAccept" />
                <Button label="Reject" severity="secondary" />
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
