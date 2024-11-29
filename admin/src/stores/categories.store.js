import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getAllCategories } from '@/services/categories';

export const useCategoriesStore = defineStore('categories', () => {
  const error = ref(null);
  const loading = ref(false);
  const categories = ref(null);
  const categoryOptions = ref([{ id: 0, name: 'All categories', title: '' }]);
  const categoriesForSelect = ref([{ id: '0', name: 'Select a category', title: '' }]);

  const fetchCategories = async () => {
    loading.value = true;
    try {
      const response = await getAllCategories();
      if (!response.error) {
        categories.value = response.data;

        const formattedData = response.data.map((item) => ({
          id: item.id,
          name: item.title,
          title: item.title,
        }));
        categoryOptions.value = [{ id: 0, name: 'All categories', title: '' }, ...formattedData];
        categoriesForSelect.value = [
          { id: '0', name: 'Select a category', title: '' },
          ...formattedData,
        ];
      } else {
        error.value = response.message;
      }
    } catch (error) {
      error.value = 'Failed to load categories';
    } finally {
      loading.value = false;
    }
  };

  return { categories, categoryOptions, fetchCategories, loading, error, categoriesForSelect };
});
