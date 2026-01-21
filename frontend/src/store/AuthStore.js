import { create } from 'zustand';
import authService from '../service/authService';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.login(credentials);
      set({ user: data.user, isAuthenticated: true, loading: false });
      return data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed', loading: false });
      throw err;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.register(userData);
      set({ loading: false });
      return data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Registration failed', loading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  getMe: async () => {
    if (!localStorage.getItem('token')) return;
    set({ loading: true });
    try {
      const user = await authService.getMe();
      set({ user, isAuthenticated: true, loading: false });
    } catch (err) {
      set({ user: null, isAuthenticated: false, loading: false });
      localStorage.removeItem('token');
    }
  },
}));

export default useAuthStore;
