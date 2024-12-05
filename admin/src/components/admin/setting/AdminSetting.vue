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
  import SmallLoading from '@/components/icons/smallLoading.vue';

  const tabs = ref([
    { title: 'Profile', component: markRaw(ProfileEdit), value: '0' },
    { title: 'Notification', component: markRaw(NotificationEdit), value: '1' },
  ]);

  const userStore = useUserStore();
  const user = computed(() => userStore.user || {});
  const sendRequestToStreamer = ref(false);
  const statusRequest = ref('');
  const fieldsToCheck = ['username', 'fullName', 'gender', 'dob', 'country', 'state', 'city'];
  const isEmailSent = ref(false);
  const emailVerified = computed(() => userStore?.user?.isVerified);
  const isLoading = ref(false);
  // CHECK SEND MAIL STATUS
</script>

<template>
  <section class="mb-[100px] flex-grow">
    <div class="container">
      <div>
        <div class="flex items-center gap-x-[30px]">
          <h1 class="text_title">Settings</h1>
          <Divider />
        </div>
        <div class="mt-2">
          <Tabs value="0">
            <TabList class="bg-white">
              <Tab v-for="tab in tabs" :key="tab.title" :value="tab.value">{{ tab.title }}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel v-for="tab in tabs" :key="tab.component" :value="tab.value">
                <component
                  :is="tab.component"
                  :isEmailSent="isEmailSent"
                  :handleVerifiedEmail="handleVerifiedEmail"
                  @verifyEmail="handleVerifiedEmail"
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
  </section>
</template>
