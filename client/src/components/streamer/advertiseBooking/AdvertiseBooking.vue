<script setup>
  import { ref, computed } from 'vue';
  import Stepper from 'primevue/stepper';
  import Step from 'primevue/step';
  import StepList from 'primevue/steplist';
  import StepPanels from 'primevue/steppanels';
  import StepPanel from 'primevue/steppanel';
  import DatePicker from 'primevue/datepicker';
  import Button from 'primevue/button';
  import {
    formatDate,
    formatDuration,
    formatDateData,
    formatView,
    genreDuration,
    truncateDescripton,
  } from '@/utils';
  const selectedDate = ref(null);
  const currentStep = ref('1');
  const searchTerm = ref('');
  const selectedVideo = ref(null);
  const videos = ref([
    {
      id: 1,
      name: 'Video 1',
      image: 'https://via.placeholder.com/100x100',
      description: 'This is the description for Video 1',
      selected: false,
      category: 'MMA',
      levelWorkout: 'Beginner',
      duration: 10,
      views: 100,
      donateReps: 50,
    },
    {
      id: 2,
      name: 'Video 2',
      image: 'https://via.placeholder.com/100x100',
      description: 'This is the description for Video 2',
      selected: false,
      category: 'MMA',
      levelWorkout: 'Beginner',
      views: 80,
      donateReps: 40,
    },
    {
      id: 1,
      name: 'Video 1',
      image: 'https://via.placeholder.com/100x100',
      description: 'This is the description for Video 1',
      selected: false,
      category: 'MMA',
      levelWorkout: 'Beginner',
      duration: 10,
      views: 100,
      donateReps: 50,
    },
    {
      id: 2,
      name: 'Video 2',
      image: 'https://via.placeholder.com/100x100',
      description: 'This is the description for Video 2',
      selected: false,
      category: 'MMA',
      levelWorkout: 'Beginner',
      views: 80,
      donateReps: 40,
    },
  ]);

  const showVideoList = ref(false);

  const toggleVideoList = () => {
    showVideoList.value = !showVideoList.value;
  };

  const toggleVideoSelection = (video) => {
    if (video.selected) {
      selectedVideo.value = video;
    } else {
      if (selectedVideo.value && selectedVideo.value.id === video.id) {
        selectedVideo.value = null;
      }
    }
  };
  const handleDateChange = (date) => {
    selectedDate.value = date;
  };

  const filteredVideos = computed(() => {
    return videos.value.filter((video) =>
      video.name.toLowerCase().includes(searchTerm.value.toLowerCase()),
    );
  });
</script>

