<script setup>
  import { useUserStore } from '@/stores';
  import Heart from '../icons/heart.vue';
  import Warning from '../icons/warning.vue';
  import { postFollowChannel } from '@/services/user';
  import { ref } from 'vue';
  import { toast } from 'vue3-toastify';

  const props = defineProps({
    showFollowPopup: Boolean,
    liveStreamData: Number,
  });
  const userStore = useUserStore();
  const isFollowed = ref(false);
  const followChannel = async () => {
    try {
      const response = await postFollowChannel({
        channelId: props.liveStreamData,
      });

      if (response.status === 200) {
        toast.success('Follow successfully');
        isFollowed.value = true;
        userStore.loadFollowers();
        emit('closeLiveToChatPopUp');
      } else {
        toast.success(response.message);
        userStore.loadFollowers();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const emit = defineEmits(['closeLiveToChatPopUp']);

  const closePopup = () => {
    emit('closeLiveToChatPopUp');
  };
</script>
<template>
  <div
    class="absolute h-32 w-full rounded-t-md top-[-127px] bg-white border-gray-dark border border-b-0 z-10"
  >
    <div class="flex flex-col px-2 pt-3">
      <div class="flex justify-between">
        <div class="flex gap-x-4">
          <Warning fill="#ea9b00" />
          <p class="text-black text-sm font-semibold">Followers-Only Chat</p>
        </div>
        <div
          class="flex justify-center items-center p-1 hover:bg-gray-light rounded-full cursor-pointer"
          @click="closePopup"
        >
          <i class="pi pi-times text-sm"></i>
        </div>
      </div>
      <div class="mx-10">
        <span class="text-xs">You need to be a follower of kkatamina to chat.</span>
      </div>
      <div class="flex justify-end mt-1">
        <div
          class="flex justify-center items-center text-sm text-white gap-x-2 px-3 py-1.5 cursor-pointer bg-primary rounded-md"
          @click="followChannel"
        >
          <Heart
            width="12px"
            class="mt-0.5"
            :fill="isFollowed ? 'fill-white' : 'fill-primary'"
            stroke="stroke-white"
          />
          <p class="font-semibold">Follow</p>
        </div>
      </div>
    </div>
  </div>
</template>
