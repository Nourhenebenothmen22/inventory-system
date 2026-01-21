import api from './api';

const authService = {
  register: async (userData) => {
    const response = await api.post('/register', userData);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  logout: async () => {
    await api.post('/logout');
    localStorage.removeItem('token');
  },

  getMe: async () => {
    const response = await api.get('/me');
    return response.data;
  },
};

export default authService;
