<script setup>
  import Dropdown from 'primevue/dropdown';
</script>
<template>
  <div class="flex flex-col">
    <label class="text-[16px] font-medium">Category</label>
    <Dropdown
      optionLabel="category"
      placeholder="Select a category"
      class="w-[40%] md:w-14rem custom-dropdown mt-1"
    />
  </div>
  <div class="flex flex-col md:flex-row justify-between mt-3 gap-x-6">
    <div>
      <label class="text-[16px] font-medium">Workout level</label>
      <div class="flex gap-x-3 mt-1">
        <span class="tag mt-1 tag_active">Beginner</span>
        <span class="tag mt-1">Intermediate</span>
        <span class="tag mt-1">Advanced</span>
      </div>
    </div>
    <div>
      <label class="text-[16px] font-medium">Duration</label>
      <div class="flex gap-x-3 text-nowrap mt-1">
        <span class="tag mt-1 tag_active">< 30 mins</span>
        <span class="tag mt-1">< 1 hour</span>
        <span class="tag mt-1">> 1 hour</span>
      </div>
    </div>
  </div>
  <div class="mt-3">
    <div class="flex gap-x-4">
      <label class="text-[16px] font-medium">Search keywords</label>
      <label class="text-[16px] font-medium text-footer">(Optionals)</label>
    </div>
    <p class="text-[12px] text-footer font-medium mt-1">
      Adding keywords help your viewers to find your videos easily. Enter a comma after each word.
    </p>
    <textarea
      name="keyword"
      id="keyword"
      class="border-[2px] border-gray-dark focus:border-primary outline-none rounded-md mt-2 w-full p-2 resize-none h-[100px]"
      placeholder="Add tags"
    ></textarea>
    <span class="text-[12px] text-footer font-medium flex justify-end">0/500</span>
  </div>
</template>
