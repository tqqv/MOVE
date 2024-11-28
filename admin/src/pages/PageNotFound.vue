<script setup></script>
<template>
  <div>
    <section class="flex items-center h-screen p-16 bg-gray-light dark:bg-gray-dark">
      <div class="container flex flex-col items-center">
        <div class="flex flex-col gap-6 max-w-md text-center">
          <h2 class="font-extrabold text-9xl"><span class="sr-only">Error</span>404</h2>
          <p class="text-2xl md:text-3xl dark:text-gray-dark">Sorry, we couldn't find this page.</p>
          <router-link to="/">
            <p class="px-4 py-2 text-xl font-semibold rounded-lg bg-primary text-white">
              Back to home
            </p>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>
