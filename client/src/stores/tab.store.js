import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useTabStore = defineStore('tabStore', () => {
  const activeTab = ref('0');

  const setActiveTab = (value) => {
    activeTab.value = value;
  };

  return { activeTab, setActiveTab };
});
