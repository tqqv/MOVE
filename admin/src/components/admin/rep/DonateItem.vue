<script setup>
  import { onMounted, ref } from 'vue';
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  import InputText from 'primevue/inputtext';
  import VideoUpload from '@/components/icons/videoUpload.vue';
  import CreateButton from '@/components/CreateButton.vue';
  import {
    createDonationItem,
    deleteDonationItem,
    editDonationItem,
    getAllDonationItems,
  } from '@/services/donate';
  import { formatDateData } from '@/utils';
  import Skeleton from 'primevue/skeleton';
  import { toast } from 'vue3-toastify';
  import { uploadAvatar } from '@/services/cloudinary';
  import SmallLoading from '@/components/icons/smallLoading.vue';
  import { checkDataChanged, getChangedFields } from '@/utils/compareData';

  const donationDialog = ref(false);
  const donateItems = ref([]);
  const isLoading = ref(true);
  const submitted = ref(false);
  const newDonateItem = ref({
    name: '',
    REPs: '',
    image: '',
  });
  const selectedDonateItem = ref();
  const isLoadingAvatar = ref(false);
  const loadingSubmit = ref(false);
  const editDonateItemDialog = ref(false);
  const deleteDonateItemDialog = ref(false);

  // OPEN CLOSE
  const openCateDialog = () => {
    donationDialog.value = true;
  };

  const hideDialog = () => {
    donationDialog.value = false;
  };
  const openEditDonateItemDialog = (donateItem) => {
    selectedDonateItem.value = { ...donateItem };
    editDonateItemDialog.value = true;
  };

  const hideEditDonateItemDialog = () => {
    editDonateItemDialog.value = false;
  };

  const openDeleteDonateItemDialog = (donateItem) => {
    selectedDonateItem.value = { ...donateItem };
    deleteDonateItemDialog.value = true;
  };

  const hideDeleteDonateItemDialog = () => {
    deleteDonateItemDialog.value = false;
  };

  // CHOOSE IMAGE
  const fileInputRef = ref(null);

  const onFileSelected = () => {
    fileInputRef.value?.click();
  };

  const handleCreateFileSelected = async (e) => {
    const selectedFile = e.target.files[0];
    isLoadingAvatar.value = true;

    try {
      const data = await uploadAvatar(selectedFile);
      if (data.secure_url) {
        newDonateItem.value.image = data.secure_url;
      }
    } catch (error) {
      toast.error('Error uploading image');
    } finally {
      isLoadingAvatar.value = false;
    }
  };

  const handleEditFileSelected = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    isLoadingAvatar.value = true;
    try {
      const data = await uploadAvatar(selectedFile);
      if (data.secure_url) {
        // selectedCategory.value.imgUrl = data.secure_url;
      }
    } catch (error) {
      toast.error('Error uploading image');
    } finally {
      isLoadingAvatar.value = false;
    }
  };

  // FETCH ALL
  const fetchDonationItem = async () => {
    try {
      const response = await getAllDonationItems();
      if (response.status == 200) {
        donateItems.value = response.data.data;
      }
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  };

  // CREATE
  const handleCreateDonationItem = async () => {
    submitted.value = true;
    if (!newDonateItem.value.name || !newDonateItem.value.REPs || !newDonateItem.value.image) {
      toast.error('All fields are required.');
      return;
    }
    try {
      loadingSubmit.value = true;
      const response = await createDonationItem({
        name: newDonateItem.value.name,
        REPs: newDonateItem.value.REPs,
        image: newDonateItem.value.image,
      });
      toast.success('Category created successfully!');
      hideDialog();
      newDonateItem.value = { name: '', REPs: '', image: '' };
      submitted.value = false;
    } catch (error) {
      console.log(error);
    } finally {
      fetchDonationItem();
      loadingSubmit.value = false;
    }
  };

  // EDIT
  const handleEditDonationItem = async () => {
    if (
      !selectedDonateItem.value.name ||
      !selectedDonateItem.value.REPs ||
      !selectedDonateItem.value.image
    ) {
      toast.error('All fields are required.');
      return;
    }

    const updatedData = selectedDonateItem.value;
    const originalData = donateItems.value.find(
      (donationItem) => donationItem.id === updatedData.id,
    );

    if (!checkDataChanged(updatedData, originalData)) {
      toast.error('No changes detected.');
      return;
    }
    const changedFields = getChangedFields(updatedData, originalData);
    try {
      loadingSubmit.value = true;
      await editDonationItem(updatedData.id, changedFields);
      toast.success('Donation item updated successfully!');
      hideEditDonateItemDialog();
    } catch (error) {
      toast.error('Error updating category.');
      console.error(error);
    } finally {
      fetchDonationItem();
      loadingSubmit.value = false;
    }
  };

  // DELETE
  const handleDeleteDonationItem = async () => {
    try {
      loadingSubmit.value = true;
      const response = await deleteDonationItem(selectedDonateItem.value.id);
      toast.success('Donation item deleted successfully!');
      hideDeleteDonateItemDialog();
    } catch (error) {
      toast.error('Error deleting Donation item');
      console.error(error);
    } finally {
      fetchDonationItem();
      loadingSubmit.value = false;
    }
  };

  onMounted(() => {
    fetchDonationItem();
  });
</script>

<template>
  <section>
    <div class="container text-sm">
      <div class="flex justify-between items-start mb-7">
        <h1 class="text-2xl font-bold">Manage Donate</h1>
        <CreateButton @openDialog="openCateDialog" />
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
          <Column header="Image">
            <template #body>
              <Skeleton />
            </template>
          </Column>
          <Column header="REP$">
            <template #body>
              <Skeleton />
            </template>
          </Column>
          <Column header="Create at">
            <template #body>
              <Skeleton />
            </template>
          </Column>
          <Column header="Update at">
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
        <DataTable v-else :value="donateItems" stripedRows>
          <Column header="Image" style="width: 150px">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <img :alt="data.image" :src="data.image" class="rounded" />
              </div>
            </template>
          </Column>
          <Column field="name" header="Name"></Column>

          <Column field="REPs" header="REP$"></Column>
          <Column field="createdAt" header="Create at">
            <template #body="{ data }">
              <span>{{ formatDateData(data.createdAt) }}</span>
            </template>
          </Column>
          <Column header="Updated at">
            <template #body="{ data }">
              <span>{{ formatDateData(data.updatedAt) }}</span>
            </template></Column
          >
          <Column style="width: 7rem">
            <template #body="{ data }">
              <div class="flex justify-center gap-x-5">
                <button
                  class="hover:bg-[#f1d26a] size-[40px] rounded-full flex justify-center items-center hover:text-white pi pi-pencil"
                  @click="openEditDonateItemDialog(data)"
                ></button>
                <button
                  class="hover:bg-[#ff9c9c] size-[40px] rounded-full flex justify-center items-center hover:text-white pi pi-trash"
                  @click="openDeleteDonateItemDialog(data)"
                ></button>
              </div>
            </template>
          </Column>
        </DataTable>
        <!-- CREATE -->
        <Dialog
          v-model:visible="donationDialog"
          :style="{ width: '500px' }"
          header="Add donate item"
          :modal="true"
          :draggable="false"
          :dismissableMask="true"
          @keydown.enter.prevent="handleCreateDonationItem"
        >
          <div class="flex flex-col gap-6 text-sm">
            <div class="relative">
              <div class="flex justify-between">
                <label for="title" class="block font-medium">Image</label>
              </div>
              <div
                v-if="!newDonateItem.image"
                class="flex items-center justify-center flex-col py-14 border border-primary rounded-xl my-2 cursor-pointer"
                :class="{ 'opacity-20': isLoadingAvatar }"
                @click="onFileSelected"
              >
                <input
                  type="file"
                  accept="image/*"
                  ref="fileInputRef"
                  @change="handleCreateFileSelected"
                  class="hidden"
                />
                <VideoUpload class="cursor-pointer fill-primary" />
                <p class="mt-6 mb-0">Drag and drop your image.</p>
                <span class="capitalize mt-1">or</span>
                <div class="mt-1">
                  <p class="btn hover:bg-primary-light leading-none">Select a image</p>
                </div>
              </div>
              <SmallLoading
                v-if="isLoadingAvatar"
                class="absolute inset-0 m-auto flex items-center justify-center !opacity-100"
                width="38"
                height="38"
              />
              <small v-if="submitted && !newDonateItem.imgUrl" class="error_toast"
                >Image is required.</small
              >
            </div>
            <img
              v-if="newDonateItem.image"
              :src="newDonateItem.image"
              :alt="newDonateItem.image"
              class="block m-auto pb-4"
            />
            <div>
              <label for="name" class="block mb-3 font-medium">Name</label>
              <InputText
                id="name"
                v-model.trim="newDonateItem.name"
                required="true"
                autofocus
                :invalid="submitted && !newDonateItem.name"
                fluid
              />
              <small v-if="submitted && !newDonateItem.name" class="error_toast"
                >Name is required.</small
              >
            </div>
            <div>
              <label for="REPs" class="block mb-3 font-medium"
                >REPs <span class="font-normal">(enter number)</span></label
              >
              <InputText
                id="REPs"
                v-model.trim="newDonateItem.REPs"
                required="true"
                autofocus
                :invalid="submitted && !newDonateItem.REPs"
                fluid
                @input="newDonateItem.REPs = newDonateItem.REPs.replace(/[^0-9]/g, '')"
              />
              <small v-if="submitted && !newDonateItem.REPs" class="error_toast">
                REPs is required and must be a number.</small
              >
            </div>
          </div>
          <template #footer>
            <button class="btn-success" @click="handleCreateDonationItem">
              <span v-if="!loadingSubmit">Save</span>
              <SmallLoading v-else />
            </button>
            <button class="btn-cancel" @click="hideDialog">Cancel</button>
          </template>
        </Dialog>
        <!-- EDIT -->
        <Dialog
          v-model:visible="editDonateItemDialog"
          :style="{ width: '400px' }"
          header="Add donate item"
          :modal="true"
          :draggable="false"
          :dismissableMask="true"
          @keydown.enter.prevent="handleEditDonationItem"
        >
          <div class="flex flex-col gap-6 text-sm">
            <div class="relative">
              <div class="flex justify-between">
                <label for="title" class="block font-medium">Image</label>
                <div
                  class="flex text-sm text-primary underline cursor-pointer relative items-center justify-center"
                >
                  <input
                    type="file"
                    id="myFile"
                    name="filename"
                    ref="fileInputRef"
                    class="hidden"
                    @change="handleEditFileSelected"
                    accept="image/*"
                  />

                  <span
                    class="text-primary cursor-pointer text-[14px] w-fit"
                    @click="onFileSelected"
                  >
                    Choose image
                  </span>
                </div>
              </div>

              <SmallLoading
                v-if="isLoadingAvatar"
                class="absolute inset-0 m-auto flex items-center justify-center !opacity-100"
                width="38"
                height="38"
              />
              <small v-if="submitted && !selectedDonateItem.imgUrl" class="error_toast"
                >Image is required.</small
              >
              <div class="flex relative w-fit mt-4">
                <img
                  :src="selectedDonateItem.image"
                  :alt="selectedDonateItem.image"
                  class="block object-cover rounded-md mb-4 inset-0"
                  :class="{ 'opacity-20': isLoadingAvatar }"
                />
                <SmallLoading
                  v-if="isLoadingAvatar"
                  class="absolute inset-0 m-auto flex items-center justify-center"
                  width="32"
                  height="32"
                />
              </div>
            </div>

            <div>
              <label for="name" class="block mb-3 font-medium">Name</label>
              <InputText
                id="name"
                v-model.trim="selectedDonateItem.name"
                required="true"
                :invalid="submitted && !selectedDonateItem.name"
                fluid
              />
              <small v-if="submitted && !selectedDonateItem.name" class="error_toast"
                >Name is required.</small
              >
            </div>
            <div>
              <label for="REPs" class="block mb-3 font-medium"
                >REPs <span class="font-normal">(enter number)</span></label
              >
              <InputText
                id="REPs"
                v-model.trim="selectedDonateItem.REPs"
                required="true"
                autofocus
                :invalid="submitted && !selectedDonateItem.REPs"
                fluid
                @input="selectedDonateItem.REPs = selectedDonateItem.REPs.replace(/[^0-9]/g, '')"
              />
              <small v-if="submitted && !selectedDonateItem.REPs" class="error_toast">
                REPs is required and must be a number.</small
              >
            </div>
          </div>
          <template #footer>
            <button class="btn-success" @click="handleEditDonationItem">
              <span v-if="!loadingSubmit">Save</span>
              <SmallLoading v-else />
            </button>
            <button class="btn-cancel" @click="hideEditDonateItemDialog">Cancel</button>
          </template>
        </Dialog>
        <!-- DELETE -->
        <Dialog
          v-model:visible="deleteDonateItemDialog"
          :style="{ width: '400px' }"
          header="Add donate item"
          :modal="true"
          :draggable="false"
          :dismissableMask="true"
          @keydown.enter.prevent="handleDeleteDonationItem"
        >
          <p class="text-[11px] md:text-[14px] italic">
            Do you want to remove donation item "
            <span class="font-semibold"> {{ selectedDonateItem?.name }} </span>" from the system?
          </p>
          <template #footer>
            <button class="btn-reject" @click="handleDeleteDonationItem">
              <span v-if="!loadingSubmit">Delete</span>
              <SmallLoading fill="#ff647a" v-else />
            </button>
            <button class="btn-cancel" @click="hideDeleteDonateItemDialog">Cancel</button>
          </template>
        </Dialog>
      </div>
    </div>
  </section>
</template>
