<script setup>
  import CategoryImage from '@/components/CategoryImage.vue';
  import Divider from '@/components/Divider.vue';
  import GirdVideo from '@/components/GirdVideo.vue';
  import axiosInstance from '@/services/axios';
  import { onMounted, ref } from 'vue';
  import { toast } from 'vue3-toastify';
  const videosFollow = ref([]);
  const catesFollow = ref([]);
  const livesFollow = ref([]);
  const getListFollowing = async () => {
    try {
      const response = await axiosInstance.get('user/getAllInforFollow');
      if (response.status === 200) {
        videosFollow.value = response.data.data.videos;
        catesFollow.value = response.data.data.categories;
        livesFollow.value = response.data.data.livestreams;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  onMounted(async () => {
    await getListFollowing();
  });
</script>
<template>
  <section>
    <div class="container">
      <div class="flex items-center">
        <span class="font-bold text-[26px] pr-8">Following</span>
        <Divider class="flex-grow mt-1" />
      </div>
      <div class="flex justify-between mt-3">
        <span class="font-bold text-[24px]">Live channel</span>
      </div>
      <GirdVideo :videos="livesFollow" v-if="livesFollow.length > 0" />
      <div class="mt-3" v-else>
        <span class="italic">There are no active live sessions at the moment.</span>
      </div>
    </div>
  </section>
  <section>
    <div class="container">
      <div class="items-center space-y-4">
        <Divider class="flex-grow mt-1" />
        <div class="flex justify-between">
          <span class="font-bold text-[24px]">Lastest videos</span>
        </div>
      </div>
      <GirdVideo :videos="videosFollow" v-if="videosFollow.length > 0" />
      <div class="mt-3" v-else>
        <span class="italic">There are no active videos at the moment.</span>
      </div>
    </div>
  </section>
  <section>
    <div class="container">
      <div class="items-center space-y-4">
        <Divider class="flex-grow mt-1" />
        <div class="flex justify-between">
          <span class="font-bold text-[24px]">Categories</span>
        </div>
      </div>
      <div
        class="grid gap-x-12 gap-y-10 pt-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
        v-if="catesFollow.length > 0"
      >
        <CategoryImage :categories="catesFollow" />
      </div>
      <div class="mt-3" v-else>
        <span class="italic">There are no active categories at the moment.</span>
      </div>
    </div>
  </section>
</template>
