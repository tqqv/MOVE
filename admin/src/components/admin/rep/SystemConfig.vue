<script setup>
  import { onMounted, ref } from 'vue';
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import { toast } from 'vue3-toastify';
  import Skeleton from 'primevue/skeleton';
  import axiosInstance from '@/services/axios';
  import Button from 'primevue/button';
  import { formatDateData } from '@/utils';
  import InputText from 'primevue/inputtext';
  import Dialog from 'primevue/dialog';
  import InputNumber from 'primevue/inputnumber';

  const configs = ref([]);
  const isLoading = ref(true);
  const createConfigDialog = ref(false);
  const editConfigDialog = ref(false);
  const key = ref(null);
  const value = ref(null);
  const currentEditConfig = ref(null);
  const submitted = ref(false);

  const openCreateConfigDialog = () => {
    createConfigDialog.value = true;
  };

  const openEditConfigDialog = (config) => {
    currentEditConfig.value = config;
    key.value = config.key;
    value.value = config.value;
    editConfigDialog.value = true;
  };

  const clearData = () => {
    key.value = null;
    value.value = null;
    submitted.value = false;
    currentEditConfig.value = null;
  };

  const closeModal = () => {
    createConfigDialog.value = false;
    editConfigDialog.value = false;
    clearData();
  };

  const createConfig = async () => {
    submitted.value = true;
    if (!key.value || !value.value) {
      return;
    }
    try {
      const response = await axiosInstance.post('admin/createSystemConfig', {
        key: key.value,
        value: value.value,
      });
      if (response.status === 200) {
        toast.success('Created system config successfully');
        getSystemConfig();
        closeModal();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const editConfig = async () => {
    submitted.value = true;
    if (!value.value) {
      return;
    }
    try {
      const response = await axiosInstance.patch('admin/editSystemConfig', {
        systemConfigId: currentEditConfig.value.id,
        value: value.value,
      });
      if (response.status === 200) {
        toast.success('Updated system config successfully');
        getSystemConfig();
        closeModal();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getSystemConfig = async () => {
    try {
      const response = await axiosInstance.get('admin/getAllSystemConfig');
      configs.value = response.data.data;
    } catch (error) {
      toast.error(error.message);
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    getSystemConfig();
  });
</script>

<template>
  <section>
    <div class="container">
      <div class="flex justify-between items-start mb-7">
        <h1 class="text-2xl font-bold">System Config</h1>
        <Button label="Create" @click="openCreateConfigDialog" class="btn" />
      </div>
      <div class="card bg-white p-4 shadow rounded-lg">
        <DataTable v-if="isLoading" :value="Array(3).fill({})" stripedRows>
          <Column class="py-6" header="ID">
            <template #body><Skeleton /></template>
          </Column>
          <Column header="Key">
            <template #body><Skeleton /></template>
          </Column>
          <Column header="Value">
            <template #body><Skeleton /></template>
          </Column>
          <Column header="Created At">
            <template #body><Skeleton /></template>
          </Column>
          <Column header="Updated At">
            <template #body><Skeleton /></template>
          </Column>
          <Column style="width: 7rem">
            <template #body><Skeleton /></template>
          </Column>
        </DataTable>
        <DataTable v-else :value="configs" stripedRows>
          <Column field="id" header="ID"></Column>
          <Column field="key" header="Key"></Column>
          <Column field="value" header="Value"></Column>
          <Column header="Created At">
            <template #body="{ data }">
              {{ formatDateData(data.createdAt) }}
            </template>
          </Column>
          <Column header="Updated At">
            <template #body="{ data }">
              {{ formatDateData(data.updatedAt) }}
            </template>
          </Column>
          <Column style="width: 7rem">
            <template #body="{ data }">
              <div class="flex justify-center gap-x-5">
                <button
                  class="hover:bg-[#f1d26a] size-[40px] rounded-full flex justify-center items-center hover:text-white pi pi-pencil"
                  @click="openEditConfigDialog(data)"
                ></button>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <!-- CREATE -->
    <Dialog
      v-model:visible="createConfigDialog"
      :style="{ width: '600px' }"
      header="Add Config"
      :modal="true"
      :draggable="false"
      :dismissableMask="true"
    >
      <div class="flex flex-col gap-6">
        <div>
          <label for="key" class="block font-bold mb-3">Key</label>
          <InputText
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
          <label for="value" class="block font-bold mb-3">Value</label>
          <InputNumber
            v-model="value"
            id="value"
            v-model.trim="value"
            :invalid="submitted && !value"
            required
            placeholder="0.5"
            :maxFractionDigits="2"
            fluid
          />
          <small v-if="submitted && !value" class="error_toast">Value is required.</small>
        </div>
      </div>
      <template #footer>
        <button class="btn-success" @click="createConfig">Save</button>
        <button class="btn-cancel" @click="closeModal">Cancel</button>
      </template>
    </Dialog>

    <!-- EDIT -->
    <Dialog
      v-model:visible="editConfigDialog"
      :style="{ width: '600px' }"
      header="Edit Config"
      :modal="true"
      :draggable="false"
      :dismissableMask="true"
    >
      <div class="flex flex-col gap-6">
        <div>
          <label for="edit-key" class="block font-bold mb-3">Key</label>
          <InputText
            v-model="key"
            id="edit-key"
            v-model.trim="key"
            :invalid="submitted && !key"
            required
            disabled
            fluid
          />
          <small v-if="submitted && !key" class="error_toast">Key is required.</small>
        </div>
        <div>
          <label for="edit-value" class="block font-bold mb-3">Value</label>
          <InputNumber
            v-model="value"
            id="edit-value"
            v-model.trim="value"
            :invalid="submitted && !value"
            required
            fluid
            :maxFractionDigits="2"
          />
          <small v-if="submitted && !value" class="error_toast">Value is required.</small>
        </div>
      </div>
      <template #footer>
        <button class="btn-success" @click="editConfig">Save</button>
        <button class="btn-cancel" @click="closeModal">Cancel</button>
      </template>
    </Dialog>
  </section>
</template>
