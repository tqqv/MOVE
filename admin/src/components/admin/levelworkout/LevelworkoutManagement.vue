<script setup>
  import { ref } from 'vue';
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  import InputText from 'primevue/inputtext';
  import Textarea from 'primevue/textarea';
  import VideoUpload from '@/components/icons/videoUpload.vue';

  const levelDialog = ref(false);

  const openlevelDialog = () => {
    levelDialog.value = true;
  };

  const hideDialog = () => {
    levelDialog.value = false;
  };

  const levelWorkouts = ref([
    {
      id: '1000',
      levelWorkout: 'Beginner',
      createAt: '09/11/2024',
      updatedAt: '09/11/2024',
    },
    {
      id: '1000',
      levelWorkout: 'MMA',
      createAt: '09/11/2024',
      updatedAt: '09/11/2024',
    },
    {
      id: '1000',
      levelWorkout: 'MMA',
      createAt: '09/11/2024',
      updatedAt: '09/11/2024',
    },
    {
      id: '1000',
      levelWorkout: 'MMA',
      createAt: '09/11/2024',
      updatedAt: '09/11/2024',
    },
  ]);
</script>

<template>
  <section class="bg-[#FAFAFB]">
    <div class="container">
      <div class="card bg-white p-4 shadow rounded-lg">
        <DataTable :value="levelWorkouts" stripedRows showGridlines>
          <template #header>
            <div class="flex flex-wrap gap-2 items-center justify-between">
              <h1 class="font-bold text-[20px]">Manage Level Workouts</h1>
              <Button label="New" icon="pi pi-plus" class="mr-2" @click="openlevelDialog" />
            </div>
          </template>
          <Column field="id" header="ID"></Column>
          <Column field="levelWorkout" header="Level Workout"></Column>
          <Column field="createAt" header="Create at"></Column>
          <Column field="updatedAt" header="Updated at"></Column>
          <Column style="width: 7rem">
            <template #body="{ data }">
              <div class="flex justify-center gap-x-5">
                <button
                  class="hover:bg-[#f1d26a] size-[40px] rounded-full flex justify-center items-center hover:text-white pi pi-pencil"
                ></button>
                <button
                  class="hover:bg-[#ff9c9c] size-[40px] rounded-full flex justify-center items-center hover:text-white pi pi-trash"
                ></button>
              </div>
            </template>
          </Column>
        </DataTable>
        <Dialog
          v-model:visible="levelDialog"
          :style="{ width: '600px' }"
          header="Add Level Workout"
          :modal="true"
          :draggable="false"
        >
          <div class="flex flex-col gap-6">
            <div>
              <label for="levelWorkout" class="block font-bold mb-3">Level Workout</label>
              <InputText
                id="levelWorkout"
                v-model.trim="levelWorkouts.levelWorkout"
                required="true"
                autofocus
                :invalid="submitted && !levelWorkouts.levelWorkout"
                fluid
              />
              <small v-if="submitted && !levelWorkouts.levelWorkout" class="text-red-500"
                >Level Workout is required.</small
              >
            </div>
          </div>
          <template #footer>
            <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" severity="danger" />
            <Button
              label="Save"
              icon="pi pi-check"
              @click="saveProduct"
              class="bg-primary border-none hover:bg-primary-light"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </section>
</template>
