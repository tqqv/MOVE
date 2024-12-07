<script setup>
  import { onMounted, ref } from 'vue';
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  import InputText from 'primevue/inputtext';
  import Textarea from 'primevue/textarea';
  import { toast } from 'vue3-toastify';
  import VideoUpload from '@/components/icons/videoUpload.vue';
  import {
    createCategory,
    editCategory,
    getAllCategories,
    getAllCategoriesWithFollower,
    getAllFollowCategories,
  } from '@/services/categories';
  import { formatDateData } from '@/utils';
  import CreateButton from '@/components/CreateButton.vue';
  import { uploadAvatar } from '@/services/cloudinary';
  import SmallLoading from '@/components/icons/smallLoading.vue';
  import { checkDataChanged, getChangedFields } from '@/utils/compareData';

  const cateDialog = ref(false);
  const categories = ref([]);
  const editCateDialog = ref(false);
  const selectedCategory = ref();
  const isLoadingAvatar = ref(false);

  const newCategory = ref({
    title: '',
    description: '',
    imgUrl: '',
  });
  const loadingSubmit = ref(false);
  const submitted = ref(false);
  // HANDLE OPEN CLOSE
  const openCateDialog = () => {
    cateDialog.value = true;
  };

  const hideDialog = () => {
    cateDialog.value = false;
  };

  const openEditCateDialog = (category) => {
    selectedCategory.value = { ...category };
    editCateDialog.value = true;
  };
  const hideEditDialog = () => {
    editCateDialog.value = false;
  };

  // FETCH ALL CATEGORIES
  const fetchCategories = async () => {
    try {
      const response = await getAllCategoriesWithFollower();
      if (response.status === 200) {
        categories.value = response.data.data;
      }
    } catch (error) {
      toast.error(error.message);
    }
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
        newCategory.value.imgUrl = data.secure_url;
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
        selectedCategory.value.imgUrl = data.secure_url;
      }
    } catch (error) {
      toast.error('Error uploading image');
    } finally {
      isLoadingAvatar.value = false;
    }
  };

  // HANDLE CREATE NEW CATE
  const saveProduct = async () => {
    submitted.value = true;
    if (!newCategory.value.title || !newCategory.value.description || !newCategory.value.imgUrl) {
      toast.error('All fields are required.');
      return;
    }
    try {
      loadingSubmit.value = true;
      const response = await createCategory({
        title: newCategory.value.title,
        description: newCategory.value.description,
        imgUrl: newCategory.value.imgUrl,
      });

      if (response.status === 200) {
        toast.success('Category created successfully!');
        hideDialog();
        newCategory.value = { title: '', description: '', imgUrl: '' };
        submitted.value = false;
      }
    } catch (error) {
      console.log(error);
    } finally {
      loadingSubmit.value = false;
    }
  };
  // HANDLE EDIT CATE
  const handleEditCate = async () => {
    if (!selectedCategory.value) return;

    const updatedData = selectedCategory.value;
    const originalData = categories.value.find((cate) => cate.id === updatedData.id);

    if (!checkDataChanged(updatedData, originalData)) {
      toast.error('No changes detected.');
      return;
    }

    const changedFields = getChangedFields(updatedData, originalData);
    console.log(updatedData);

    try {
      loadingSubmit.value = true;
      const response = await editCategory(updatedData.id, changedFields);

      if (response.status === 200) {
        toast.success('Category updated successfully!');
        fetchCategories();
        hideEditDialog();
      }
    } catch (error) {
      toast.error('Error updating category.');
      console.error(error);
    } finally {
      loadingSubmit.value = false;
    }
  };

  // HANDLE DELETE CATE
  const handleDeleteCate = async () => {};

  onMounted(() => {
    fetchCategories();
  });
</script>

