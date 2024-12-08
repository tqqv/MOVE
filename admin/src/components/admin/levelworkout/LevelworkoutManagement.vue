<script setup>
  import { onMounted, ref } from 'vue';
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  import InputText from 'primevue/inputtext';
  import { toast } from 'vue3-toastify';
  import {
    createLevelWorkout,
    deleteLevelWorkout,
    editLevelWorkout,
    getAllLevelWorkoutByAdmin,
  } from '@/services/levelWorkout';
  import CreateButton from '@/components/CreateButton.vue';
  import Skeleton from 'primevue/skeleton';
  import SmallLoading from '@/components/icons/smallLoading.vue';
  import { checkDataChanged, getChangedFields } from '@/utils/compareData';

  const levelDialog = ref(false);
  const levelWorkouts = ref([]);
  const isLoading = ref(true);
  const loadingSubmit = ref(false);
  const submitted = ref(false);
  const newLevelWorkout = ref({
    levelWorkout: '',
  });
  const editLevelDialog = ref(false);
  const deleteLevelDialog = ref(false);

  const selectedLevelWorkout = ref();
  // OPEN CLOSE
  const openLevelDialog = () => {
    levelDialog.value = true;
  };

  const hideDialog = () => {
    levelDialog.value = false;
    submitted.value = false;
  };

  const openEditLevelDialog = (levelWorkout) => {
    selectedLevelWorkout.value = { ...levelWorkout };
    editLevelDialog.value = true;
  };

  const hideEditLevelDialog = () => {
    editLevelDialog.value = false;
    submitted.value = false;
  };

  const openDeleteLevelDialog = (levelWorkout) => {
    selectedLevelWorkout.value = { ...levelWorkout };
    if (
      selectedLevelWorkout.value?.videoCount > 0 ||
      selectedLevelWorkout.value?.livestreamCount > 0
    ) {
      toast.info('Cannot delete level workout that already has video');
      return;
    }
    deleteLevelDialog.value = true;
  };

  const hideDeleteLevelDialog = () => {
    deleteLevelDialog.value = false;
  };
  // FETCH ALL
  const fetchLevelWorkouts = async () => {
    try {
      const response = await getAllLevelWorkoutByAdmin();
      if (response.status === 200) {
        levelWorkouts.value = response.data.data;
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      isLoading.value = false;
    }
  };

  // CREATE LEVEL
  const saveLevelWorkout = async () => {
    submitted.value = true;
    if (!newLevelWorkout.value.levelWorkout) {
      toast.error('All fields are required.');
      return;
    }
    try {
      loadingSubmit.value = true;
      const response = await createLevelWorkout(newLevelWorkout.value);
      if (response.status === 200) {
        toast.success('Level workout created successfully');
        hideDialog();
        newLevelWorkout.value = {};
        submitted.value = false;
      }
    } catch (error) {
      console.log(error);
    } finally {
      fetchLevelWorkouts();
      loadingSubmit.value = false;
    }
  };

  // EDIT LEVEL
  const handleEditLevelWorkout = async () => {
    if (!selectedLevelWorkout.value.levelWorkout) {
      toast.error('All fields are required.');
      return;
    }
    const updatedData = selectedLevelWorkout.value;
    const originalData = levelWorkouts.value.find((level) => level.id === updatedData.id);

    if (!checkDataChanged(updatedData, originalData)) {
      toast.error('No changes detected.');
      return;
    }
    const changedFields = getChangedFields(updatedData, originalData);
    try {
      loadingSubmit.value = true;
      const response = await editLevelWorkout(updatedData.id, changedFields);

      if (response.status === 200) {
        toast.success('Level workout updated successfully!');
        hideEditLevelDialog();
      }
    } catch (error) {
      toast.error('Error updating category.');
      console.error(error);
    } finally {
      fetchLevelWorkouts();
      loadingSubmit.value = false;
    }
  };

  // DELTE LEVEL
  const handleDeleteLevelWorkout = async () => {
    try {
      loadingSubmit.value = true;
      const response = await deleteLevelWorkout(selectedLevelWorkout.value.id);
      if (response.status === 200) {
        toast.success('Level workout deleted successfully');
        hideDeleteLevelDialog();
      }
    } catch (error) {
      toast.error('Error deleting category.');
      console.error(error);
    } finally {
      fetchLevelWorkouts();
      loadingSubmit.value = false;
    }
  };
  onMounted(() => {
    fetchLevelWorkouts();
  });
</script>

<template>
  <section>
    <div class="container text-sm">
      <div class="flex justify-between items-start mb-7">
        <h1 class="text-2xl font-bold">Manage Level Workout</h1>
        <CreateButton @openDialog="openLevelDialog" />
      </div>
      <div class="card bg-white p-4 shadow rounded-lg">
        <DataTable
          v-if="isLoading"
          :value="
            Array(3).fill({
              imgUrl: '',
              title: '',
              description: '',
              videoCount: '',
              livestreamCount: '',
              totalViews: '',
            })
          "
          stripedRows
        >
          <Column class="py-6" header="Level Workout">
            <template #body>
              <Skeleton />
            </template>
          </Column>
          <Column header="Video">
            <template #body>
              <Skeleton />
            </template>
          </Column>
          <Column header="Live stream">
            <template #body>
              <Skeleton />
            </template>
          </Column>
          <Column header="Total view">
            <template #body>
              <Skeleton />
            </template>
          </Column>
          <Column style="width: 7rem">
            <template #body>
              <Skeleton />
            </template>
          </Column>
        </DataTable>
        <DataTable v-else :value="levelWorkouts" stripedRows>
          <Column field="levelWorkout" header="Level Workout"></Column>
          <Column field="videoCount" header="Video"></Column>
          <Column field="livestreamCount" header="Live stream"></Column>
          <Column header="Total view">
            <template #body="{ data }">
              {{ data.totalViews ?? 0 }}
            </template></Column
          >

          <Column style="width: 7rem">
            <template #body="{ data }">
              <div class="flex justify-center gap-x-5">
                <button
                  class="hover:bg-[#f1d26a] size-[40px] rounded-full flex justify-center items-center hover:text-white pi pi-pencil"
                  @click="openEditLevelDialog(data)"
                ></button>
                <button
                  class="hover:bg-[#ff9c9c] size-[40px] rounded-full flex justify-center items-center hover:text-white pi pi-trash"
                  @click="openDeleteLevelDialog(data)"
                ></button>
              </div>
            </template>
          </Column>
        </DataTable>
        <!-- CREATE -->
        <Dialog
          v-model:visible="levelDialog"
          :style="{ width: '600px' }"
          header="Add Level Workout"
          :modal="true"
          :draggable="false"
          :dismissableMask="true"
          @keydown.enter.prevent="saveLevelWorkout"
        >
          <div class="flex flex-col gap-6">
            <div>
              <label for="levelWorkout" class="block font-bold mb-3">Level Workout</label>
              <InputText
                id="levelWorkout"
                v-model.trim="newLevelWorkout.levelWorkout"
                required="true"
                autofocus
                :invalid="submitted && !newLevelWorkout.levelWorkout"
                fluid
              />
              <small v-if="submitted && !newLevelWorkout.levelWorkout" class="error_toast"
                >Level Workout is required.</small
              >
            </div>
          </div>
          <template #footer>
            <button class="btn-success" @click="saveLevelWorkout">
              <span v-if="!loadingSubmit">Save</span>
              <SmallLoading v-else />
            </button>
            <button class="btn-cancel" @click="hideDialog">Cancel</button>
          </template>
        </Dialog>
        <!-- EDIT -->
        <Dialog
          v-model:visible="editLevelDialog"
          :style="{ width: '600px' }"
          header="Edit Level Workout"
          :modal="true"
          :draggable="false"
          :dismissableMask="true"
          @keydown.enter.prevent="handleEditLevelWorkout"
        >
          <div class="flex flex-col gap-6">
            <div>
              <label for="levelWorkout" class="block font-bold mb-3">Level Workout</label>
              <InputText
                id="levelWorkout"
                v-model.trim="selectedLevelWorkout.levelWorkout"
                required="true"
                autofocus
                :invalid="submitted && !selectedLevelWorkout.levelWorkout"
                fluid
              />
              <small v-if="submitted && !selectedLevelWorkout.levelWorkout" class="error_toast"
                >Level Workout is required.</small
              >
            </div>
          </div>
          <template #footer>
            <button
              class="btn-success"
              :class="{ 'bg-primary/50 cursor-not-allowed': !selectedLevelWorkout.levelWorkout }"
              @click="handleEditLevelWorkout"
            >
              <span v-if="!loadingSubmit">Save</span>
              <SmallLoading v-else />
            </button>
            <button class="btn-cancel" @click="hideEditLevelDialog">Cancel</button>
          </template>
        </Dialog>
        <!-- DELETE -->
        <Dialog
          v-model:visible="deleteLevelDialog"
          :style="{ width: '600px' }"
          header="Edit Level Workout"
          :modal="true"
          :draggable="false"
          :dismissableMask="true"
          @keydown.enter.prevent="handleDeleteLevelWorkout"
        >
          <p class="text-[11px] md:text-[14px] italic">
            Do you want to remove level workout "
            <span class="font-semibold"> {{ selectedLevelWorkout?.levelWorkout }} </span>" from the
            system?
          </p>
          <template #footer>
            <button
              class="btn-reject"
              :class="{ 'bg-primary/50 cursor-not-allowed': !selectedLevelWorkout.levelWorkout }"
              @click="handleDeleteLevelWorkout"
            >
              <span v-if="!loadingSubmit">Delete</span>
              <SmallLoading fill="#ff647a" v-else />
            </button>
            <button class="btn-cancel" @click="hideDeleteLevelDialog">Cancel</button>
          </template>
        </Dialog>
      </div>
    </div>
  </section>
</template>
