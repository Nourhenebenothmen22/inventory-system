import api from './api';

const productService = {
  getAll: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  getOne: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (productData) => {
    // We use FormData for potential image upload
    const response = await api.post('/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id, productData) => {
    // If updating with potential image, FormData might be needed too.
    // Laravel often requires POST with _method=PUT for multipart updates.
    const isFormData = productData instanceof FormData;
    const response = await api.post(`/products/${id}${isFormData ? '?_method=PUT' : ''}`, productData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
      params: !isFormData ? { _method: 'PUT' } : {}
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default productService;