<template>
  <section>
    <div class="container text-sm">
      <div class="flex justify-between items-start mb-7">
        <h1 class="text-2xl font-bold">Manage Categories</h1>
        <CreateButton @openDialog="openCateDialog" />
      </div>
      <div class="card bg-white p-4 shadow rounded-lg">
        <DataTable :value="categories" stripedRows>
          <Column header="Image" style="width: 150px">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <img :alt="data.imgUrl" :src="data.imgUrl" class="w-[200px] rounded" />
              </div>
            </template>
          </Column>
          <Column field="title" header="Title"></Column>
          <Column field="description" header="Description" style="width: 20rem"></Column>
          <Column field="totalViews" header="Total view"></Column>

          <Column header="Created at">
            <template #body="{ data }">
              {{ formatDateData(data.createdAt) }}
            </template>
          </Column>
          <Column header="Updated at">
            <template #body="{ data }">
              {{ formatDateData(data.updatedAt) }}
            </template>
          </Column>
          <Column style="width: 7rem">
            <template #body="{ data }">
              <div class="flex justify-start gap-x-5">
                <button
                  @click="openEditCateDialog(data)"
                  class="hover:bg-yellow-dark size-[40px] rounded-full flex justify-center items-center hover:text-white pi pi-pencil"
                ></button>
                <!-- DELETE -->
                <button
                  @click="openDeleteCate(data)"
                  class="hover:bg-red size-[40px] rounded-full flex justify-center items-center hover:text-white pi pi-trash"
                ></button>
              </div>
            </template>
          </Column>
        </DataTable>
        <!-- CREATE -->
        <Dialog
          v-model:visible="cateDialog"
          :style="{ width: '600px' }"
          header="Add category"
          :modal="true"
          :draggable="false"
          :dismissableMask="true"
        >
          <div class="flex flex-col gap-6">
            <div class="relative">
              <div class="flex justify-between">
                <label for="title" class="block font-semibold">Image</label>
              </div>
              <div
                v-if="!newCategory.imgUrl"
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
                width="42"
                height="42"
              />
              <small v-if="submitted && !newCategory.imgUrl" class="error_toast"
                >Image is required.</small
              >
            </div>
            <img
              v-if="newCategory.imgUrl"
              :src="newCategory.imgUrl"
              :alt="newCategory.imgUrl"
              class="block m-auto rounded-md"
            />

            <div>
              <label for="title" class="block font-semibold mb-2">Title</label>
              <InputText
                id="title"
                v-model.trim="newCategory.title"
                required="true"
                autofocus
                :invalid="submitted && !newCategory.title"
                fluid
              />
              <small v-if="submitted && !newCategory.title" class="error_toast"
                >Title is required.</small
              >
            </div>
            <div>
              <label for="description" class="block font-semibold mb-2">Description</label>
              <Textarea
                id="description"
                v-model="newCategory.description"
                required="true"
                rows="3"
                cols="20"
                fluid
              />
            </div>
          </div>
          <template #footer>
            <button class="btn-success" @click="saveProduct">
              <span v-if="!loadingSubmit">Save</span>
              <SmallLoading v-else />
            </button>
            <button class="btn-cancel" @click="hideDialog">Cancel</button>
          </template>
        </Dialog>
        <!-- EDIT -->
        <Dialog
          v-model:visible="editCateDialog"
          :style="{ width: '600px' }"
          header="Edit category"
          :modal="true"
          :draggable="false"
          :dismissableMask="true"
        >
          <div class="flex flex-col gap-6">
            <div class="flex flex-col">
              <div class="flex justify-between mt-3">
                <label for="name" class="block font-semibold mb-2">Image</label>
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
              <div class="flex relative w-fit">
                <img
                  :src="selectedCategory.imgUrl"
                  :alt="selectedCategory.imgUrl"
                  class="block w-48 h-64 object-cover rounded-md mb-4 inset-0"
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
              <label for="title" class="block font-semibold mb-2">Title</label>
              <InputText
                id="title"
                v-model.trim="selectedCategory.title"
                required="true"
                :invalid="submitted && !selectedCategory.title"
                fluid
              />
              <small v-if="submitted && !selectedCategory.title" class="text-red-500"
                >Title is required.</small
              >
            </div>
            <div>
              <label for="description" class="block font-semibold mb-2">Description</label>
              <Textarea
                id="description"
                v-model="selectedCategory.description"
                required="true"
                rows="3"
                cols="20"
                fluid
              />
            </div>
          </div>
          <template #footer>
            <button class="btn-success" @click="handleEditCate">Edit</button>
            <button class="btn-cancel" @click="hideEditDialog">Cancel</button>
          </template>
        </Dialog>
      </div>
    </div>
  </section>
</template>
