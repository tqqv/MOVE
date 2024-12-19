<script setup>
  import { onMounted, ref } from 'vue';
  import CheckboxCustom from '../CheckboxCustom.vue';
  import { getNotificationStatus } from '@/services/notification';

  const listNotificationStatus = ref([]);

  const fetchNotificationStatus = async () => {
    try {
      const response = await getNotificationStatus();
      listNotificationStatus.value = response.data;
      console.log(listNotificationStatus.value);
    } catch (error) {
      console.log(error);
    }
  };

  const updateSelection = (value) => {
    if (listNotificationStatus.value[0]) {
      // Check if listNotificationStatus has data
      listNotificationStatus.value[0].isEnabled = value === 'true';
      console.log(listNotificationStatus.value[0].isEnabled);
    } else {
      console.warn('Notification status is not available yet.');
    }
  };

  onMounted(() => {
    fetchNotificationStatus();
  });
</script>
<template>
  <div class="mb-5">
    <h2 class="font-bold text-[14px]">All notifications</h2>
    <p class="text-[#666666] text-[14px]">
      Get notified on updates that are relevant to you! You may also receive additional emails for
      any updates on MOVE.
    </p>
    <div
      class="flex gap-x-10 mt-3 text-[14px]"
      v-if="listNotificationStatus && listNotificationStatus[0]"
    >
      <CheckboxCustom
        label="On"
        :checked="listNotificationStatus[5].isEnabled === true"
        @update:modelValue="(value) => updateSelection(value ? 'true' : 'false')"
      />
      <CheckboxCustom
        label="Off"
        :checked="listNotificationStatus[5].isEnabled === false"
        @update:modelValue="(value) => updateSelection(value ? 'false' : 'true')"
      />
    </div>
    <div>
      <h2 class="font-bold mt-4 text-[14px]">Live stream notifications</h2>
      <p class="text-[#666666] text-[14px]">Notify me when the channel I follow goes live.</p>
      <div class="flex gap-x-10 mt-3 text-[14px]">
        <CheckboxCustom label="Yes" groupName="live" />
        <CheckboxCustom label="No" groupName="live" />
      </div>
      <h2 class="font-bold mt-4 text-[14px]">Followers notification</h2>
      <p class="text-[#666666] text-[14px]">Notify me when someone follows my channel.</p>
      <div class="flex gap-x-10 mt-3 text-[14px]">
        <CheckboxCustom label="Yes" groupName="fl" />
        <CheckboxCustom label="No" groupName="fl" />
      </div>
      <h2 class="font-bold mt-4 text-[14px]">Comments notification</h2>
      <p class="text-[#666666] text-[14px]">
        Notify me when someone comments or replies to my comment.
      </p>
      <div class="flex gap-x-10 mt-3 text-[14px]">
        <CheckboxCustom label="Yes" groupName="cmt" />
        <CheckboxCustom label="No" groupName="cmt" />
      </div>
      <h2 class="font-bold mt-4 text-[14px]">REPs notification</h2>
      <p class="text-[#666666] text-[14px]">Notify me when I received REPs.</p>
      <div class="flex gap-x-10 mt-3 text-[14px]">
        <CheckboxCustom label="Yes" groupName="rep" />
        <CheckboxCustom label="No" groupName="rep" />
      </div>
      <h2 class="font-bold mt-4 text-[14px]">MOVE update notifications</h2>
      <p class="text-[#666666] text-[14px]">
        Notify me when MOVE has any promotional/ recommendation updates.
      </p>
      <div class="flex gap-x-10 mt-3 text-[14px]">
        <CheckboxCustom label="Yes" groupName="move" />
        <CheckboxCustom label="No" groupName="move" />
      </div>
      <button class="btn px-10 mt-5">Save settings</button>
    </div>
  </div>
</template>
