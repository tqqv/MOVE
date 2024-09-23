<script setup>
  import MMAImage from '@/assets/category/MMA.png';
  import verified from '@/components/icons/verified.vue';
  import dislike from '@/components/icons/dislike.vue';
  import like from '@/components/icons/like.vue';
</script>

<template>
  <div class="flex gap-x-4 text-xs mb-6">
    <div class="flex-shrink-0">
      <img :src="MMAImage" alt="Avatar" class="size-10 rounded-full object-cover" />
    </div>
    <div class="flex-grow">
      <div class="flex items-center gap-x-4 mb-2">
        <h1 class="">npmh310</h1>
        <span class="mb-1">
          <verified class="scale-95" fill="fill-blue" />
        </span>
        <p class="text-footer">30 mins ago</p>
      </div>
      <p class="text-sm break-words">
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
        laudantium.
      </p>
      <!-- LIKE DISLIKE -->
      <div class="flex gap-x-6 mt-2">
        <div class="flex items-center gap-x-3">
          <like class="cursor-pointer hover:scale-110" fill="white" stroke="#13ceb3" />
        </div>
        <div>
          <dislike class="cursor-pointer mt-2 hover:scale-110" fill="white" stroke="#13ceb3" />
        </div>
      </div>
    </div>
  </div>
</template>
