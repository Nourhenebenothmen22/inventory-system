import { create } from 'zustand';
import supplierService from '../service/supplierService';

const useSupplierStore = create((set) => ({
  suppliers: [],
  loading: false,
  error: null,

  fetchSuppliers: async () => {
    set({ loading: true, error: null });
    try {
      const suppliers = await supplierService.getAll();
      set({ suppliers, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch suppliers', loading: false });
    }
  },

  addSupplier: async (supplierData) => {
    set({ loading: true, error: null });
    try {
      const newSupplier = await supplierService.create(supplierData);
      set((state) => ({ suppliers: [...state.suppliers, newSupplier], loading: false }));
      return newSupplier;
    } catch (err) {
      set({ error: 'Failed to add supplier', loading: false });
      throw err;
    }
  },

  updateSupplier: async (id, supplierData) => {
    set({ loading: true, error: null });
    try {
      const updatedSupplier = await supplierService.update(id, supplierData);
      set((state) => ({
        suppliers: state.suppliers.map((s) => (s.id === id ? updatedSupplier : s)),
        loading: false,
      }));
      return updatedSupplier;
    } catch (err) {
      set({ error: 'Failed to update supplier', loading: false });
      throw err;
    }
  },

  deleteSupplier: async (id) => {
    set({ loading: true, error: null });
    try {
      await supplierService.delete(id);
      set((state) => ({
        suppliers: state.suppliers.filter((s) => s.id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: 'Failed to delete supplier', loading: false });
      throw err;
    }
  },
}));

export default useSupplierStore;
