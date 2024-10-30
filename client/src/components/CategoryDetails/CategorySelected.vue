<script setup>
  import { ref, watch, onMounted } from 'vue';
  import heart from '@/components/icons/heart.vue';
  import { formatView } from '@utils';
  import { postFollowCate, getCheckFollowCate } from '@/services/user';
  import { toast } from 'vue3-toastify';
  import { usePopupStore, useUserStore } from '@/stores';

  const userStore = useUserStore();
  const popupStore = usePopupStore();

  const props = defineProps({
    categoryDetail: {
      type: Object,
    },
  });

  const emit = defineEmits(['updateFollow']);
  const isFilled = ref(false);

  const followCategory = async () => {
    try {
      const response = await postFollowCate({
        cateId: props.categoryDetail.id,
      });

      if (response.success) {
        toast.success(response.message);
        isFilled.value = !isFilled.value;
        emit('updateFollow');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleFollow = () => {
    if (!userStore.user) {
      popupStore.openLoginPopup();
      return;
    }
    followCategory();
  };

  const checkFollowCate = async (cateId) => {
    const response = await getCheckFollowCate(cateId);

    if (response.success) {
      isFilled.value = response.data.follow;
    }
  };

  watch(
    () => props.categoryDetail,
    (newVal) => {
      if (newVal) {
        checkFollowCate(newVal.id);
      }
    },
  );

  onMounted(() => {
    if (props.categoryDetail) {
      checkFollowCate(props.categoryDetail.id);
    }
  });
</script>

<template>
  <div v-if="categoryDetail" class="w-[145px] flex gap-4 pt-2">
    <img
      :src="categoryDetail.imgUrl"
      :alt="categoryDetail.title"
      class="rounded-lg w-full h-auto cursor-pointer"
    />
    <div class="whitespace-nowrap">
      <h3 class="text_subTitle">{{ categoryDetail.title }}</h3>
      <div class="flex gap-2 items-center">
        <p class="text-[13px] text-footer font-bold">
          {{ formatView(categoryDetail.totalViews) }} views
        </p>
        <span class="inline-block w-1 h-1 bg-footer rounded-full"></span>
        <p class="text-[13px] text-footer font-bold">
          {{ categoryDetail.followerCount }} followers
        </p>
      </div>
      <div class="text-primary text-[13px] pt-4 font-bold flex items-center uppercase">
        <heart
          @click="toggleFollow"
          :fill="isFilled ? 'fill-primary' : 'fill-white'"
          stroke="stroke-primary"
          class="mr-1 cursor-pointer"
        />
        Follow
      </div>
    </div>
  </div>
</template>
