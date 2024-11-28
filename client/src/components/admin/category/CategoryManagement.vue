<script setup>
  import { ref } from 'vue';
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  import InputText from 'primevue/inputtext';
  import Textarea from 'primevue/textarea';
  import VideoUpload from '@/components/icons/videoUpload.vue';

  const cateDialog = ref(false);

  const openCateDialog = () => {
    cateDialog.value = true;
  };

  const hideDialog = () => {
    cateDialog.value = false;
  };

  const categories = ref([
    {
      id: '1000',
      title: 'MMA',
      description:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit, mauris vestibulum sociosqu pellentesque odio euismod etiam magnis, cursus consequat himenaeos urna ridiculus tristique. Ut vivamus praesent convallis conubia, massa libero pharetra.',
      imgUrl:
        'https://images.pexels.com/photos/6295779/pexels-photo-6295779.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      createAt: '09/11/2024',
      updatedAt: '09/11/2024',
    },
    {
      id: '1000',
      title: 'Boxing',
      description: '0999999999',
      imgUrl:
        'https://images.pexels.com/photos/9944859/pexels-photo-9944859.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      createAt: '09/11/2024',
      updatedAt: '09/11/2024',
    },
    {
      id: '1000',
      title: 'vietzz771@gmail.com',
      description: '0999999999',
      imgUrl:
        'https://images.pexels.com/photos/6203516/pexels-photo-6203516.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      createAt: '09/11/2024',
      updatedAt: '09/11/2024',
    },
    {
      id: '1000',
      title: 'vietzz771@gmail.com',
      description: '0999999999',
      imgUrl:
        'https://images.pexels.com/photos/260352/pexels-photo-260352.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      createAt: '09/11/2024',
      updatedAt: '09/11/2024',
    },
  ]);
</script>

<template>
  <section class="bg-[#FAFAFB]">
    <div class="container">
      <div class="card bg-white p-4 shadow rounded-lg">
        <DataTable :value="categories" stripedRows showGridlines>
          <template #header>
            <div class="flex flex-wrap gap-2 items-center justify-between">
              <h1 class="font-bold text-[20px]">Manage Categories</h1>
              <Button label="New" icon="pi pi-plus" class="mr-2" @click="openCateDialog" />
            </div>
          </template>
          <Column field="id" header="ID"></Column>
          <Column header="Name" style="width: 150px">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <img :alt="data.imgUrl" :src="data.imgUrl" class="w-[200px] rounded" />
              </div>
            </template>
          </Column>
          <Column field="title" header="Title"></Column>
          <Column field="description" header="Description" style="width: 30rem"></Column>
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
          v-model:visible="cateDialog"
          :style="{ width: '600px' }"
          header="Add category"
          :modal="true"
          :draggable="false"
        >
          <div class="flex flex-col gap-6">
            <div
              class="flex items-center justify-center flex-col py-14 border border-primary rounded-xl mt-2"
            >
              <input
                type="file"
                @change="onFileSelected"
                class="opacity-0 w-100 h-[279.6px] absolute"
              />
              <VideoUpload class="cursor-pointer fill-primary" />
              <p class="mt-6 mb-0">Drag and drop your image.</p>
              <span class="capitalize mt-1">or</span>
              <div class="mt-1">
                <p class="btn hover:bg-primary-light leading-none">Select a image</p>
              </div>
            </div>
            <img
              v-if="categories.image"
              :src="`https://primefaces.org/cdn/primevue/images/product/${categories.image}`"
              :alt="categories.image"
              class="block m-auto pb-4"
            />
            <div>
              <label for="name" class="block font-bold mb-3">Name</label>
              <InputText
                id="name"
                v-model.trim="categories.name"
                required="true"
                autofocus
                :invalid="submitted && !categories.name"
                fluid
              />
              <small v-if="submitted && !categories.name" class="text-red-500"
                >Name is required.</small
              >
            </div>
            <div>
              <label for="title" class="block font-bold mb-3">Title</label>
              <InputText
                id="title"
                v-model.trim="categories.title"
                required="true"
                autofocus
                :invalid="submitted && !categories.title"
                fluid
              />
              <small v-if="submitted && !categories.title" class="text-red-500"
                >Title is required.</small
              >
            </div>
            <div>
              <label for="description" class="block font-bold mb-3">Description</label>
              <Textarea
                id="description"
                v-model="categories.description"
                required="true"
                rows="3"
                cols="20"
                fluid
              />
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
