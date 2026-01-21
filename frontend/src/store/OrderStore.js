import { create } from 'zustand';
import orderService from '../service/orderService';

const useOrderStore = create((set) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const orders = await orderService.getAll();
      set({ orders, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch orders', loading: false });
    }
  },

  addOrder: async (orderData) => {
    set({ loading: true, error: null });
    try {
      const newOrder = await orderService.create(orderData);
      set((state) => ({ orders: [newOrder, ...state.orders], loading: false }));
      return newOrder;
    } catch (err) {
      set({ error: 'Failed to add order', loading: false });
      throw err;
    }
  },

  updateOrder: async (id, orderData) => {
    set({ loading: true, error: null });
    try {
      const updatedOrder = await orderService.update(id, orderData);
      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? updatedOrder : o)),
        loading: false,
      }));
      return updatedOrder;
    } catch (err) {
      set({ error: 'Failed to update order', loading: false });
      throw err;
    }
  },

  deleteOrder: async (id) => {
    set({ loading: true, error: null });
    try {
      await orderService.delete(id);
      set((state) => ({
        orders: state.orders.filter((o) => o.id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: 'Failed to delete order', loading: false });
      throw err;
    }
  },
}));

export default useOrderStore;
