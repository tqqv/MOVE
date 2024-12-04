<script setup>
  import { formatNumber, truncateDescripton } from '@/utils';
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import { onMounted, ref } from 'vue';
  import Skeleton from 'primevue/skeleton';

  const props = defineProps({
    topUserDepositData: {
      type: Array,
      required: true,
    },
    topChannelData: {
      type: Array,
      required: true,
    },
    isLoadingDashboard: Boolean,
  });
</script>

<template>
  <div class="col-span-7 paper-custom">
    <h1 class="paper-title">Top 5 channel followed</h1>
    <DataTable :value="topChannelData" tableStyle="min-width: 50rem">
      <!-- Avatar column -->
      <Column header="Avatar">
        <template #body="{ data }">
          <template v-if="isLoadingDashboard">
            <Skeleton width="48px" height="48px" shape="circle" />
          </template>
          <template v-else>
            <img :src="data?.avatar" class="size-12 object-cover rounded-full" />
          </template>
        </template>
      </Column>

      <!-- Channel Name column -->
      <Column field="channelName" header="Channel name">
        <template #body="{ data }">
          <template v-if="isLoadingDashboard">
            <Skeleton width="80px" height="20px" />
          </template>
          <template v-else>
            <span :title="data?.channelName">{{ truncateDescripton(data?.channelName, 15) }}</span>
          </template>
        </template>
      </Column>

      <!-- Username column -->
      <Column field="username" header="Username">
        <template #body="{ data }">
          <template v-if="isLoadingDashboard">
            <Skeleton width="80px" height="20px" />
          </template>
          <template v-else>
            <span :title="data?.User.username">{{
              truncateDescripton(data?.User.username, 15)
            }}</span>
          </template>
        </template>
      </Column>

      <!-- Followed column -->
      <Column field="followed" header="Follow">
        <template #body="{ data }">
          <template v-if="isLoadingDashboard">
            <Skeleton width="80px" height="20px" />
          </template>
          <template v-else>
            <span>{{ formatNumber(data?.totalFollow) }}</span>
          </template>
        </template>
      </Column>

      <!-- Total Videos column -->
      <Column field="totalVideos" header="Video">
        <template #body="{ data }">
          <template v-if="isLoadingDashboard">
            <Skeleton width="80px" height="20px" />
          </template>
          <template v-else>
            <span>{{ formatNumber(data?.totalVideos) }}</span>
          </template>
        </template>
      </Column>

      <!-- Total Livestreams column -->
      <Column field="totalLivestreams" header="Live stream">
        <template #body="{ data }">
          <template v-if="isLoadingDashboard">
            <Skeleton width="80px" height="20px" />
          </template>
          <template v-else>
            <span>{{ formatNumber(data?.totalLivestreams) }}</span>
          </template>
        </template>
      </Column>

      <!-- REPs Received column -->
      <Column field="totalDonated" header="REPs Received">
        <template #body="{ data }">
          <template v-if="isLoadingDashboard">
            <Skeleton width="80px" height="20px" />
          </template>
          <template v-else>
            <span>{{ formatNumber(data?.totalDonate) }} REPs</span>
          </template>
        </template>
      </Column>
    </DataTable>
  </div>

  <div class="col-span-5 paper-custom">
    <h1 class="paper-title">Top 5 users deposit the most money</h1>
    <DataTable :value="topUserDepositData" tableStyle="min-width: 20rem">
      <!-- Avatar column -->
      <Column header="Avatar">
        <template #body="{ data }">
          <template v-if="isLoadingDashboard">
            <Skeleton width="48px" height="48px" shape="circle" />
          </template>
          <template v-else>
            <img :src="data?.avatar" class="size-12 object-cover rounded-full" />
          </template>
        </template>
      </Column>

      <!-- Username column -->
      <Column field="username" header="Username">
        <template #body="{ data }">
          <template v-if="isLoadingDashboard">
            <Skeleton width="80px" height="20px" />
          </template>
          <template v-else>
            <span :title="data?.username">{{ truncateDescripton(data?.username, 15) }}</span>
          </template>
        </template>
      </Column>

      <!-- Full Name column -->
      <Column field="fullName" header="Full Name">
        <template #body="{ data }">
          <template v-if="isLoadingDashboard">
            <Skeleton width="80px" height="20px" />
          </template>
          <template v-else>
            <span :title="data?.fullName">{{ truncateDescripton(data?.fullName, 15) }}</span>
          </template>
        </template>
      </Column>

      <!-- Deposit column -->
      <Column field="totalDeposit" header="Deposit">
        <template #body="{ data }">
          <template v-if="isLoadingDashboard">
            <Skeleton width="80px" height="20px" />
          </template>
          <template v-else>
            <span>$ {{ formatNumber(data?.totalDeposit) }}</span>
          </template>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped></style>
