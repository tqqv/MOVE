<script setup>
  import { useUserStore } from '@/stores';
  import { formatTimeChatInLive } from '@/utils';
  import REPs1 from '../icons/REPsItems/REPs1.vue';
  import REPs2 from '../icons/REPsItems/REPs2.vue';
  import REPs3 from '../icons/REPsItems/REPs3.vue';
  import REPs4 from '../icons/REPsItems/REPs4.vue';
  import REPs5 from '../icons/REPsItems/REPs5.vue';

  const userStore = useUserStore();
  const props = defineProps({
    chatMessages: Array,
  });
</script>

<template>
  <div class="w-screen h-screen flex flex-col bg-transparent">
    <div class="max-h-full h-[30px] flex-grow pb-1 relative">
      <div
        class="flex flex-col-reverse px-2 py-3 h-full relative overflow-y-hidden overflow-x-hidden"
        ref="chatContainerRef"
        @scroll="handleScroll"
      >
        <div class="flex flex-col gap-y-3">
          <div
            v-for="(userChat, index) in props.chatMessages"
            :key="index"
            class="text-[32px] rounded hover:bg-gray-light relative p-1"
            @mouseenter="hoveredIndex = index"
            @mouseleave="hoveredIndex = null"
            :class="{
              'bg-primary/20 hover:bg-primary/20':
                userStore.user?.username &&
                userChat.replyTo?.username &&
                userStore.user?.username === userChat.replyTo?.username &&
                !userChat.donation,
              '!p-0': userChat.donation,
            }"
          >
            <div
              v-if="userChat.replyTo"
              class="flex gap-x-1 items-center mb-1.5 px-0.5 border-stroke text-white font-bold"
            >
              <div class="flex-shrink-0">
                <Chat />
              </div>
              <p class="ml-1 whitespace-nowrap">Replying to</p>
              <RouterLink
                :to="`/user/${userChat.replyTo?.username}`"
                target="_blank"
                class="border-stroke"
              >
                @{{ userChat.replyTo.channelName || userChat.replyTo.username }}
              </RouterLink>
              <p class="truncate">: {{ userChat.replyTo.message }}</p>
            </div>

            <!-- NORMAL CHAT -->
            <div v-if="!userChat.donation" class="inline-block mr-1">
              <div class="flex gap-x-4 items-center truncate text-white">
                <!-- <h1 class="border-stroke font-bold text-[30px]">
                  {{ formatTimeChatInLive(userChat.timestamp) }}
                </h1> -->
                <img
                  class="size-12 object-cover rounded-full flex-shrink-0"
                  :src="userChat.avatar"
                  alt=""
                />
                <div class="flex gap-x-0.5">
                  <h2 class="font-bold truncate text-blue cursor-pointer border-stroke">
                    {{ userChat.channelName || userChat.username }}
                  </h2>
                  <p class="text-black">:</p>
                </div>
              </div>
            </div>
            <span
              v-if="!userChat.donation"
              class="text-white font-bold break-words border-stroke align-top mb-1"
              >{{ userChat.message }}</span
            >
            <!-- DONATE CHAT -->
            <div v-if="userChat.donation" class="w-full text-black">
              <div
                class="flex justify-between gap-x-3 px-1 py-1.5 rounded-t bg-opacity-70"
                :class="{
                  'bg-body': userChat.donation === 100,
                  'bg-primary': userChat.donation === 1000,
                  'bg-purple': userChat.donation === 5000,
                  'bg-blue': userChat.donation === 10000,
                  'bg-yellow-dark': userChat.donation === 25000,
                }"
              >
                <div class="flex gap-x-5">
                  <!-- <span class="">{{ formatTimeChatInLive(userChat.timestamp) }}</span> -->
                  <div class="flex items-center gap-x-3">
                    <img
                      class="size-12 object-cover rounded-full flex-shrink-0"
                      :src="userChat.avatar"
                      alt=""
                    />
                    <div class="flex flex-col">
                      <h2
                        class="font-bold truncate cursor-pointer"
                        @click="handleOpenOptionChat(index)"
                      >
                        {{ userChat.channelName || userChat.username }}
                      </h2>
                      <div class="flex items-center">
                        <template v-if="userChat.donation === 100"
                          ><REPs1 width="50px" height="50px"
                        /></template>
                        <template v-else-if="userChat.donation === 1000"
                          ><REPs2 width="50px" height="50px"
                        /></template>
                        <template v-else-if="userChat.donation === 5000"
                          ><REPs3 width="50px" height="50px"
                        /></template>
                        <template v-else-if="userChat.donation === 10000"
                          ><REPs4 width="50px" height="50px"
                        /></template>
                        <template v-else-if="userChat.donation === 25000"
                          ><REPs5 width="50px" height="50px"
                        /></template>
                        <span class="pb-3 font-medium">{{ userChat.donation }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mx-1">
                  <div class="flex items-center gap-x-1">
                    <img
                      src="https://res.cloudinary.com/dg9imqwrd/image/upload/v1732633992/rk4ptrlvqvg6wfesaf32.gif"
                      alt=""
                      class="size-20"
                    />
                  </div>
                </div>
              </div>
              <div
                class="font-medium px-3 py-1.5 rounded-b"
                :class="{
                  'bg-body': userChat.donation === 100,
                  'bg-primary': userChat.donation === 1000,
                  'bg-purple': userChat.donation === 5000,
                  'bg-blue': userChat.donation === 10000,
                  'bg-yellow-dark': userChat.donation === 25000,
                }"
              >
                {{ userChat.message }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .border-stroke {
    -webkit-text-stroke: 1.4px #000;
  }
</style>
