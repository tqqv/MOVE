<script setup>
  import Dialog from 'primevue/dialog';
  import Button from 'primevue/button';
  import { usePopupStore } from '@/stores/popup.store';
  import TickRight from '@/components/icons/tickRight.vue';
  import { copyToClipboard } from '@/utils/copyToClipboard';
  const popupStore = usePopupStore();

  const chatUrl = ' https://www.nimo.tv/vidwalla/overlay?_roomId=27724811&_lang=1033&_type=chatbox';
  const handleChatURL = () => {
    copyToClipboard(chatUrl, 'Successfully copied to clipboard', 'Failed copied to clipboard');
  };
</script>
<template>
  <Dialog
    modal
    :draggable="false"
    :dismissableMask="true"
    v-model:visible="popupStore.showInstructionLive"
    header="Set up screen chat "
    class="w-full md:w-[574px] mx-3 md:mx-0"
  >
    <div class="flex flex-col gap-y-10">
      <div class="flex flex-col gap-y-2 mt-4">
        <div>
          1. Copy screen
          <span class="text-primary font-semibold">chat</span>
          URL
        </div>
        <div class="flex gap-x-2">
          <div class="input_custom bg-gray-light truncate">{{ chatUrl }}</div>
          <div
            v-tooltip.top="'copy stream url'"
            class="flex justify-center items-center text-white size-12 rounded-full bg-primary-light cursor-pointer hover:bg-primary flex-shrink-0"
            @click="handleChatURL"
          >
            <i class="pi pi-link text-xl"></i>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-y-2">
        <div>2. Open OBS</div>
      </div>
      <div class="flex flex-col gap-y-2">
        <div>3. Add Browser in Sources</div>
        <img
          src="https://res.cloudinary.com/dg9imqwrd/image/upload/v1732692539/ncitji6tbd6wcpzqbh9y.png"
          alt=""
          class="w-64 rounded-lg"
        />
      </div>
      <div class="flex flex-col gap-y-2">
        <div>4. Choose browser sources</div>
        <img
          src="https://res.cloudinary.com/dg9imqwrd/image/upload/v1732692864/wqdvrpdg0sbgxwngdjv7.png"
          alt=""
          class="w-64 rounded-lg"
        />
      </div>
      <div class="flex flex-col gap-y-2">
        <div>5. Add URL to browser</div>
        <img
          src="https://res.cloudinary.com/dg9imqwrd/image/upload/v1732693116/kvhc6kg8wyjxdjj15u5p.png"
          alt=""
          class="w-64 rounded-lg"
        />
      </div>
      <div class="flex items-center gap-x-2">
        <TickRight />
        <div>Oke, setup screen chat in live stream</div>
      </div>
    </div>
  </Dialog>
</template>
