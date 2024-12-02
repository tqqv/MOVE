<script setup>
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import { onMounted, ref } from 'vue';

  const topChannel = ref([
    {
      channelName: 'Channel 1',
      avatar:
        'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      username: 'user_1',
      followed: 230,
      totalVideos: 120,
      totalLivestreams: 45,
      totalDonated: 5000,
    },
    {
      channelName: 'Channel 2',
      avatar:
        'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      username: 'user_2',
      followed: 230,
      totalVideos: 95,
      totalLivestreams: 30,
      totalDonated: 2500,
    },
    {
      channelName: 'Channel 3',
      avatar:
        'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      username: 'user_3',
      followed: 230,
      totalVideos: 140,
      totalLivestreams: 60,
      totalDonated: 8000,
    },
    {
      channelName: 'Channel 4',
      avatar:
        'https://images.pexels.com/photos/6295779/pexels-photo-6295779.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      username: 'user_4',
      followed: 230,
      totalVideos: 75,
      totalLivestreams: 25,
      totalDonated: 1500,
    },
    {
      channelName: 'Channel 5',
      avatar:
        'https://images.pexels.com/photos/6295779/pexels-photo-6295779.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      username: 'user_5',
      followed: 230,
      totalVideos: 110,
      totalLivestreams: 50,
      totalDonated: 6000,
    },
  ]);
  const topUserDeposit = ref([
    {
      avatar:
        'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      username: 'user_1',
      totalDeposit: 2000,
      totalDonated: 5000,
    },
    {
      avatar:
        'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      username: 'user_2',
      totalDeposit: 4000,
      totalDonated: 2500,
    },
    {
      avatar:
        'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      username: 'user_3',
      totalDeposit: 3200,
      totalDonated: 8000,
    },
    {
      avatar:
        'https://images.pexels.com/photos/6295779/pexels-photo-6295779.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      username: 'user_4',
      totalDeposit: 2330,
      totalDonated: 1500,
    },
    {
      avatar:
        'https://images.pexels.com/photos/6295779/pexels-photo-6295779.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      username: 'user_5',
      totalDeposit: 2200,
      totalDonated: 6000,
    },
  ]);
</script>

<template>
  <div class="col-span-7 bg-white p-5 rounded shadow">
    <h1 class="text-primary font-bold uppercase ml-2 mb-2">Top 5 channel followed</h1>
    <DataTable :value="topChannel" tableStyle="min-width: 50rem">
      <Column header="Avatar">
        <template #body="slotProps">
          <img :src="slotProps.data.avatar" class="size-12 object-cover rounded-full" />
        </template>
      </Column>
      <Column field="channelName" header="Channel name"></Column>
      <Column field="username" header="Username"></Column>
      <Column field="followed" header="Follow"></Column>
      <Column field="totalVideos" header="Video"></Column>
      <Column field="totalLivestreams" header="Live stream"></Column>
      <Column field="totalDonated" header="Donated"></Column>
    </DataTable>
  </div>
  <div class="col-span-5 bg-white p-5 rounded shadow">
    <h1 class="text-primary font-bold uppercase ml-2 mb-2">Top 5 users deposit the most money</h1>
    <DataTable :value="topUserDeposit" tableStyle="min-width: 20rem">
      <Column header="Avatar">
        <template #body="slotProps">
          <img :src="slotProps.data.avatar" class="size-12 object-cover rounded-full" />
        </template>
      </Column>
      <Column field="username" header="Username"></Column>
      <Column field="totalDonated" header="Donated"></Column>
      <Column field="totalDeposit" header="Deposit"></Column>
    </DataTable>
  </div>
</template>

<style scoped></style>
