<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import Tag from 'primevue/tag';
  import Button from 'primevue/button';

  const router = useRouter();
  const products = ref([
    {
      id: '1000',
      email: 'vietzz771@gmail.com',
      phoneNumber: '0999999999',
      username: 'yetserlewlewlelew',
      role: 'user',
      referralCode: 'asd123',
      avatar: 'ionibowcher.png',
      isVerified: false,
      isBanned: false,
      createAt: '09/11/2024',
      REPs: '123',
    },
    {
      id: '1000',
      email: 'vietzz771@gmail.com',
      username: 'thehoang.17',
      phoneNumber: '0999999999',
      role: 'user',
      referralCode: 'asd123',
      avatar: 'ionibowcher.png',
      isVerified: true,
      isBanned: false,
      createAt: '09/11/2024',
      REPs: '123',
    },
    {
      email: 'vietzz771@gmail.com',
      id: '1000',
      username: 'Bamboo Watch',
      phoneNumber: '0999999999',
      role: 'user',
      referralCode: 'asd123',
      avatar: 'ionibowcher.png',
      category: 'Accessories',
      isVerified: true,
      isBanned: true,
      createAt: '09/11/2024',
      REPs: '123',
    },
    {
      email: 'vietzz771@gmail.com',
      id: '1000',
      username: 'Ioni Bowcher',
      phoneNumber: '0999999999',
      role: 'user',
      referralCode: 'asd123',
      avatar: 'ionibowcher.png',
      isBanned: true,
      isVerified: true,
      createAt: '09/11/2024',
      REPs: '123',
    },
  ]);

  const handleRowClick = (event) => {
    console.log('row click:', event.data.id);
    router.push(`users/${event.data.username}`);
  };
</script>

<template>
  <section class="bg-[#FAFAFB]">
    <div class="container">
      <div class="card bg-white p-4 shadow rounded-lg">
        <DataTable :value="products" stripedRows showGridlines @row-click="handleRowClick">
          <template #header>
            <div class="flex flex-wrap gap-2 items-center justify-between">
              <h1 class="font-bold text-[20px]">Manage Users</h1>
              <Button label="New" icon="pi pi-plus" class="mr-2" @click="openCateDialog" />
            </div>
          </template>
          <Column field="referralCode" header="Code"></Column>
          <Column header="Name">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <img
                  :alt="data.avatar"
                  :src="`https://primefaces.org/cdn/primevue/images/avatar/${data.avatar}`"
                  style="width: 40px"
                />
                <span>{{ data.username }}</span>
              </div>
            </template>
          </Column>
          <Column field="role" header="Role"></Column>
          <Column field="phoneNumber" header="Phone"></Column>
          <Column field="email" header="Email"></Column>
          <Column field="createAt" header="Create at"></Column>
          <Column field="REPs" header="Balance"></Column>
          <Column field="isBanned" header="Status" dataType="boolean">
            <template #body="{ data }">
              <Tag v-if="data.isBanned" value="Banned" severity="danger" />
              <Tag v-else value="Normal" severity="info" />
            </template>
          </Column>
          <Column field="verified" header="Verified" dataType="boolean">
            <template #body="{ data }">
              <i
                class="pi"
                :class="{
                  'pi-check-circle text-primary ': data.isVerified,
                  'pi-times-circle text-red': !data.isVerified,
                }"
              ></i>
            </template>
          </Column>
          <Column>
            <template #body="{ data }">
              <div class="!text-center">
                <button class="pi pi-ellipsis-v text-primary hover:text-primary-light"></button>
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
