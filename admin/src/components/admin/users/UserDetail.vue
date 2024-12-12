<script setup>
  import { ref, onMounted, watch, markRaw } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { getProfilebyUserId } from '@/services/user';
  import Informations from './tabs/Informations.vue';
  import Tabs from 'primevue/tabs';
  import TabList from 'primevue/tablist';
  import Tab from 'primevue/tab';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';
  import Videos from './tabs/Videos.vue';
  import TransactionHistory from './tabs/TransactionHistory.vue';
  import Button from 'primevue/button';
  import Tag from 'primevue/tag';
  import ConfirmDialog from 'primevue/confirmdialog';
  import { useConfirm } from 'primevue/useconfirm';
  import { toast } from 'vue3-toastify';
  import axiosInstance from '@/services/axios';

  const route = useRoute();
  const router = useRouter();
  const activeTab = ref('0');
  const id = ref(route.params.id);
  const channel = ref(null);
  const isBannedUser = ref(null);
  const isBannedChannel = ref(null);
  const confirm = useConfirm();
  const showConfirmDialog = ref(false);
  const showConfirmDialogChannel = ref(false);

  const onTabChange = (event) => {
    activeTab.value = event;
  };

  const unbanUser = async () => {
    try {
      const response = await axiosInstance.post(`admin/unbanUser/${id.value}`);
      console.log(response);
      if (response.status === 200) {
        toast.success('Unban user successfully');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const unbanChannel = async () => {
    try {
      const response = await axiosInstance.post(`admin/unbanChannel/${channel.value.id}`);
      console.log(response);
      if (response.status === 200) {
        toast.success('Unban channel successfully');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const confirmModal = () => {
    confirm.require({
      message: 'Are you sure you want to unban this user? This action cannot be undone.',
      header: 'Confirm User Unban',
      icon: 'pi pi-info-circle',
      rejectProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptProps: {
        label: 'Confirm',
        severity: 'danger',
      },
      accept: async () => {
        await unbanUser();
        showConfirmDialog.value = false;
        fetchChannelData();
      },
      reject: () => {
        showConfirmDialog.value = false;
      },
    });
  };
  const confirmModalChannel = () => {
    confirm.require({
      message: 'Are you sure you want to unban this user? This action cannot be undone.',
      header: 'Confirm Channel Unban',
      icon: 'pi pi-info-circle',
      rejectProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptProps: {
        label: 'Confirm',
        severity: 'danger',
      },
      accept: async () => {
        await unbanChannel();
        showConfirmDialogChannel.value = false;
        fetchChannelData();
      },
      reject: () => {
        showConfirmDialogChannel.value = false;
      },
    });
  };

  const openConfirmDialog = () => {
    showConfirmDialog.value = true;
    confirmModal();
  };
  const openConfirmDialogChannel = () => {
    showConfirmDialogChannel.value = true;
    confirmModalChannel();
  };

  const fetchChannelData = async () => {
    const result = await getProfilebyUserId(id.value);
    isBannedUser.value = result.data.data.isBanned;
    isBannedChannel.value = result.data.data.Channel.isBanned;
    channel.value = result.data.data.Channel;
    if (result.status === 404) {
      router.push('/404');
    }
  };

  onMounted(async () => {
    await fetchChannelData();
  });

  watch(
    () => route.params.id,
    async (newId) => {
      id.value = newId;
      activeTab.value = '0';
      fetchChannelData();
    },
  );
</script>
<template>
  <section class="bg-[#FAFAFB]">
    <div class="container">
      <div class="bg-white p-4 shadow rounded-lg">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-[24px] font-bold">
              User Detail <span class="opacity-50 text-[20px]">#{{ id }}</span>
            </h1>
            <div class="flex gap-x-4 items-center mt-4">
              <h2 class="font-semibold">Status:</h2>
              <Tag value="Normal" severity="info" />
            </div>
          </div>
          <div class="flex gap-x-5">
            <div class="flex gap-x-5" v-if="isBannedUser && isBannedChannel">
              <Button label="Unban User" severity="help" @click="openConfirmDialog" />
            </div>
            <div class="flex gap-x-5" v-if="!isBannedUser && isBannedChannel">
              <Button label="Unban Channel" severity="help" @click="openConfirmDialogChannel" />
            </div>
            <div class="flex gap-x-5" v-if="isBannedUser && !isBannedChannel">
              <Button label="Unban User" severity="help" @click="openConfirmDialog" />
            </div>
          </div>
        </div>
        <Tabs :value="activeTab" @update:value="onTabChange" class="mt-2">
          <TabList class="!p-0">
            <Tab value="0">Informations</Tab>
            <Tab value="1" v-if="channel">Videos</Tab>
            <Tab value="2">Transaction History</Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="0">
              <Informations :userId="id" />
            </TabPanel>
            <TabPanel value="1" v-if="channel">
              <Videos :channel="channel" />
            </TabPanel>
            <TabPanel value="2">
              <TransactionHistory :userId="id" />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  </section>
  <ConfirmDialog v-model:visible="showConfirmDialog" :style="{ width: '604px' }"></ConfirmDialog>
  <ConfirmDialog
    v-model:visible="showConfirmDialogChannel"
    :style="{ width: '604px' }"
  ></ConfirmDialog>
</template>
