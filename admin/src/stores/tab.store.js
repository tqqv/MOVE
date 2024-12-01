import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useTabStore = defineStore('tabStore', () => {
  const activeTab = ref('0');

  const setActiveTab = (value) => {
    activeTab.value = value;
  };
  const clearActiveTab = () => {
    activeTab.value = '0';
  };
  return { activeTab, setActiveTab, clearActiveTab };
});
