<script setup>
  import { onMounted, ref } from 'vue';
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  import InputText from 'primevue/inputtext';
  import CreateButton from '@/components/CreateButton.vue';
  import { getAllRepPackage } from '@/services/repsPackage';
  import { formatDateData } from '@/utils';
  import Skeleton from 'primevue/skeleton';

  const repsDialog = ref(false);
  const repPackage = ref();
  const isLoading = ref(true);
  const newRepPackage = ref({
    rep: '',
    amount: '',
    discount: '',
  });
  const submitted = ref(false);
  // OPEN CLOSE
  const openRepDialog = () => {
    repsDialog.value = true;
  };

  const hideDialog = () => {
    repsDialog.value = false;
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
  const handleCreateREP = async () => {};
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
              <span :class="{ 'text-red font-semibold': data.discount == 0 }">{{
                data.discount == 0 ? 'None' : `${(data.discount * 100).toFixed(2)} %`
              }}</span>
            </template>
          </Column>
          <Column header="Discounted amount (SGD)">
            <template #body="{ data }">
              <span :class="{ 'text-red font-semibold': data.discount == 0 }">{{
                data.discount == 0
                  ? 'None'
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
                ></button>
                <button
                  class="hover:bg-[#ff9c9c] size-[40px] rounded-full flex justify-center items-center hover:text-white pi pi-trash"
                ></button>
              </div>
            </template>
          </Column>
        </DataTable>
        <Dialog
          v-model:visible="repsDialog"
          :style="{ width: '500px' }"
          header="Create new REP"
          :modal="true"
          :draggable="false"
          :dismissableMask="true"
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
              <small v-if="submitted && !newRepPackage.rep" class="text-red-500"
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
              <small v-if="submitted && !newRepPackage.amount" class="text-red-500"
                >Level Workout is required.</small
              >
            </div>
            <div class="flex gap-x-2">
              <div class="w-1/2">
                <label class="block font-bold mb-3">Discount (%)</label>
                <InputText
                  v-model.trim="newRepPackage.discount"
                  required="true"
                  autofocus
                  :invalid="submitted && !newRepPackage.discount"
                  fluid
                  @input="
                    newRepPackage.discount = newRepPackage.discount
                      .replace(/[^0-9.]/g, '')
                      .replace(/(\..*)\./g, '$1')
                  "
                />
                <small v-if="submitted && !newRepPackage.discount" class="text-red-500"
                  >Level Workout is required.</small
                >
              </div>
              <div class="w-1/2">
                <label class="block font-bold mb-3">Discounted amount (SGD)</label>
                <InputText
                  :value="
                    (
                      newRepPackage.amount -
                      newRepPackage.amount * (newRepPackage.discount / 100)
                    ).toFixed(2)
                  "
                  required="true"
                  autofocus
                  :disabled="true"
                  :invalid="submitted && !newRepPackage.discount"
                  fluid
                />
                <small v-if="submitted && !newRepPackage.discount" class="text-red-500"
                  >Level Workout is required.</small
                >
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
      </div>
    </div>
  </section>
</template>
