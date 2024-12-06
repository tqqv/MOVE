<script setup>
  import Dialog from 'primevue/dialog';
  import Button from 'primevue/button';
  import { usePopupStore } from '@/stores/popup.store';
  import CheckboxCustom from '@/components/CheckboxCustom.vue';
  import { ref } from 'vue';
  import { convertDateSuspend } from '@/utils';
  import { toast } from 'vue3-toastify';
  const popupStore = usePopupStore();

  const props = defineProps({
    typeReport: String,
    targetAccount: Object,
  });

  // HANDLE SUSPEND
  const optionDate = [
    {
      duration: 3,
      value: '3 days',
    },
    {
      duration: 7,
      value: '7 days',
    },
    {
      duration: 14,
      value: '14 days',
    },
  ];
  const selectedDuration = ref(null);
  const dateSuspend = ref(null);

  const updateSelection = (value) => {
    selectedDuration.value = value;
    const today = new Date();
    today.setDate(today.getDate() + value);
    dateSuspend.value = convertDateSuspend(today);
  };
  const handleSuspend = () => {
    if (selectedDuration.value == null) {
      return;
    } else {
      console.log('suspend');
    }

    popupStore.closeShowSuspend();
    selectedDuration.value = null;
  };

  // HANDLE BAN
  const handleBan = () => {
    console.log('Ban');
    popupStore.closeShowBan();
  };

  // HANDLE ACCEPT
  const handleAccept = () => {
    console.log('Accept');
    popupStore.closeShowAccept();
  };

  // HANDLE REJECT
  const handleReject = () => {
    console.log('Reject');
    popupStore.closeShowReject();
  };

  // HANDLE CLOSE POPUP
  const handleCancel = () => {
    popupStore.closeShowSuspend();
    popupStore.closeShowBan();
    popupStore.closeShowAccept();
    popupStore.closeShowReject();
  };
</script>
<template>
  <!-- SUSPEND -->
  <Dialog
    v-if="props.typeReport === 'suspend'"
    modal
    :draggable="false"
    :dismissableMask="true"
    v-model:visible="popupStore.showSuspend"
    :header="`Suspend ${props.targetAccount?.username}`"
    class="w-full md:w-[474px] mx-3 md:mx-0"
  >
    <div class="flex flex-col gap-y-3">
      <p class="text-[11px] md:text-[14px] italic">
        Select the period of time you want to suspend
        <span class="font-semibold">
          {{ props.targetAccount?.username }}
        </span>
      </p>
      <div class="flex justify-between my-5">
        <CheckboxCustom
          v-for="(option, index) in optionDate"
          :key="index"
          :label="option.value"
          groupName="durationOptions"
          :checked="selectedDuration === option.value"
          @update:modelValue="updateSelection(option.duration)"
        />
      </div>
      <div class="flex gap-x-12 justify-center">
        <button
          class="btn-suspend"
          :class="{ 'bg-yellow-dark/50 cursor-not-allowed': selectedDuration == null }"
          @click="handleSuspend"
        >
          Suspend
        </button>
        <button class="btn-cancel" @click="handleCancel">Cancel</button>
      </div>
    </div>
  </Dialog>

  <!-- BAN -->
  <Dialog
    v-if="props.typeReport === 'ban'"
    modal
    :draggable="false"
    :dismissableMask="true"
    v-model:visible="popupStore.showBan"
    :header="`Ban ${props.targetAccount?.username}`"
    class="w-full md:w-[474px] mx-3 md:mx-0"
  >
    <div class="flex flex-col gap-y-3">
      <p class="text-[11px] md:text-[14px] mb-3">
        Do you want to ban
        <span class="font-semibold">
          {{ props.targetAccount?.username }}
        </span>
        permanently?
      </p>

      <div class="flex gap-x-12 justify-center">
        <button class="btn-ban" @click="handleBan">Ban</button>
        <button class="btn-cancel" @click="handleCancel">Cancel</button>
      </div>
    </div>
  </Dialog>

  <!-- ACCEPT -->
  <Dialog
    v-if="props.typeReport === 'accept'"
    modal
    :draggable="false"
    :dismissableMask="true"
    v-model:visible="popupStore.showAccept"
    :header="`Accept report to ${props.targetAccount?.username}`"
    class="w-full md:w-[474px] mx-3 md:mx-0"
  >
    <div class="flex flex-col gap-y-3">
      <p class="text-[11px] md:text-[14px] mb-3">
        After accepting, the <span class="font-semibold">{{ targetAccount.type }}</span> will be
        deleted and the system will send a notification to the
        <span class="font-semibold">
          {{ props.targetAccount?.username }}
        </span>
      </p>

      <div class="flex gap-x-12 justify-center">
        <button class="btn-success" @click="handleAccept">Accept</button>
        <button class="btn-cancel" @click="handleCancel">Cancel</button>
      </div>
    </div>
  </Dialog>

  <!-- REJECT -->
  <Dialog
    v-if="props.typeReport === 'reject'"
    modal
    :draggable="false"
    :dismissableMask="true"
    v-model:visible="popupStore.showReject"
    :header="`Reject report to ${props.targetAccount?.username}`"
    class="w-full md:w-[474px] mx-3 md:mx-0"
  >
    <div class="flex flex-col gap-y-3">
      <p class="text-[11px] md:text-[14px] mb-3">Reject report if this is an incorrect report.</p>

      <div class="flex gap-x-12 justify-center">
        <button class="btn-reject" @click="handleReject">Reject</button>
        <button class="btn-cancel" @click="handleCancel">Cancel</button>
      </div>
    </div>
  </Dialog>
</template>
