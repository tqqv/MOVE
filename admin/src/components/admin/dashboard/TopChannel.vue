<script setup>
  import { formatNumber, truncateDescripton } from '@/utils';
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import { onMounted, ref } from 'vue';

  const props = defineProps({
    topUserDepositData: {
      type: Array,
      required: true,
    },
    topChannelData: {
      type: Array,
      required: true,
    },
  });
</script>

<template>
  <div class="col-span-7 paper-custom">
    <h1 class="paper-title">Top 5 channel followed</h1>
    <DataTable :value="topChannelData" tableStyle="min-width: 50rem">
      <Column header="Avatar">
        <template #body="{ data }">
          <img :src="data?.avatar" class="size-12 object-cover rounded-full" />
        </template>
      </Column>
      <Column field="channelName" header="Channel name">
        <template #body="{ data }">
          <span :title="data?.channelName">{{
            truncateDescripton(data?.channelName, 15)
          }}</span></template
        >
      </Column>
      <Column field="username" header="Username">
        <template #body="{ data }">
          <span :title="data?.User.username">{{
            truncateDescripton(data?.User.username, 15)
          }}</span></template
        ></Column
      >
      <Column field="followed" header="Follow">
        <template #body="{ data }">
          <span>{{ formatNumber(data?.totalFollow) }}</span></template
        ></Column
      >
      <Column field="totalVideos" header="Video">
        <template #body="{ data }">
          <span>{{ formatNumber(data?.totalVideos) }}</span></template
        ></Column
      >
      <Column field="totalLivestreams" header="Live stream"
        ><template #body="{ data }">
          <span>{{ formatNumber(data?.totalLivestreams) }}</span></template
        ></Column
      >
      <Column field="totalDonated" header="REPs Received"
        ><template #body="{ data }">
          <span>{{ formatNumber(data?.totalDonate) }} REPs</span></template
        ></Column
      >
    </DataTable>
  </div>
  <div class="col-span-5 paper-custom">
    <h1 class="paper-title">Top 5 users deposit the most money</h1>
    <DataTable :value="topUserDepositData" tableStyle="min-width: 20rem">
      <Column header="Avatar">
        <template #body="{ data }">
          <img :src="data?.avatar" class="size-12 object-cover rounded-full" />
        </template>
      </Column>
      <Column field="username" header="Username">
        <template #body="{ data }">
          <span :title="data?.username">{{
            truncateDescripton(data?.username, 15)
          }}</span></template
        ></Column
      >
      <Column field="fullName" header="Full Name">
        <template #body="{ data }">
          <span :title="data?.fullName">{{
            truncateDescripton(data?.fullName, 15)
          }}</span></template
        ></Column
      >
      <Column field="totalDeposit" header="Deposit"
        ><template #body="{ data }">
          <span>$ {{ formatNumber(data?.totalDeposit) }} </span></template
        ></Column
      >
    </DataTable>
  </div>
</template>

<style scoped></style>
