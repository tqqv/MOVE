<script setup>
  import CheckboxCustom from '@components/CheckboxCustom.vue';
  import { useVideoStore } from '@stores';
  import { storeToRefs } from 'pinia';

  const videoStore = useVideoStore();
  const { commentSetting } = storeToRefs(videoStore);
  const { setCommentSetting } = videoStore;
</script>

<template>
  <div class="flex flex-col mb-[100px]">
    <label class="text-[16px] font-medium">Comment settings</label>
    <p class="text-[14px] text-footer font-medium mt-1">
      Enable or disable your viewers to comment on the video.
    </p>
    <div class="flex gap-x-5 mt-3">
      <CheckboxCustom
        label="Enable"
        :checked="commentSetting === true"
        groupName="commentSetting"
        @update:modelValue="setCommentSetting(true)"
      />
      <CheckboxCustom
        label="Disable"
        :checked="commentSetting === false"
        groupName="commentSetting"
        @update:modelValue="setCommentSetting(false)"
      />
    </div>
  </div>
</template>
