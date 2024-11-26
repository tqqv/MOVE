import { getWithdrawInfor } from '@/services/cashout';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useWithdrawInfor = defineStore('getWithdrawInfor', () => {
  const withdrawInfor = ref({});
  const isLoadingWithdrawInfor = ref(false);
  const fetchWithdrawInfor = async () => {
    isLoadingWithdrawInfor.value = true;

    try {
      const res = await getWithdrawInfor();

      if (res && res.status === 200) {
        withdrawInfor.value = res.data.data;
      } else {
        console.error('Get withdraw info failed');
      }
    } catch (error) {
      console.error('Error fetching withdraw info', error);
    } finally {
      isLoadingWithdrawInfor.value = false;
    }
  };

  const clearWithdrawInfor = () => {
    withdrawInfor.value = null;
  };

  return {
    withdrawInfor,
    fetchWithdrawInfor,
    clearWithdrawInfor,
    isLoadingWithdrawInfor,
  };
});
