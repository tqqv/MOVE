import { getWithdrawInfor } from '@/services/cashout';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useWithdrawInfor = defineStore('getWithdrawInfor', () => {
  const withdrawInfor = ref({});

  const fetchWithdrawInfor = async () => {
    const res = await getWithdrawInfor();

    if (res && res.status === 200) {
      withdrawInfor.value = res.data.data;
    } else {
      console.error('get withdraw infor failed');
    }
  };

  const clearWithdrawInfor = () => {
    withdrawInfor.value = null;
  };

  return {
    withdrawInfor,
    fetchWithdrawInfor,
    clearWithdrawInfor,
  };
});
