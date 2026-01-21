import api from './api';

const userService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};

export default userService;
