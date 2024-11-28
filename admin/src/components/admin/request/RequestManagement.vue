<script setup>
  import { ref } from 'vue';
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import Tag from 'primevue/tag';

  const products = ref([
    {
      id: '1000',
      email: 'vietzz771@gmail.com',
      phoneNumber: '0999999999',
      username: 'Bamboo Watch',
      role: 'user',
      referralCode: 'asd123',
      avatar: 'ionibowcher.png',
      isVerified: false,
      isBanned: false,
      createAt: '09/11/2024',
      REPs: '123',
      beingReported: '13',
    },
    {
      id: '1000',
      email: 'vietzz771@gmail.com',
      username: 'Bamboo Watch',
      phoneNumber: '0999999999',
      role: 'user',
      referralCode: 'asd123',
      avatar: 'ionibowcher.png',
      isVerified: true,
      isBanned: false,
      createAt: '09/11/2024',
      REPs: '123',
      beingReported: '13',
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
      beingReported: '13',
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
      beingReported: '13',
    },
  ]);
</script>

<template>
  <section class="bg-[#FAFAFB]">
    <div class="container">
      <div class="card bg-white p-4 shadow rounded-lg">
        <DataTable :value="products" stripedRows showGridlines>
          <template #header>
            <div class="flex flex-wrap gap-2 items-center justify-between">
              <h1 class="font-bold text-[20px]">Request to channel</h1>
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
          <Column field="REPs" header="Balance"></Column>
          <Column field="beingReported" header="Being Reported"></Column>
          <Column field="createAt" header="Create at"></Column>
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
              <div class="flex justify-between">
                <button class="btn bg-blue hover:opacity-75">Accept</button>
                <button class="btn bg-red hover:opacity-75">Reject</button>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </section>
</template>
