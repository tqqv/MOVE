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

  const donateItems = ref([
    {
      id: '1000',
      name: 'REPs100',
      REPs: '100',
      image:
        'https://res.cloudinary.com/dg9imqwrd/image/upload/v1731314340/o4irgqyrp5qurh9t2zfz.png',
      createAt: '09/11/2024',
      updatedAt: '09/11/2024',
    },
    {
      id: '1000',
      name: 'REPs1000',
      REPs: '1000',
      image:
        'https://res.cloudinary.com/dg9imqwrd/image/upload/v1731315311/n0y44q33sghqyb408s7d.png',
      createAt: '09/11/2024',
      updatedAt: '09/11/2024',
    },
    {
      id: '1000',
      name: 'REPs5000',
      REPs: '5000',
      image:
        'https://res.cloudinary.com/dg9imqwrd/image/upload/v1731315443/tmd6ussn8uj4bte2nc4a.png',
      createAt: '09/11/2024',
      updatedAt: '09/11/2024',
    },
    {
      id: '1000',
      name: 'REPs10000',
      REPs: '10000',
      image:
        'https://res.cloudinary.com/dg9imqwrd/image/upload/v1731315480/zpi358uajzgqecqc2y0k.png',
      createAt: '09/11/2024',
      updatedAt: '09/11/2024',
    },
    {
      id: '1000',
      name: 'REPs25000',
      REPs: '25000',
      image:
        'https://res.cloudinary.com/dg9imqwrd/image/upload/v1731315480/zpi358uajzgqecqc2y0k.png',
      createAt: '09/11/2024',
      updatedAt: '09/11/2024',
    },
  ]);
</script>

<template>
  <div>
    <DataTable :value="donateItems" stripedRows showGridlines>
      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <h1 class="font-bold text-[20px]">Manage Donate</h1>
          <Button label="New" icon="pi pi-plus" class="mr-2" @click="openCateDialog" />
        </div>
      </template>
      <Column field="id" header="ID"></Column>
      <Column header="Name" style="width: 150px">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <img :alt="data.image" :src="data.image" class="rounded" />
            <p>{{ data.name }}</p>
          </div>
        </template>
      </Column>
      <Column field="REPs" header="REP$"></Column>
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
      header="Add donate item"
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
          v-if="donateItems.image"
          :src="`https://primefaces.org/cdn/primevue/images/product/${donateItems.image}`"
          :alt="donateItems.image"
          class="block m-auto pb-4"
        />
        <div>
          <label for="name" class="block font-bold mb-3">Name</label>
          <InputText
            id="name"
            v-model.trim="donateItems.name"
            required="true"
            autofocus
            :invalid="submitted && !donateItems.name"
            fluid
          />
          <small v-if="submitted && !donateItems.name" class="text-red-500"
            >Name is required.</small
          >
        </div>
        <div>
          <label for="REPs" class="block font-bold mb-3">REPs</label>
          <InputText
            id="REPs"
            v-model.trim="donateItems.REPs"
            required="true"
            autofocus
            :invalid="submitted && !donateItems.REPs"
            fluid
          />
          <small v-if="submitted && !donateItems.REPs" class="text-red-500"
            >Title is required.</small
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
</template>
