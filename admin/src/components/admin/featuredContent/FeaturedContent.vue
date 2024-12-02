<script setup>
  import { ref } from 'vue';
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  import InputText from 'primevue/inputtext';
  import Textarea from 'primevue/textarea';
  import VideoUpload from '@/components/icons/videoUpload.vue';
  import ToggleSwitch from 'primevue/toggleswitch';

  const levelDialog = ref(false);

  const openlevelDialog = () => {
    levelDialog.value = true;
  };
  const checked = ref(false);
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
              <h1 class="font-bold text-[20px]">Manage Featured Content</h1>
              <Button label="New" icon="pi pi-plus" class="mr-2" @click="openlevelDialog" />
            </div>
            <div class="flex justify-between items-center mt-4">
              <!-- Thanh tìm kiếm -->
              <div class="flex flex-wrap gap-2">
                <InputText
                  v-model="searchValue"
                  placeholder="Search featured content"
                  class="w-full lg:w-2/3"
                />
                <Button label="Filter" icon="pi pi-filter" class="p-button-outlined" />
              </div>
              <!-- Hai nút ở cuối -->
              <div class="flex gap-2">
                <Button
                  label="Deactivate"
                  icon="pi pi-sort-alt"
                  class="p-button-outlined font-bold"
                >
                  <ToggleSwitch v-model="checked" />Deactivate
                </Button>
                <Button label="Activate" icon="pi pi-sort-alt" class="p-button-outlined font-bold">
                  <ToggleSwitch v-model="checked" />Activate
                </Button>
                <Button label="Delete" icon="pi pi-trash" class="p-button-outlined" />
              </div>
            </div>
          </template>
          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <Column field="id" headerStyle="width: 10rem" header="ID"></Column>
          <Column field="contentType" headerStyle="width: 10rem" header="Content Type"></Column>
          <Column field="image" header="Image"></Column>
          <Column field="description" header="Description"></Column>
          <Column field="channelName" header="Channel Name"></Column>

          <Column style="width: 7rem">
            <template #body="{ data }">
              <div class="flex justify-center gap-x-5">
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
