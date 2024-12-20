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
  import { sendMailVerify } from '@/services/auth';
  import SmallLoading from '../icons/smallLoading.vue';
  import { useTabStore } from '@/stores';

  const tabs = ref([
    { title: 'Profile', component: markRaw(ProfileEdit), value: '0' },
    { title: 'Notification', component: markRaw(NotificationEdit), value: '1' },
  ]);

  const userStore = useUserStore();
  const tabStore = useTabStore();
  const user = computed(() => userStore.user || {});
  const sendRequestToStreamer = ref(false);
  const statusRequest = ref('');
  const fieldsToCheck = ['username', 'fullName', 'gender', 'dob', 'country', 'state', 'city'];
  const isEmailSent = ref(false);
  const emailVerified = computed(() => userStore?.user?.isVerified);
  const isLoading = ref(false);
  const emailUpdate = ref('');
  // CHECK SEND MAIL STATUS

  // const checkEmailSentStatus = () => {
  //   const emailSentData = localStorage.getItem('emailVerificationSent');
  //   if (emailSentData) {
  //     const { timestamp, email } = JSON.parse(emailSentData);
  //     const fifteenMinutes = 15 * 60 * 1000;
  //     const now = new Date().getTime();

  //     if (now - timestamp < fifteenMinutes && email === user.value?.email) {
  //       isEmailSent.value = true;
  //     } else {
  //       localStorage.removeItem('emailVerificationSent');
  //       isEmailSent.value = false;
  //     }
  //   }
  // };

  const handleVerifiedEmail = async (email) => {
    try {
      isLoading.value = true;
      const response = await sendMailVerify({ email });
      if (response) {
        const emailSentData = {
          timestamp: new Date().getTime(),
          email: email,
        };
        // localStorage.setItem('emailVerificationSent', JSON.stringify(emailSentData));
        isEmailSent.value = true;
        toast.success('Verification email sent successfully');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to send verification email');
    } finally {
      isLoading.value = false;
    }
  };

  const updateEmail = (newEmail) => {
    emailUpdate.value = newEmail;
  };

  const handleSendVerify = () => {
    if (emailUpdate.value === '') {
      handleVerifiedEmail(userStore?.user?.email);
    } else {
      handleVerifiedEmail(emailUpdate.value);
    }
  };

  const showRequestToStreamer = computed(() => {
    const areAllFieldsFilled = fieldsToCheck.every((field) => user.value[field]);
    return (
      areAllFieldsFilled &&
      user.value.role === 'user' &&
      sendRequestToStreamer.value === false &&
      emailVerified.value
    );
  });

  // HANDLE REQUEST TO STREAMER
  const handleRequestToStreamer = async () => {
    try {
      isLoading.value = true;
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
    } finally {
      isLoading.value = false;
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

  const activeTab = computed(() => tabStore.activeTab);

  const onTabChange = (event) => {
    tabStore.setActiveTab(event);
  };

  onMounted(() => {
    fetchStatusRequestToStreamer();
    // checkEmailSentStatus();
  });
</script>

<template>
  <section class="pb-6 flex-grow">
    <div class="container">
      <!-- EMAIL EMPTY -->
      <div
        v-show="!userStore.user?.isVerified"
        class="flex gap-y-4 gap-x-2 items-start justify-between notification_custom relative"
        :class="{ 'bg-blue/20 border-blue/80': isEmailSent }"
      >
        <h1 class="text_para text-left">
          <template v-if="isEmailSent">
            Verification email has been sent
            <span class="font-bold">successfully.</span> Please check
            <span class="font-bold">your inbox and spam folder.</span>
          </template>
          <template v-else>
            Your email is not verified. You can't become a
            <span class="font-bold">streamer</span> without
            <span class="font-bold">verifying your email.</span>
          </template>
        </h1>
        <Button
          v-if="!isEmailSent"
          @click="handleSendVerify"
          class="btn hidden md:block w-36 whitespace-nowrap"
        >
          <template #default>
            <SmallLoading v-if="isLoading" fill="white" fill_second="#13d0b4" />
            <span v-else>Verify email</span>
          </template>
        </Button>

        <button @click="close" class="pi pi-times block md:hidden" />
      </div>
      <!-- REQUEST TO STREAMER -->
      <div
        v-if="showRequestToStreamer"
        class="flex gap-y-4 gap-x-2 items-center justify-between notification_custom relative"
      >
        <h1 class="text_para text-left">
          You've completed your profile information for <span class="font-bold">MOVE</span>. Would
          you like to request to become a <span class="font-bold">channel</span>?
        </h1>
        <Button @click="handleRequestToStreamer" class="btn hidden md:block w-36">
          <template #default>
            <SmallLoading v-if="isLoading" fill="white" fill_second="#13d0b4" />
            <span v-else>Send request</span>
          </template>
        </Button>
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
          <Tabs :value="activeTab" @update:value="onTabChange">
            <TabList>
              <Tab v-for="tab in tabs" :key="tab.value" :value="tab.value">
                {{ tab.title }}
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel v-for="tab in tabs" :key="tab.value" :value="tab.value">
                <component
                  :is="tab.component"
                  :handleVerifiedEmail="handleVerifiedEmail"
                  @updateEmail="updateEmail"
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
  </section>
</template>

<style></style>
