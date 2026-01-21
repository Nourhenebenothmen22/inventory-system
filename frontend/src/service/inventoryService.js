import api from './api';

const inventoryService = {
  getLogs: async () => {
    const response = await api.get('/inventory-logs');
    return response.data;
  },
};

export default inventoryService;
