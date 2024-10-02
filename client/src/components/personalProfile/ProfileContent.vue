<script setup>
  import { ref, markRaw, computed, onMounted } from 'vue';
  import Divider from '@/components/Divider.vue';
  import Button from 'primevue/button';
  import Tabs from 'primevue/tabs';
  import TabList from 'primevue/tablist';
  import Tab from 'primevue/tab';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';
  import ProfileEdit from '@components/personalProfile/ProfileEdit.vue';
  import NotificationEdit from '@components/personalProfile/NotificationEdit.vue';
  import { useUserStore } from '@/stores/user.store';
  import { getRequestStreamer, requestToStreamer } from '@/services/user';
  import { toast } from 'vue3-toastify';

  const tabs = ref([
    { title: 'Profile', component: markRaw(ProfileEdit), value: '0' },
    { title: 'Notification', component: markRaw(NotificationEdit), value: '1' },
  ]);

  const userStore = useUserStore();
  const user = computed(() => userStore.user || {});
  const sendRequestToStreamer = ref(false);
  const statusRequest = ref('');
  const fieldsToCheck = ['username', 'fullName', 'gender', 'dob', 'country', 'state', 'city'];

  const showRequestToStreamer = computed(() => {
    const areAllFieldsFilled = fieldsToCheck.every((field) => user.value[field]);
    return (
      areAllFieldsFilled && user.value.role === 'user' && sendRequestToStreamer.value === false
    );
  });

  // HANDLE REQUEST TO STREAMER
  const handleRequestToStreamer = async () => {
    try {
      const response = await requestToStreamer();
      if (response.success) {
        toast.success('Request to streamer was successfully');
        sendRequestToStreamer.value = true;
        statusRequest.value = 'pending';
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Failed to request to streamer');
    }
  };

  const fetchStatusRequestToStreamer = async () => {
    try {
      const response = await getRequestStreamer();
      if (response.success && response.data) {
        sendRequestToStreamer.value = true;
        statusRequest.value = response.data.status;
      } else {
        sendRequestToStreamer.value = false;
      }
    } catch (error) {
      console.error('Error fetching request status:', error);
      sendRequestToStreamer.value = false;
    }
  };

  onMounted(fetchStatusRequestToStreamer);
</script>

<template>
  <section class="pb-6 flex-grow">
    <div class="container">
      <!-- EMAIL EMPTY -->
      <div
        v-show="!userStore.user?.email"
        class="flex gap-y-4 gap-x-2 items-start justify-between notification_custom relative"
      >
        <h1 class="text_para text-left">
          Your email is not setup yet. You may not be able to receive any
          <span class="font-bold">billing information</span> or
          <span class="font-bold">announcement</span> from MOVE.
        </h1>
        <Button label="Setup email now" class="btn hidden md:block" />
        <button @click="close" class="pi pi-times block md:hidden" />
      </div>
      <!-- REQUEST TO STREAMER -->
      <div
        v-if="showRequestToStreamer"
        class="flex gap-y-4 gap-x-2 items-start justify-between notification_custom relative"
      >
        <h1 class="text_para text-left">
          You've completed your profile information for <span class="font-bold">MOVE</span>. Would
          you like to request to become a <span class="font-bold">channel</span>?
        </h1>
        <Button @click="handleRequestToStreamer" label="Send request" class="btn hidden md:block" />
      </div>
      <!-- PENDING -->
      <div
        v-if="statusRequest === 'pending' && sendRequestToStreamer"
        class="flex items-center gap-y-4 gap-x-2 justify-between border-2 border-blue/35 bg-blue/20 rounded-lg p-4 relative h-[76px]"
      >
        <h1 class="text_para text-left">
          Waiting for admin <span class="font-bold">MOVE</span> approval. Please wait...
        </h1>
      </div>
      <!-- Reject -->
      <div
        v-if="statusRequest === 'rejected' && sendRequestToStreamer"
        class="flex items-center gap-y-4 gap-x-2 justify-between border-2 border-red/35 bg-red/20 rounded-lg p-4 relative h-[76px]"
      >
        <h1 class="text_para text-left">
          You have been rejected by admin
          <span class="font-bold">MOVE</span> to become a streamer because of some of the following
          issues
        </h1>
      </div>
      <!-- CONTENT -->
      <div>
        <div class="flex items-center gap-x-[30px]">
          <h1 class="text_title">Settings</h1>
          <Divider />
        </div>
        <div class="mt-2">
          <Tabs value="0">
            <TabList>
              <Tab v-for="tab in tabs" :key="tab.title" :value="tab.value">{{ tab.title }}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel v-for="tab in tabs" :key="tab.component" :value="tab.value">
                <component :is="tab.component" />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
  </section>
</template>

<style></style>
