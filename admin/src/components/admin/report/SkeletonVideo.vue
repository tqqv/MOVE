<script setup lang="ts">
  import Skeleton from 'primevue/skeleton';
</script>

<template>
  <div class="flex p-3 border border-gray-dark rounded-md flex-col gap-y-4 w-full">
    <div class="relative w-full overflow-hidden rounded-lg">
      <Skeleton width="100%" height="300px"></Skeleton>
    </div>

    <!-- CONTENT -->
    <div class="flex flex-col gap-y-3 px-3">
      <div class="text-lg font-semibold">
        <Skeleton width="17rem" height="1.5rem"></Skeleton>
      </div>

      <!-- CHANNEL -->
      <div class="flex justify-between">
        <div class="flex items-center gap-x-3">
          <Skeleton shape="circle" size="3rem"></Skeleton>
          <div class="flex flex-col justify-center gap-y-2 mb-1">
            <Skeleton width="5rem"></Skeleton>
            <div class="flex items-center gap-x-2 text-body">
              <Skeleton width="6rem"></Skeleton>

              <Skeleton width="6rem"></Skeleton>
            </div>
          </div>
        </div>
      </div>

      <!-- DESCRIPTION -->
      <div class="rounded-md">
        <Skeleton width="100%" height="5rem"></Skeleton>
      </div>
    </div>
  </div>
</template>
