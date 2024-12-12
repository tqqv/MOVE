<script setup>
  import { ref, onMounted, watch } from 'vue';
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import Tag from 'primevue/tag';
  import { getAllUsersRequest } from '@/services/user';
  import { toast } from 'vue3-toastify';
  import ConfirmDialog from 'primevue/confirmdialog';
  import { useConfirm } from 'primevue/useconfirm';
  import Filter from '@/components/Filter.vue';
  import Skeleton from 'primevue/skeleton';
  import axiosInstance from '@/services/axios';
  import { formatDateData, formatNumber } from '@/utils';

  const confirm = useConfirm();
  const requests = ref([]);
  const currentPage = ref(1);
  const totalPage = ref(0);
  const totalRequest = ref(0);
  const filterStatus = ref('');
  const showConfirmDialog = ref(false);
  const showRejectDialog = ref(false);
  const reason = ref('');
  const showError = ref(false);
  const isLoading = ref(true);
  const pageSizeOptions = [
    { id: 1, name: 10, value: 10 },
    { id: 2, name: 20, value: 20 },
    { id: 3, name: 30, value: 30 },
  ];
  const selectedPageSize = ref(pageSizeOptions[0].value);

  const getAllUsers = async () => {
    try {
      const response = await getAllUsersRequest(
        currentPage.value,
        selectedPageSize.value,
        filterStatus.value,
      );
      if (response.status === 200) {
        requests.value = response.data.data.data.rows;
        totalPage.value = response.data.data.totalPages;
        totalRequest.value = response.data.data.data.count;
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      isLoading.value = false;
    }
  };

  const applyFilter = (status) => {
    filterStatus.value = status;
    currentPage.value = 1;
    getAllUsers();
  };

  const openConfirmDialog = (userId) => {
    showConfirmDialog.value = true;
    confirmModal(userId);
  };

  const openRejectDialog = (userId) => {
    showRejectDialog.value = true;
    rejectModal(userId);
  };

  const handleApproveRequest = async (userId) => {
    try {
      const response = await axiosInstance.put('/admin/setStatusRequestChannel', {
        userId,
        status: 'approved',
      });
      if (response.status === 200) {
        toast.success('Approved successfully');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRejectRequest = async (userId, reason) => {
    try {
      const response = await axiosInstance.put('/admin/setStatusRequestChannel', {
        userId,
        status: 'rejected',
        text: reason,
      });
      if (response.status === 200) {
        toast.success('Rejected successfully');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
    getAllUsers();
  };
  const goToNextPage = () => {
    if (currentPage.value < totalPage.value) {
      currentPage.value++;
    }
    getAllUsers();
  };

  const confirmModal = (userId) => {
    confirm.require({
      message: 'Are you sure you want to accept this user?',
      header: 'Confirm Accept Request',
      icon: 'pi pi-info-circle',
      rejectProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptProps: {
        label: 'Confirm',
        severity: 'contrast',
      },
      accept: async () => {
        await handleApproveRequest(userId);
        showConfirmDialog.value = false;
        getAllUsers();
      },
      reject: () => {
        showConfirmDialog.value = false;
        getAllUsers();
      },
    });
  };

  const rejectModal = (userId) => {
    confirm.require({
      message: 'Are you sure you want to reject this user?',
      header: 'Confirm Reject Request',
      icon: 'pi pi-info-circle',
      rejectProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptProps: {
        label: 'Confirm',
        severity: 'danger',
      },
      accept: async () => {
        if (!reason.value.trim()) {
          showError.value = true;
          return;
        }
        showError.value = false;
        await handleRejectRequest(userId, reason.value);
        showRejectDialog.value = false;
        getAllUsers();
      },
      reject: () => {
        showRejectDialog.value = false;
        showError.value = false;
        reason.value = '';
        getAllUsers();
      },
    });
  };

  watch([selectedPageSize], () => {
    currentPage.value = 1;
    getAllUsers();
  });

  onMounted(() => {
    getAllUsers();
  });
</script>

<template>
  <section class="bg-[#FAFAFB]">
    <div class="container">
      <div class="card bg-white p-4 shadow rounded-lg">
        <DataTable
          v-if="isLoading"
          :value="
            Array(4).fill({
              username: '',
              email: '',
              REPs: '',
              totalReportCount: '',
              createdAt: '',
              status: '',
            })
          "
          stripedRows
        >
          <template #header>
            <div class="flex flex-wrap gap-2 items-center justify-between">
              <h1 class="font-bold text-[20px]">Request to channel</h1>
              <div class="flex gap-x-5">
                <button
                  class="border px-4 py-2 rounded-lg font-bold w-[120px]"
                  :class="{
                    'text-white bg-primary border-primary': filterStatus === '',
                    'text-primary border-primary hover:bg-primary hover:text-white':
                      filterStatus !== '',
                  }"
                  @click="applyFilter('')"
                >
                  All
                </button>
                <button
                  class="border px-4 py-2 rounded-lg font-bold w-[120px]"
                  :class="{
                    'text-white bg-primary border-primary': filterStatus === 'pending',
                    'text-primary border-primary hover:bg-primary hover:text-white':
                      filterStatus !== 'pending',
                  }"
                  @click="applyFilter('pending')"
                >
                  Pending
                </button>
                <button
                  class="border px-4 py-2 rounded-lg font-bold w-[120px]"
                  :class="{
                    'text-white bg-primary border-primary': filterStatus === 'approved',
                    'text-primary border-primary hover:bg-primary hover:text-white':
                      filterStatus !== 'approved',
                  }"
                  @click="applyFilter('approved')"
                >
                  Approved
                </button>
                <button
                  class="border px-4 py-2 rounded-lg font-bold w-[120px]"
                  :class="{
                    'text-white bg-primary border-primary': filterStatus === 'rejected',
                    'text-primary border-primary hover:bg-primary hover:text-white':
                      filterStatus !== 'rejected',
                  }"
                  @click="applyFilter('rejected')"
                >
                  Rejected
                </button>
              </div>
            </div>
          </template>
          <Column header="User">
            <template #body>
              <Skeleton />
            </template>
          </Column>
          <Column field="User.email" header="Email">
            <template #body> <Skeleton /> </template
          ></Column>
          <Column header="Balance (REPs)">
            <template #body>
              <Skeleton />
            </template>
          </Column>
          <Column field="totalReportCount" header="Being Reported">
            <template #body> <Skeleton /> </template
          ></Column>
          <Column field="createdAt" header="Create at">
            <template #body>
              <Skeleton />
            </template>
          </Column>
          <Column field="status" header="Status" dataType="boolean">
            <template #body>
              <Skeleton />
            </template>
          </Column>
          <Column>
            <template #body>
              <Skeleton />
            </template>
          </Column>
        </DataTable>
        <DataTable v-else :value="requests" stripedRows>
          <template #header>
            <div class="flex flex-wrap gap-2 items-center justify-between">
              <h1 class="font-bold text-[20px]">Request to channel</h1>
              <div class="flex gap-x-5">
                <button
                  class="border px-4 py-2 rounded-lg font-bold w-[120px]"
                  :class="{
                    'text-white bg-primary border-primary': filterStatus === '',
                    'text-primary border-primary hover:bg-primary hover:text-white':
                      filterStatus !== '',
                  }"
                  @click="applyFilter('')"
                >
                  All
                </button>
                <button
                  class="border px-4 py-2 rounded-lg font-bold w-[120px]"
                  :class="{
                    'text-white bg-primary border-primary': filterStatus === 'pending',
                    'text-primary border-primary hover:bg-primary hover:text-white':
                      filterStatus !== 'pending',
                  }"
                  @click="applyFilter('pending')"
                >
                  Pending
                </button>
                <button
                  class="border px-4 py-2 rounded-lg font-bold w-[120px]"
                  :class="{
                    'text-white bg-primary border-primary': filterStatus === 'approved',
                    'text-primary border-primary hover:bg-primary hover:text-white':
                      filterStatus !== 'approved',
                  }"
                  @click="applyFilter('approved')"
                >
                  Approved
                </button>
                <button
                  class="border px-4 py-2 rounded-lg font-bold w-[120px]"
                  :class="{
                    'text-white bg-primary border-primary': filterStatus === 'rejected',
                    'text-primary border-primary hover:bg-primary hover:text-white':
                      filterStatus !== 'rejected',
                  }"
                  @click="applyFilter('rejected')"
                >
                  Rejected
                </button>
              </div>
            </div>
          </template>
          <template #empty>
            <p class="text-center">No requests found.</p>
          </template>
          <Column header="User">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <img
                  :alt="data.User.avatar"
                  :src="data.User.avatar"
                  class="size-[40px] rounded-full"
                />
                <span>{{ data.User.username }}</span>
              </div>
            </template>
          </Column>
          <Column field="User.email" header="Email"></Column>
          <Column header="Balance (REPs)">
            <template #body="{ data }">
              <span>{{ formatNumber(data.User.REPs) }}</span>
            </template>
          </Column>
          <Column field="totalReportCount" header="Being Reported"></Column>
          <Column field="createdAt" header="Create at">
            <template #body="{ data }">
              <span>{{ formatDateData(data.createdAt) }} </span>
            </template>
          </Column>
          <Column field="status" header="Status" dataType="boolean">
            <template #body="{ data }">
              <Tag v-if="data.status === 'pending'" value="Pending" severity="info" />
              <Tag v-else-if="data.status === 'approved'" value="Approved" severity="success" />
              <Tag v-else value="Rejected" severity="danger" />
            </template>
          </Column>
          <Column>
            <template #body="{ data }">
              <div
                class="flex justify-between"
                v-if="data.status !== 'approved' && data.status !== 'rejected'"
              >
                <button
                  class="btn bg-blue hover:opacity-75"
                  @click="openConfirmDialog(data.User.id)"
                >
                  Accept
                </button>
                <button class="btn bg-red hover:opacity-75" @click="openRejectDialog(data.User.id)">
                  Reject
                </button>
              </div>
              <div v-else>{{ data.text }}</div>
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
              {{ Math.min(currentPage * selectedPageSize, totalRequest) }}
            </span>
            <span> of {{ totalRequest }} results</span>
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
    <ConfirmDialog
      v-model:visible="showConfirmDialog"
      :style="{ width: '604px' }"
      :draggable="false"
    >
    </ConfirmDialog>
    <ConfirmDialog
      v-model:visible="showRejectDialog"
      :style="{ width: '604px' }"
      :draggable="false"
    >
      <template #message>
        <div class="w-full">
          <p>Please enter your reason:</p>
          <input
            v-model="reason"
            placeholder="Your reason here..."
            class="border rounded-md w-full p-2 mt-3"
            :class="{ 'border-red': showError }"
            required
          />
          <small v-if="showError" class="text-red">Reason is required.</small>
        </div>
      </template>
    </ConfirmDialog>
  </section>
</template>
