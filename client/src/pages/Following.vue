<script setup>
  import CategoryImage from '@/components/CategoryImage.vue';
  import Divider from '@/components/Divider.vue';
  import GirdVideo from '@/components/GirdVideo.vue';
  import axiosInstance from '@/services/axios';
  import Skeleton from 'primevue/skeleton';
  import { onMounted, ref } from 'vue';
  import { toast } from 'vue3-toastify';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const videosFollow = ref([]);
  const catesFollow = ref([]);
  const livesFollow = ref([]);
  const isLoading = ref(true);

  const getListFollowing = async () => {
    try {
      isLoading.value = true;
      const response = await axiosInstance.get('user/getAllInforFollow');
      if (response.status === 200) {
        videosFollow.value = response.data.data.videos;
        catesFollow.value = response.data.data.categories;
        livesFollow.value = response.data.data.livestreams;
      }
    } catch (error) {
      if (error.status === 401) {
        router.push('/404');
        return;
      }
      toast.error(error.message);
    } finally {
      isLoading.value = false;
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
      <div v-if="isLoading" class="grid gap-4 mt-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div v-for="n in 4" :key="n" class="flex flex-col gap-y-3">
          <Skeleton height="200px" />
          <div class="flex mt-4">
            <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
            <div>
              <Skeleton width="10rem" class="mb-2"></Skeleton>
              <Skeleton width="5rem" class="mb-2"></Skeleton>
              <Skeleton height=".5rem"></Skeleton>
            </div>
          </div>
        </div>
      </div>
      <GirdVideo :videos="livesFollow" v-if="!isLoading && livesFollow.length > 0" />
      <div class="mt-3" v-else-if="!isLoading && livesFollow.length === 0">
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
      <div v-if="isLoading" class="grid gap-4 mt-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div v-for="n in 4" :key="n" class="flex flex-col gap-y-3">
          <Skeleton height="200px" />
          <div class="flex mt-4">
            <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
            <div>
              <Skeleton width="10rem" class="mb-2"></Skeleton>
              <Skeleton width="5rem" class="mb-2"></Skeleton>
              <Skeleton height=".5rem"></Skeleton>
            </div>
          </div>
        </div>
      </div>
      <GirdVideo :videos="videosFollow" v-if="!isLoading && videosFollow.length > 0" />
      <div class="mt-3" v-else-if="!isLoading && videosFollow.length === 0">
        <span class="italic">There are no active active videos at the moment.</span>
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
        class="mt-4 grid gap-x-12 gap-y-10 pt-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
        v-if="isLoading"
      >
        <div v-for="i in 6" :key="i">
          <Skeleton height="300px" width="100%" />
          <div class="mt-2">
            <Skeleton width="10rem" class="mb-2"></Skeleton>
            <Skeleton width="5rem" class="mb-2"></Skeleton>
          </div>
        </div>
      </div>
      <div
        class="grid gap-x-12 gap-y-10 pt-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
        v-if="catesFollow.length > 0"
      >
        <CategoryImage :categories="catesFollow" v-if="!isLoading && catesFollow.length > 0" />
      </div>
      <div class="mt-3" v-else-if="!isLoading && catesFollow.length === 0">
        <span class="italic">There are no active categories at the moment.</span>
      </div>
    </div>
  </section>
</template>
