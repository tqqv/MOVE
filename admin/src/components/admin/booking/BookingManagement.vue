<script setup>
  import DataTable from 'primevue/datatable';
  import Button from 'primevue/button';
  import InputText from 'primevue/inputtext';
  import InputNumber from 'primevue/inputnumber';
  import { formatDateData, formatNumber, genreDuration } from '@/utils';
  import { onMounted, ref } from 'vue';
  import Column from 'primevue/column';

  import Dialog from 'primevue/dialog';

  const isEditVisible = ref(false);
  const toggleEditVisible = () => {
    isEditVisible.value = !isEditVisible.value;
  };
  // Dữ liệu giả booking history
  const bookingHistoryData = [
    {
      id: 1,
      date: '2024-12-01',
      video: {
        id: 'v1',
        thumbnailUrl:
          'https://i.vimeocdn.com/video/1960841064-63308f8745ae766383c26b3adb9ddc8b86cf382526f84c61cd52faf4660b4cd0-d',
        title: 'Yoga for Beginners',
        category: {
          title: 'Yoga',
        },
        levelWorkout: {
          levelWorkout: 'Beginner',
        },
        duration: 3600,
      },
      featuredBase: {
        pricePerDay: 5000,
      },
      featuredAbnormal: null,
    },
    {
      id: 2,
      date: '2024-12-01',
      video: {
        id: 'v2',
        thumbnailUrl:
          'https://i.vimeocdn.com/video/1960841064-63308f8745ae766383c26b3adb9ddc8b86cf382526f84c61cd52faf4660b4cd0-d',
        title: 'High-Intensity Interval Training',
        category: {
          title: 'HIIT',
        },
        levelWorkout: {
          levelWorkout: 'Intermediate',
        },
        duration: 1800,
      },
      featuredBase: null,
      featuredAbnormal: {
        pricePerDay: 5000,
      },
    },
    {
      id: 3,
      date: '2024-12-01',
      video: {
        id: 'v3',
        thumbnailUrl:
          'https://i.vimeocdn.com/video/1960841064-63308f8745ae766383c26b3adb9ddc8b86cf382526f84c61cd52faf4660b4cd0-d',
        title: 'Strength Training Basics',
        category: {
          title: 'Strength',
        },
        levelWorkout: {
          levelWorkout: 'Advanced',
        },
        duration: 5400,
      },
      featuredBase: {
        pricePerDay: 5000,
      },
      featuredAbnormal: null,
    },
    {
      id: 3,
      date: '2024-12-01',
      video: {
        id: 'v3',
        thumbnailUrl:
          'https://i.vimeocdn.com/video/1960841064-63308f8745ae766383c26b3adb9ddc8b86cf382526f84c61cd52faf4660b4cd0-d',
        title: 'Strength Training Basics',
        category: {
          title: 'Strength',
        },
        levelWorkout: {
          levelWorkout: 'Advanced',
        },
        duration: 5400,
      },
      featuredBase: {
        pricePerDay: 5000,
      },
      featuredAbnormal: null,
    },
    {
      id: 3,
      date: '2024-12-01',
      video: {
        id: 'v3',
        thumbnailUrl:
          'https://i.vimeocdn.com/video/1960841064-63308f8745ae766383c26b3adb9ddc8b86cf382526f84c61cd52faf4660b4cd0-d',
        title: 'Strength Training Basics',
        category: {
          title: 'Strength',
        },
        levelWorkout: {
          levelWorkout: 'Advanced',
        },
        duration: 5400,
      },
      featuredBase: {
        pricePerDay: 5000,
      },
      featuredAbnormal: null,
    },
    {
      id: 3,
      date: '2024-12-01',
      video: {
        id: 'v3',
        thumbnailUrl:
          'https://i.vimeocdn.com/video/1960841064-63308f8745ae766383c26b3adb9ddc8b86cf382526f84c61cd52faf4660b4cd0-d',
        title: 'Strength Training Basics',
        category: {
          title: 'Strength',
        },
        levelWorkout: {
          levelWorkout: 'Advanced',
        },
        duration: 5400,
      },
      featuredBase: {
        pricePerDay: 5000,
      },
      featuredAbnormal: null,
    },
  ];
