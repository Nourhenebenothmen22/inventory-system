import { create } from 'zustand';
import productService from '../service/productService';

const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const products = await productService.getAll();
      set({ products, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch products', loading: false });
    }
  },

  addProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const newProduct = await productService.create(productData);
      set((state) => ({ products: [...state.products, newProduct], loading: false }));
      return newProduct;
    } catch (err) {
      set({ error: 'Failed to add product', loading: false });
      throw err;
    }
  },

  updateProduct: async (id, productData) => {
    set({ loading: true, error: null });
    try {
      const updatedProduct = await productService.update(id, productData);
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
        loading: false,
      }));
      return updatedProduct;
    } catch (err) {
      set({ error: 'Failed to update product', loading: false });
      throw err;
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await productService.delete(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: 'Failed to delete product', loading: false });
      throw err;
    }
  },
}));

export default useProductStore;
