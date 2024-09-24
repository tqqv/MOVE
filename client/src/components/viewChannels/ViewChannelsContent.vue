<script setup>
  import { ref, markRaw, onMounted } from 'vue';

  import Tabs from 'primevue/tabs';
  import TabList from 'primevue/tablist';
  import Tab from 'primevue/tab';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';
  import TabVideoList from '@components/viewChannels/TabVideoList.vue';
  import VideoDetail from '@components/VideoDetail.vue';
  import TabAbout from './TabAbout.vue';
  import MMAImage from '@/assets/category/MMA.png';
  import { getViewChannel } from '@/services/user';

  const tabs = ref([
    { title: 'Videos', component: markRaw(TabVideoList), value: '0' },
    { title: 'About', component: markRaw(TabAbout), value: '1' },
  ]);
  const username = ref('thehoang1722'); // Thay thế bằng username thực tế bạn muốn lấy
  const videoDetails = ref({});
  const totalFollower = ref(null);
  const errorData = ref(null);
  // const videoDetails = {
  //   name: 'dianeTV',
  //   avatar: MMAImage,
  //   followers: 2222,
  //   status: 'Online',
  //   isLive: true,
  //   isVerified: true,
  //   isFacebook: true,
  //   isInstagram: true,
  //   isYoutube: true,
  //   description:
  //     'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem',
  // };

  const fetchChannelData = async () => {
    const result = await getViewChannel(username.value);
    console.log(result.data.profile);

    if (result.error) {
      errorData.value = result.data.profile;
    } else {
      videoDetails.value = result.data.profile;
      totalFollower.value = result.data.totalFollower;
    }
  };

  onMounted(fetchChannelData);
</script>

<template>
  <section class="px-10 flex-grow mr-14">
    <VideoDetail
      :is-user-action="true"
      :is-button-gift-r-e-ps-visible="true"
      :videoDetails="videoDetails"
      :totalFollower="totalFollower"
      class="pl-3"
    />
    <div>
      <div class="mt-2">
        <Tabs value="0">
          <TabList>
            <Tab v-for="tab in tabs" :key="tab.title" :value="tab.value">{{ tab.title }}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel v-for="tab in tabs" :key="tab.component" :value="tab.value">
              <component :is="tab.component" :videoDetails="videoDetails" />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
    <div></div>
  </section>
</template>

<style></style>
