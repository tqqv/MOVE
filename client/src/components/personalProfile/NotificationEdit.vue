<script setup>
  import { ref } from 'vue';
  import CheckboxCustom from '../CheckboxCustom.vue';

  const allNoti = ref(true);

  function updateSelection(value) {
    allNoti.value = value;
  }
</script>
<template>
  <div class="mb-5">
    <h2 class="font-bold text-[14px]">All notifications</h2>
    <p class="text-[#666666] text-[14px]">
      Get notified on updates that are relevant to you! You may also receive additional emails for
      any updates on MOVE.
    </p>
    <div class="flex gap-x-10 mt-3 text-[14px]">
      <CheckboxCustom
        label="Yes"
        groupName="all"
        :checked="allNoti === true"
        @update:modelValue="updateSelection(true)"
      />
      <CheckboxCustom
        label="No"
        groupName="all"
        :checked="allNoti === false"
        @update:modelValue="updateSelection(false)"
      />
    </div>
    <div v-if="allNoti">
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