</script>

<template>
  <section>
    <div class="container">
      <!-- Tiêu đề và nút tạo -->
      <div class="flex justify-between items-center mb-7">
        <h1 class="text-2xl font-bold">Management Booking</h1>
        <div class="flex gap-x-4">
          <InputText
            type="date"
            v-model="filterDate"
            class="p-inputtext-sm"
            placeholder="Select a date"
          />
          <Button label="Edit Booking" @click="toggleEditVisible" class="btn" />
        </div>
      </div>

      <!-- Bảng hiển thị dữ liệu booking -->
      <Dialog
        v-model:visible="isEditVisible"
        :style="{ width: '600px' }"
        header="Edit Config"
        :modal="true"
        :draggable="false"
      >
        <div class="card bg-white p-4 shadow rounded-lg">
          <div class="flex flex-col gap-6">
            <div>
              <label for="key" class="block font-bold mb-3"> Date</label>
              <InputText
                type="date"
                v-model="key"
                id="key"
                v-model.trim="key"
                :invalid="submitted && !key"
                name="key"
                required
                autofocus
                placeholder="widthdrawRate"
                fluid
              />
              <small v-if="submitted && !key" class="error_toast">Key is required.</small>
            </div>
            <div>
              <label for="value" class="block font-bold mb-3">Slot Booking</label>
              <InputNumber
                id="value"
                v-model.trim="value"
                :invalid="submitted && !value"
                required
                placeholder="2/10"
                :maxFractionDigits="2"
                fluid
              />
              <small v-if="submitted && !value" class="error_toast">Value is required.</small>
            </div>
            <div>
              <label for="value" class="block font-bold mb-3">Price</label>
              <InputNumber
                id="value"
                v-model.trim="value"
                :invalid="submitted && !value"
                required
                placeholder="2000 REPs"
                :maxFractionDigits="2"
                fluid
              />
              <small v-if="submitted && !value" class="error_toast">Value is required.</small>
            </div>
            <div class="flex justify-end"><Button class="btn"> Save</Button></div>
          </div>
        </div>
      </Dialog>
      <div class="card bg-white p-4 shadow rounded-lg mt-8">
        <DataTable :value="bookingHistoryData" tableStyle="min-width: 50rem; text-align: center">
          <!-- Cột ngày tháng -->
          <Column header="Date">
            <template #body="{ data }">
              <span>{{ formatDateData(data.date) }}</span>
            </template>
          </Column>

          <!-- Cột video -->
          <Column header="Video">
            <template #body="{ data }">
              <img
                :src="data.video.thumbnailUrl"
                alt="thumbnail"
                class="w-[200px] h-[100px] object-cover rounded"
              />
            </template>
          </Column>

          <!-- Cột thông tin chi tiết -->
          <Column header="Details">
            <template #body="{ data }">
              <div>
                <h3 class="font-bold text-lg">{{ data.video.title }}</h3>
                <p>{{ data.video.category?.title }}</p>
                <div class="flex gap-2 mt-2 text-sm">
                  <span class="bg-[#ccc] px-3 py-1 rounded-full">{{
                    data.video.levelWorkout.levelWorkout
                  }}</span>
                  <span class="bg-[#ccc] px-3 py-1 rounded-full">{{
                    genreDuration(data.video.duration)
                  }}</span>
                </div>
              </div>
            </template>
          </Column>

          <!-- Cột giá -->
          <Column header="Price">
            <template #body="{ data }">
              <span class="font-bold">
                {{
                  formatNumber(data.featuredBase?.pricePerDay || data.featuredAbnormal?.pricePerDay)
                }}
                REPs
              </span>
            </template>
          </Column>

          <!-- Cột hành động -->
          <Column header="Action">
            <template #body="{ data }">
              <Button label="Delete" class="btn" />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
