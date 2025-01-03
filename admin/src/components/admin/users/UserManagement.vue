<script setup>
  import { onMounted, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import Tag from 'primevue/tag';
  import Button from 'primevue/button';
  import { getAllUser } from '@/services/user';
  import Filter from '@/components/Filter.vue';
  import Skeleton from 'primevue/skeleton';
  import { toast } from 'vue3-toastify';
  import { formatDateData, formatNumber } from '@/utils';

  const router = useRouter();
  const currentPage = ref(1);
  const totalPage = ref(0);
  const totalUser = ref(0);
  const users = ref([]);
  const isLoading = ref(true);
  const pageSizeOptions = [
    { id: 1, name: 10, value: 10 },
    { id: 2, name: 20, value: 20 },
    { id: 3, name: 30, value: 30 },
  ];
  const selectedPageSize = ref(pageSizeOptions[0].value);

  const getAllUserAdmin = async () => {
    try {
      const response = await getAllUser(currentPage.value, selectedPageSize.value);
      if (response.status === 200) {
        users.value = response.data.data.data.rows;
        totalPage.value = response.data.data.totalPages;
        totalUser.value = response.data.data.data.count;
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      isLoading.value = false;
    }
  };

  const handleRowClick = (event) => {
    router.push(`users/${event.data.id}`);
  };
  const goToPreviousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
    getAllUserAdmin();
  };
  const goToNextPage = () => {
    if (currentPage.value < totalPage.value) {
      currentPage.value++;
    }
    getAllUserAdmin();
  };
  watch([selectedPageSize], () => {
    currentPage.value = 1;
    getAllUserAdmin();
  });
  onMounted(() => {
    getAllUserAdmin();
  });
</script>

<template>
  <section class="">
    <div class="container text-sm">
      <div class="flex justify-between items-start mb-7">
        <h1 class="text-2xl font-bold">Manage Users</h1>
      </div>
      <div class="card bg-white p-4 shadow rounded-lg">
        <DataTable
          v-if="isLoading"
          :value="
            Array(4).fill({
              referralCode: '',
              role: '',
              email: '',
              REPs: '',
              isBanned: '',
              username: '',
              createdAt: '',
              verified: '',
              verified: '',
            })
          "
          stripedRows
        >
          <Column field="referralCode" header="Code">
            <template #body> <Skeleton /> </template
          ></Column>
          <Column header="Name">
            <template #body>
              <Skeleton />
            </template>
          </Column>
          <Column field="role" header="Role">
            <template #body> <Skeleton /> </template
          ></Column>
          <Column field="email" header="Email">
            <template #body> <Skeleton /> </template
          ></Column>
          <Column field="REPs" header="Balance (REPs)">
            <template #body>
              <Skeleton />
            </template>
          </Column>
          <Column field="isBanned" header="Status" dataType="boolean">
            <template #body>
              <Skeleton />
            </template>
          </Column>
          <Column field="verified" header="Verified" dataType="boolean">
            <template #body>
              <Skeleton />
            </template>
          </Column>
          <Column field="createdAt" header="Created at">
            <template #body>
              <Skeleton />
            </template>
          </Column>
        </DataTable>
        <DataTable
          v-else-if="!isLoading && users"
          :value="users"
          stripedRows
          @row-click="handleRowClick"
        >
          <Column field="referralCode" header="Code"></Column>
          <Column header="Name">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <img :alt="data.avatar" :src="data.avatar" class="size-[40px] rounded-full" />
                <span>{{ data.username }}</span>
              </div>
            </template>
          </Column>
          <Column field="role" header="Role"></Column>
          <Column field="email" header="Email"></Column>
          <Column field="REPs" header="Balance (REPs)">
            <template #body="{ data }">
              {{ formatNumber(data.REPs) }}
            </template>
          </Column>
          <Column field="isBanned" header="Status" dataType="boolean">
            <template #body="{ data }">
              <Tag v-if="data.isBanned" value="Banned" severity="danger" />
              <Tag v-else value="Normal" severity="info" />
            </template>
          </Column>
          <Column field="verified" header="Verified" dataType="boolean">
            <template #body="{ data }">
              <i
                class="pi"
                :class="{
                  'pi-check-circle text-primary ': data.isVerified,
                  'pi-times-circle text-red': !data.isVerified,
                }"
              ></i>
            </template>
          </Column>
          <Column field="createdAt" header="Created at">
            <template #body="{ data }">
              {{ formatDateData(data.createdAt) }}
            </template>
          </Column>
        </DataTable>
        <div class="flex justify-end gap-x-12 items-center px-12 pt-6 mb-[20px]">
          <Filter
            :title="'Rows per page'"
            :options="pageSizeOptions"
            @change="selectedPageSize = $event.value"
          />
          <div>
            <span>
              {{ (currentPage - 1) * selectedPageSize + 1 }}
            </span>
            -
            <span>
              {{ Math.min(currentPage * selectedPageSize, totalUser) }}
            </span>
            <span> of {{ totalUser }} results</span>
          </div>
          <div class="flex gap-x-4 justify-center">
            <i
              @click="goToPreviousPage"
              class="pi pi-chevron-left cursor-pointer text-md hover:text-primary"
              :class="{ 'text-gray-dark hover:text-gray-dark cursor-auto': currentPage === 1 }"
            ></i>
            <i
              @click="goToNextPage"
              class="pi pi-chevron-right cursor-pointer text-md hover:text-primary"
              :class="{
                'text-gray-dark hover:text-gray-dark cursor-auto': currentPage === totalPage,
              }"
            ></i>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="css" scoped>
  ::v-deep(.p-row-even:hover) {
    cursor: pointer;
  }
  ::v-deep(.p-row-odd:hover) {
    cursor: pointer;
  }
</style>
