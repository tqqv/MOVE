<script setup></script>

<template>
  <div class="container mx-auto py-10 px-4 lg:px-20">
    <!-- Header Section -->
    <div class="flex items-center pl-4">
      <span class="font-bold text-[32px]">About us</span>
    </div>
    <div class="py-20 relative">
      <div class="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
        <div class="w-full justify-start items-center gap-12 grid lg:grid-cols-2 grid-cols-1">
          <!-- Image Section -->
          <div
            class="w-full justify-center items-start gap-6 grid sm:grid-cols-2 grid-cols-1 lg:order-first order-last"
          >
            <div
              class="pt-24 lg:justify-center sm:justify-end justify-start items-start gap-2.5 flex"
            >
              <img
                class="rounded-xl object-cover"
                src="https://images.pexels.com/photos/8007405/pexels-photo-8007405.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Sports Live Stream"
              />
            </div>
            <img
              class="sm:ml-0 ml-auto rounded-xl object-cover"
              src="https://images.pexels.com/photos/2765871/pexels-photo-2765871.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Upload Video Content"
            />
          </div>

          <!-- Text Section -->
          <div
            class="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex"
          >
            <div class="w-full flex-col justify-center items-start gap-8 flex">
              <div class="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                <h2
                  class="text-gray-900 text-4xl font-bold font-manrope leading-normal lg:text-start text-center"
                >
                  Your Ultimate Sports Video Platform
                </h2>
                <p
                  class="text-gray-500 text-base font-normal leading-relaxed lg:text-start text-center"
                >
                  MOVE is revolutionizing how sports enthusiasts connect and share experiences. From
                  live streaming major tournaments to uploading personal sports highlights, we bring
                  the world of sports closer to you.
                </p>
              </div>

              <!-- Key Highlights -->
              <div
                class="w-full lg:justify-start justify-center items-center sm:gap-10 gap-5 inline-flex"
              >
                <div class="flex-col justify-start items-start inline-flex">
                  <h3 class="text-gray-900 text-4xl font-bold font-manrope leading-normal">10K+</h3>
                  <h6 class="text-gray-500 text-base font-normal leading-relaxed">
                    Live Streams Hosted
                  </h6>
                </div>
                <div class="flex-col justify-start items-start inline-flex">
                  <h4 class="text-gray-900 text-4xl font-bold font-manrope leading-normal">50K+</h4>
                  <h6 class="text-gray-500 text-base font-normal leading-relaxed">
                    Videos Uploaded
                  </h6>
                </div>
                <div class="flex-col justify-start items-start inline-flex">
                  <h4 class="text-gray-900 text-4xl font-bold font-manrope leading-normal">1M+</h4>
                  <h6 class="text-gray-500 text-base font-normal leading-relaxed">Engaged Users</h6>
                </div>
              </div>
            </div>

            <!-- Call to Action Button -->
            <button
              class="sm:w-fit w-full px-3.5 py-2 bg-indigo-600 hover:bg-indigo-800 transition-all duration-700 ease-in-out rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] justify-center items-center flex"
            >
              <span class="px-1.5 text-white text-sm font-medium leading-6">Explore MOVE Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
