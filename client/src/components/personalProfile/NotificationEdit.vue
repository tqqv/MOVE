<script setup>
  import { computed, onMounted, ref } from 'vue';
  import CheckboxCustom from '../CheckboxCustom.vue';
  import { editNotificationStatus, getNotificationStatus } from '@/services/notification';
  import { useUserStore } from '@/stores';
  import SmallLoading from '../icons/smallLoading.vue';
  import { disconnectAllRooms, joinAllRooms } from '@/services/socketService';

  const userStore = useUserStore();

  const listNotificationStatus = ref([]);
  const updateListNotificationStatus = ref([]);
  const isLoading = ref(false);
  const listTitleChannel = ref([
    {
      title: 'All notifications',
      subtitle:
        'Get notified on updates that are relevant to you! You may also receive additional emails for any updates on MOVE.',
    },
    {
      title: 'Followed channel notifications',
      subtitle: 'Notify me when the channel I follow goes live.',
    },
    {
      title: 'Comments notification',
      subtitle: 'Notify me when someone comments or replies to my comment.',
    },
    {
      title: 'System notifications',
      subtitle:
        'Get notified on updates that are relevant to you! You may also receive additional emails for any updates on MOVE.',
    },
    {
      title: 'REPs notifications',
      subtitle:
        'Get notified on updates that are relevant to you! You may also receive additional emails for any updates on MOVE.',
    },
  ]);

  const listTitleUser = ref([
    {
      title: 'All notifications',
      subtitle:
        'Get notified on updates that are relevant to you! You may also receive additional emails for any updates on MOVE.',
    },
    {
      title: 'Followed channel notifications',
      subtitle: 'Notify me when the channel I follow goes live.',
    },
    {
      title: 'Comments notification',
      subtitle: 'Notify me when someone comments or replies to my comment.',
    },
    {
      title: 'System notifications',
      subtitle:
        'Get notified on updates that are relevant to you! You may also receive additional emails for any updates on MOVE.',
    },
  ]);

  const notificationList = computed(() =>
    userStore?.user?.Channel ? listTitleChannel.value : listTitleUser.value,
  );
  const fetchNotificationStatus = async () => {
    try {
      const response = await getNotificationStatus();
      listNotificationStatus.value = response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const mergedArray = computed(() => {
    const listToUse = notificationList.value;
    const notificationStatus = listNotificationStatus.value;
    return listToUse.map((item, index) => {
      const notification = notificationStatus[index] || {};
      return {
        ...item,
        ...notification,
      };
    });
  });

  const updateSelection = (entityName, value) => {
    const item = listNotificationStatus.value.find(
      (notification) => notification.entityName === entityName,
    );

    if (item) {
      item.isEnabled = value;
      const index = updateListNotificationStatus.value.findIndex(
        (notification) => notification.entityName === entityName,
      );

      if (index > -1) {
        updateListNotificationStatus.value[index] = { [entityName]: value };
      } else {
        updateListNotificationStatus.value.push({ [entityName]: value });
      }
    } else {
      console.warn(`Entity ${entityName} not found.`);
    }
  };

  const handleEditNotificationStatus = async () => {
    if (!updateListNotificationStatus.value.length) {
      return;
    }
    try {
      isLoading.value = true;
      await editNotificationStatus(updateListNotificationStatus.value);
    } catch (error) {
      console.log(error);
    } finally {
      fetchNotificationStatus();
      updateListNotificationStatus.value = [];
      isLoading.value = false;
      disconnectAllRooms();
      joinAllRooms();
    }
  };
  onMounted(async () => {
    await fetchNotificationStatus();
  });
</script>
<template>
  <div class="mb-5">
    <div v-if="mergedArray.length > 0" class="flex flex-col gap-y-6 mt-3 text-[14px]">
      <div
        v-for="notification in mergedArray"
        :key="notification.entityName"
        class="flex flex-col gap-y-3"
      >
        <div class="flex flex-col">
          <h2 class="font-bold text-[14px]">{{ notification?.title }}</h2>
          <p class="text-[#666666] text-[14px]">
            {{ notification?.subtitle }}
          </p>
        </div>
        <div class="flex gap-x-6">
          <CheckboxCustom
            label="On"
            :groupName="notification.entityName"
            :checked="notification.isEnabled"
            @update:modelValue="() => updateSelection(notification.entityName, true)"
          />
          <CheckboxCustom
            label="Off"
            :groupName="notification.entityName"
            :checked="!notification.isEnabled"
            @update:modelValue="() => updateSelection(notification.entityName, false)"
          />
        </div>
      </div>
    </div>
    <div>
      <button
        @click="handleEditNotificationStatus"
        :class="{ 'bg-opacity-50': !updateListNotificationStatus.length }"
        class="btn px-10 mt-5 w-44"
      >
        <template v-if="isLoading">
          <SmallLoading />
        </template>
        <template v-else> Save setting </template>
      </button>
    </div>
  </div>
</template>
