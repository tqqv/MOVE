import { defineStore } from 'pinia';

export const useTabStore = defineStore('tabStore', {
  state: () => ({
    activeTab: '0',
  }),
  actions: {
    setActiveTab(value) {
      this.activeTab = value;
    },
  },
});
