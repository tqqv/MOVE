<script setup>
  const emit = defineEmits(['closeAllPopups']);
</script>
<template>
  <div class="shadow-lg rounded-lg w-[194px] bg-white text-black p-6">
    <ul class="space-y-2">
      <RouterLink :to="`/about-us`" @click="emit('closeAllPopups')">
        <li class="group">
          <span class="block hover:text-primary font-medium transition-colors duration-200">
            About Us
          </span>
          <div
            class="h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-200"
          ></div></li
      ></RouterLink>
      <RouterLink :to="`/faq`" @click="emit('closeAllPopups')">
        <li class="group">
          <span class="block hover:text-primary font-medium transition-colors duration-200">
            FAQ
          </span>
          <div
            class="h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-200"
          ></div></li
      ></RouterLink>
      <RouterLink :to="`/community-guidelines`" @click="emit('closeAllPopups')">
        <li class="group">
          <span
            class="block hover:text-primary font-medium transition-colors duration-200 whitespace-nowrap"
          >
            Community Guideline
          </span>
          <div
            class="h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-200"
          ></div></li
      ></RouterLink>
    </ul>
  </div>
</template>
