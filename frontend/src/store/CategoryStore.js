import { create } from 'zustand';
import categoryService from '../service/categoryService';

const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await categoryService.getAll();
      set({ categories, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch categories', loading: false });
    }
  },

  addCategory: async (categoryData) => {
    set({ loading: true, error: null });
    try {
      const newCategory = await categoryService.create(categoryData);
      set((state) => ({ categories: [...state.categories, newCategory], loading: false }));
      return newCategory;
    } catch (err) {
      set({ error: 'Failed to add category', loading: false });
      throw err;
    }
  },

  updateCategory: async (id, categoryData) => {
    set({ loading: true, error: null });
    try {
      const updatedCategory = await categoryService.update(id, categoryData);
      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? updatedCategory : c)),
        loading: false,
      }));
      return updatedCategory;
    } catch (err) {
      set({ error: 'Failed to update category', loading: false });
      throw err;
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      await categoryService.delete(id);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: 'Failed to delete category', loading: false });
      throw err;
    }
  },
}));

export default useCategoryStore;