<template>
  <section class="container">
    <div class="flex justify-between pb-4">
      <h1 class="text_title">Advertise Booking</h1>
    </div>
    <div class="bg-white shadow-lg p-6 rounded-md text-black">
      <div class="grid grid-cols-12 gap-4">
        <!-- Stepper -->
        <div class="col-span-9">
          <Stepper :value="currentStep" class="w-full">
            <StepList>
              <Step value="1">Select Date</Step>
              <Step value="2">Select Option</Step>
              <Step value="3">Payment</Step>
            </StepList>

            <StepPanels>
              <!-- Step 1: Select Date -->
              <StepPanel v-slot="{ activateCallback }" value="1">
                <div class="flex flex-col h-[300px]">
                  <DatePicker
                    v-model="selectedDate"
                    class="w-full"
                    placeholder="Select a date"
                    inline
                    @update:model-value="handleDateChange"
                  />
                </div>
                <div class="flex pt-6 justify-end">
                  <Button
                    class="btn"
                    label="Next"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    @click="activateCallback('2')"
                  />
                </div>
              </StepPanel>

              <!-- Step 2: Select Option -->
              <StepPanel v-slot="{ activateCallback }" value="2">
                <div class="flex flex-col h-[300px]">
                  <div class="flex gap-x-12 pl-4 mb-4 items-center">
                    <!-- Tiêu đề -->
                    <div class="text-xl font-semibold">Select Alternative Content (Video)</div>

                    <!-- Input tìm kiếm -->
                    <div class="flex items-center">
                      <div class="relative">
                        <input
                          v-model="searchTerm"
                          type="text"
                          placeholder="Search"
                          class="w-full py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition duration-300"
                        />
                        <span
                          class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        >
                          <i class="pi pi-search"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col gap-2">
                    <div class="mt-2 h-[200px] overflow-y-auto">
                      <div
                        v-for="video in filteredVideos"
                        :key="video.id"
                        class="flex gap-4 items-start bg-white p-4 rounded shadow hover:shadow-md"
                      >
                        <!-- Hiển thị hình ảnh -->
                        <img
                          :src="video.image"
                          :alt="video.name"
                          class="w-20 h-20 object-cover rounded-md border"
                        />

                        <!-- Hiển thị thông tin video -->
                        <div class="flex-1">
                          <div class="flex justify-between items-center">
                            <h4 class="font-semibold text-lg">{{ video.name }}</h4>
                            <input
                              v-if="!selectedVideo || selectedVideo.id === video.id"
                              type="checkbox"
                              v-model="video.selected"
                              class="h-5 w-5 cursor-pointer"
                              @change="toggleVideoSelection(video)"
                            />
                          </div>
                          <p class="text-sm">{{ video.description }}</p>

                          <div
                            class="flex gap-2 items-center text-[10px] font-bold pt-2 text-black"
                          >
                            <span class="bg-[#EEEEEE] rounded-full px-3">{{
                              video.levelWorkout
                            }}</span>
                            <span v-if="video.duration" class="bg-[#EEEEEE] rounded-full px-3">{{
                              genreDuration(video.duration)
                            }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex pt-6 justify-between">
                  <Button
                    label="Back"
                    severity="secondary"
                    icon="pi pi-arrow-left"
                    @click="activateCallback('1')"
                  />
                  <Button
                    class="btn"
                    label="Next"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    @click="activateCallback('3')"
                  />
                </div>
              </StepPanel>

              <!-- Step 3: Booking Summary -->
              <StepPanel v-slot="{ activateCallback }" value="3">
                <div class="flex flex-col h-[300px]">
                  <div
                    class="border-2 border-dashed border-surface-200 rounded bg-surface-50 flex-auto flex justify-center items-center font-medium"
                  >
                    Payment
                  </div>
                </div>
                <div class="pt-6">
                  <Button
                    label="Back"
                    severity="secondary"
                    icon="pi pi-arrow-left"
                    @click="activateCallback('2')"
                  />
                </div>
              </StepPanel>
            </StepPanels>
          </Stepper>
        </div>

        <!-- Booking Details Column -->
        <div class="col-span-3 p-6 bg-white border-primary border-l h-full">
          <h3 class="text-2xl font-semibold">Booking Details</h3>
          <div class="mt-6 space-y-4">
            <!-- Selected Date -->
            <div class="flex items-center justify-between">
              <p class="whitespace-nowrap"><strong>Selected Date:</strong></p>
              <p class="font-medium">
                {{ formatDateData(selectedDate) || 'Not selected' }}
              </p>
            </div>

            <!-- Available for Booking -->
            <div class="flex items-center justify-between">
              <p class="text-gray-600"><strong>Current Bookings:</strong></p>
              <p class="font-medium">4/6</p>
            </div>

            <!-- Selected Videos -->
            <div class="flex items-center justify-between">
              <p class="text-gray-600"><strong>Selected Videos:</strong></p>
              <p class="font-medium">
                {{
                  videos
                    .filter((video) => video.selected)
                    .map((video) => video.name)
                    .join(', ') || 'None'
                }}
              </p>
            </div>

            <!-- Price -->
            <div class="flex items-center justify-between">
              <p class="text-gray-600"><strong>Price:</strong></p>
              <p class="font-medium">400 REPs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
