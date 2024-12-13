<script setup>
  import { onMounted, ref } from 'vue';
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  import InputText from 'primevue/inputtext';
  import CreateButton from '@/components/CreateButton.vue';
  import {
    createRepPackage,
    deleteRepPackage,
    editRepPackage,
    getAllRepPackage,
  } from '@/services/repsPackage';
  import { formatDateData } from '@/utils';
  import Skeleton from 'primevue/skeleton';
  import { toast } from 'vue3-toastify';
  import Calculator from '@/components/icons/calculator.vue';
  import SmallLoading from '@/components/icons/smallLoading.vue';
  import { checkDataChanged, getChangedFields } from '@/utils/compareData';
  import NoneDiscount from '@/components/icons/noneDiscount.vue';

  const repsDialog = ref(false);
  const repPackage = ref();
  const isLoading = ref(true);
  const newRepPackage = ref({
    rep: '',
    amount: '',
    discount: '',
  });
  const submitted = ref(false);
  const loadingSubmit = ref(false);
  const editRepDialog = ref(false);
  const selectedRep = ref();
  const deleteRepDialog = ref(false);

  // OPEN CLOSE
  const openRepDialog = () => {
    repsDialog.value = true;
  };

  const hideDialog = () => {
    repsDialog.value = false;
  };

  const openEditRepDialog = (rep) => {
    selectedRep.value = { ...rep, discount: rep.discount * 100 };
    editRepDialog.value = true;
  };
  const hideEditRepDialog = () => {
    editRepDialog.value = false;
  };

  const openDeleteRepDialog = (rep) => {
    selectedRep.value = { ...rep };
    deleteRepDialog.value = true;
  };
  const hideDeleteRepDialog = () => {
    deleteRepDialog.value = false;
  };

  // GET ALL
  const fetchRepsPackage = async () => {
    try {
      const response = await getAllRepPackage();
      if (response.status == 200) {
        repPackage.value = response.data.data;
      }
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  };

  // CREATED
  const handleCreateREP = async () => {
    submitted.value = true;
    if (!newRepPackage.value.rep || !newRepPackage.value.amount) {
      toast.error('All fields are required.');
      return;
    }
    try {
      loadingSubmit.value = true;
      await createRepPackage({
        rep: newRepPackage.value.rep,
        amount: newRepPackage.value.amount,
        discount: newRepPackage.value.discount,
      });
      toast.success('REP created successfully!');
      hideDialog();
      newRepPackage.value = { rep: '', amount: '', discount: '' };
      submitted.value = false;
    } catch (error) {
      console.log(error);
    } finally {
      fetchRepsPackage();
      loadingSubmit.value = false;
    }
  };
  // EDIT
  const handleEditREP = async () => {
    if (!selectedRep.value.rep || !selectedRep.value.amount) {
      toast.error('All fields are required.');
      return;
    }

    const updatedData = selectedRep.value;
    const originalData = repPackage.value.find((rep) => rep.id === updatedData.id);

    if (!checkDataChanged(updatedData, originalData)) {
      toast.error('No changes detected.');
      return;
    }
    const changedFields = getChangedFields(updatedData, originalData);
    try {
      loadingSubmit.value = true;
      await editRepPackage(updatedData.id, changedFields);
      toast.success('Rep updated successfully!');
      hideEditRepDialog();
    } catch (error) {
      toast.error('Error updating category.');
      console.error(error);
    } finally {
      fetchRepsPackage();
      loadingSubmit.value = false;
    }
  };
  // DELETE
  const handleDeleteREP = async () => {
    try {
      loadingSubmit.value = true;
      const response = await deleteRepPackage(selectedRep.value.id);
      console.log(response);

      if (response.status == 200) {
        toast.success('REP item deleted successfully!');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Error deleting Donation item');
      console.error(error);
    } finally {
      hideDeleteRepDialog();
      fetchRepsPackage();
      loadingSubmit.value = false;
    }
  };
  onMounted(() => {
    fetchRepsPackage();
  });
</script>

<template>
  <section>
    <div class="container text-sm">
      <div class="flex justify-between items-start mb-7">
        <h1 class="text-2xl font-bold">REPs Package</h1>
        <CreateButton @openDialog="openRepDialog" />
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
          <Column header="REPs">
            <template #body>
              <Skeleton />
            </template>
          </Column>
          <Column header="Amount (SGD)">
            <template #body>
              <Skeleton />
            </template>
          </Column>
          <Column header="Discount (%)">
            <template #body>
              <Skeleton />
            </template>
          </Column>
          <Column header="Discounted amount (SGD)">
            <template #body>
              <Skeleton />
            </template>
          </Column>
          <Column header="Created at ">
            <template #body>
              <Skeleton />
            </template>
          </Column>
          <Column header="Updated at">
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
        <DataTable v-else :value="repPackage" stripedRows>
          <Column field="rep" header="REPs"></Column>
          <Column field="amount" header="Amount (SGD)"></Column>
          <Column header="Discount (%)">
            <template #body="{ data }">
              <span :class="{ 'text-red font-semibold': data.discount == 0 }">
                <template v-if="data.discount == 0">
                  <NoneDiscount />
                </template>
                <template v-else>
                  {{ (data.discount * 100).toFixed(2) + ' %' }}
                </template>
              </span>
            </template>
          </Column>
          <Column header="Discounted amount (SGD)">
            <template #body="{ data }">
              <span>{{
                data.discount == 0
                  ? data.amount
                  : `${(data.amount - data.amount * data.discount).toFixed(2)} `
              }}</span>
            </template>
          </Column>
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
                  @click="openEditRepDialog(data)"
                ></button>
                <button
                  class="hover:bg-[#ff9c9c] size-[40px] rounded-full flex justify-center items-center hover:text-white pi pi-trash"
                  @click="openDeleteRepDialog(data)"
                ></button>
              </div>
            </template>
          </Column>
        </DataTable>
        <!-- CREATE -->
        <Dialog
          v-model:visible="repsDialog"
          :style="{ width: '500px' }"
          header="Create new REP"
          :modal="true"
          :draggable="false"
          :dismissableMask="true"
          @keydown.enter.prevent="handleCreateREP"
        >
          <div class="flex flex-col gap-6 text-sm">
            <div>
              <label class="block font-bold mb-3">REPs</label>
              <InputText
                v-model.trim="newRepPackage.rep"
                required="true"
                autofocus
                :invalid="submitted && !newRepPackage.rep"
                fluid
                @input="
                  newRepPackage.rep = newRepPackage.rep
                    .replace(/[^0-9.]/g, '')
                    .replace(/(\..*)\./g, '$1')
                "
              />
              <small v-if="submitted && !newRepPackage.rep" class="test_error"
                >Level Workout is required.</small
              >
            </div>
            <div>
              <label class="block font-bold mb-3">Amount (SGD)</label>
              <InputText
                v-model.trim="newRepPackage.amount"
                required="true"
                autofocus
                :invalid="submitted && !newRepPackage.amount"
                fluid
                @input="
                  newRepPackage.amount = newRepPackage.amount
                    .replace(/[^0-9.]/g, '')
                    .replace(/(\..*)\./g, '$1')
                "
              />
              <small v-if="submitted && !newRepPackage.amount" class="error_toast"
                >Level Workout is required.</small
              >
            </div>
            <div class="flex gap-x-2">
              <div class="w-1/2">
                <label class="block font-bold mb-3">Discount (%)</label>
                <InputText
                  v-model.trim="newRepPackage.discount"
                  autofocus
                  :invalid="
                    submitted &&
                    newRepPackage.discount !== '' &&
                    (newRepPackage.discount < 0 || newRepPackage.discount > 100)
                  "
                  fluid
                  @input="
                    if (newRepPackage.discount < 0) newRepPackage.discount = 1;
                    if (newRepPackage.discount > 100) newRepPackage.discount = 100;
                    newRepPackage.discount = newRepPackage.discount
                      .replace(/[^0-9.]/g, '')
                      .replace(/(\..*)\./g, '$1');
                  "
                />
                <small
                  v-if="
                    submitted &&
                    newRepPackage.discount &&
                    (newRepPackage.discount < 0 || newRepPackage.discount > 100)
                  "
                  class="error_toast"
                >
                  Discount must be between 1 and 100.
                </small>
              </div>
              <div class="w-1/2">
                <label class="block font-bold mb-3">Discounted amount (SGD)</label>
                <div class="flex justify-between p-2 rounded-lg border border-gray-dark">
                  <span>
                    {{
                      (
                        newRepPackage.amount -
                        newRepPackage.amount * (newRepPackage.discount / 100)
                      ).toFixed(2)
                    }}
                  </span>
                  <Calculator />
                </div>
              </div>
            </div>
          </div>
          <template #footer>
            <button class="btn-success" @click="handleCreateREP">
              <span v-if="!loadingSubmit">Save</span>
              <SmallLoading v-else />
            </button>
            <button class="btn-cancel" @click="hideDialog">Cancel</button>
          </template>
        </Dialog>
        <!-- EDIT -->
        <Dialog
          v-model:visible="editRepDialog"
          :style="{ width: '500px' }"
          :header="`Edit ${selectedRep?.rep}`"
          :modal="true"
          :draggable="false"
          :dismissableMask="true"
          @keydown.enter.prevent="handleEditREP"
        >
          <div class="flex flex-col gap-6 text-sm">
            <div>
              <label class="block font-bold mb-3">REPs</label>
              <InputText
                v-model.trim="selectedRep.rep"
                required="true"
                autofocus
                :invalid="submitted && !selectedRep.rep"
                fluid
                @input="
                  selectedRep.rep = selectedRep.rep
                    .replace(/[^0-9.]/g, '')
                    .replace(/(\..*)\./g, '$1')
                "
              />
              <small v-if="submitted && !selectedRep.rep" class="test_error"
                >Level Workout is required.</small
              >
            </div>
            <div>
              <label class="block font-bold mb-3">Amount (SGD)</label>
              <InputText
                v-model.trim="selectedRep.amount"
                required="true"
                autofocus
                :invalid="submitted && !selectedRep.amount"
                fluid
                @input="
                  selectedRep.amount = selectedRep.amount
                    .replace(/[^0-9.]/g, '')
                    .replace(/(\..*)\./g, '$1')
                "
              />
              <small v-if="submitted && !selectedRep.amount" class="error_toast"
                >Level Workout is required.</small
              >
            </div>
            <div class="flex gap-x-2">
              <div class="w-1/2">
                <label class="block font-bold mb-3">Discount (%)</label>
                <InputText
                  v-model.trim="selectedRep.discount"
                  autofocus
                  :invalid="
                    submitted &&
                    selectedRep.discount !== '' &&
                    (selectedRep.discount < 0 || selectedRep.discount > 100)
                  "
                  fluid
                  @input="
                    if (selectedRep.discount < 0) selectedRep.discount = 1;
                    if (selectedRep.discount > 100) selectedRep.discount = 100;
                    selectedRep.discount = selectedRep.discount
                      .replace(/[^0-9.]/g, '')
                      .replace(/(\..*)\./g, '$1');
                  "
                />
                <small
                  v-if="
                    submitted &&
                    selectedRep.discount &&
                    (selectedRep.discount < 0 || selectedRep.discount > 100)
                  "
                  class="error_toast"
                >
                  Discount must be between 1 and 100.
                </small>
              </div>
              <div class="w-1/2">
                <label class="block font-bold mb-3">Discounted amount (SGD)</label>
                <div class="flex justify-between p-2 rounded-lg border border-gray-dark">
                  <span>
                    {{
                      (
                        selectedRep.amount -
                        selectedRep.amount * (selectedRep.discount / 100)
                      ).toFixed(2)
                    }}
                  </span>
                  <Calculator />
                </div>
              </div>
            </div>
          </div>
          <template #footer>
            <button class="btn-success" @click="handleEditREP">
              <span v-if="!loadingSubmit">Save</span>
              <SmallLoading v-else />
            </button>
            <button class="btn-cancel" @click="hideEditRepDialog">Cancel</button>
          </template>
        </Dialog>

        <!-- DELETE -->
        <Dialog
          v-model:visible="deleteRepDialog"
          :style="{ width: '500px' }"
          :header="`Delete ${selectedRep?.rep}`"
          :modal="true"
          :draggable="false"
          :dismissableMask="true"
          @keydown.enter.prevent="handleDeleteREP"
        >
          <p class="text-[11px] md:text-[14px] italic">
            Do you want to remove REP item "
            <span class="font-semibold"> {{ selectedRep?.rep }} </span>" from the system?
          </p>
          <template #footer>
            <button class="btn-reject" @click="handleDeleteREP">
              <span v-if="!loadingSubmit">Delete</span>
              <SmallLoading fill="#ff647a" v-else />
            </button>
            <button class="btn-cancel" @click="hideDeleteRepDialog">Cancel</button>
          </template>
        </Dialog>
      </div>
    </div>
  </section>
</template>
