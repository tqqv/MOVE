<script setup>
  import { ref, computed } from 'vue';
  import Stepper from 'primevue/stepper';
  import Step from 'primevue/step';
  import StepList from 'primevue/steplist';
  import StepPanels from 'primevue/steppanels';
  import StepPanel from 'primevue/steppanel';
  import Button from 'primevue/button';

  import SelectDate from './step/SelectDate.vue';
  import SelectVideo from './step/SelectVideo.vue';
  import Payment from './step/Payment.vue';

  import BookingDetail from './BookingDetail.vue';

  const currentStep = ref('1');
  const selectedDate = ref(null);
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
  ]);

  const toggleVideoSelection = (video) => {
    if (video.selected) {
      selectedVideo.value = video;
    } else {
      if (selectedVideo.value && selectedVideo.value.id === video.id) {
        selectedVideo.value = null;
      }
    }
  };

  const goToNextStep = () => {
    if (currentStep.value === '1') currentStep.value = '2';
    else if (currentStep.value === '2') currentStep.value = '3';
  };

  const goToPreviousStep = () => {
    if (currentStep.value === '2') currentStep.value = '1';
    else if (currentStep.value === '3') currentStep.value = '2';
  };

  const isBackDisabled = computed(() => currentStep.value === '1');
  const isNextDisabled = computed(() => currentStep.value === '3');
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
              <!-- Step 1 -->
              <StepPanel value="1">
                <SelectDate v-model:selectedDate="selectedDate" />
              </StepPanel>

              <!-- Step 2 -->
              <StepPanel value="2">
                <SelectVideo
                  :videos="videos"
                  v-model:searchTerm="searchTerm"
                  @toggleVideoSelection="toggleVideoSelection"
                />
              </StepPanel>

              <!-- Step 3 -->
              <StepPanel value="3">
                <Payment />
              </StepPanel>
            </StepPanels>
          </Stepper>

          <!-- Common Buttons -->
          <div class="flex justify-between mt-6">
            <Button
              label="Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              :disabled="isBackDisabled"
              @click="goToPreviousStep"
            />
            <Button
              class="btn"
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              :disabled="isNextDisabled"
              @click="goToNextStep"
            />
          </div>
        </div>

        <!-- Booking Details -->
        <div class="col-span-3">
          <BookingDetail :selectedDate="selectedDate" :videos="videos" />
        </div>
      </div>
    </div>
  </section>
</template>
