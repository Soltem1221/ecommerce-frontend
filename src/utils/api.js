import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
  }),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
  })
};

export const productAPI = {
  getProducts: (params) => {
    // remove empty or null/undefined values so backend only receives requested filters
    const clean = {};
    if (params && typeof params === 'object') {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== '' && v !== null && v !== undefined) clean[k] = v;
      });
    }
    return api.get('/products', { params: clean });
  },
  getProduct: (slug) => api.get(`/products/${slug}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`)
};

// admin actions for products
productAPI.approveProduct = (id) => api.post(`/products/${id}/approve`);

export const categoryAPI = {
  getCategories: () => api.get('/categories'),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`)
};

export const orderAPI = {
  createOrder: (data) => api.post('/orders', data),
  getOrders: () => api.get('/orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  getSellerOrders: () => api.get('/orders/seller')
};

export const paymentAPI = {
  initializePayment: (data) => api.post('/payment/initialize', data),
  verifyPayment: (tx_ref) => api.get(`/payment/verify/${tx_ref}`)
};

export const walletAPI = {
  getWallet: () => api.get('/wallet'),
  withdraw: (data) => api.post('/wallet/withdraw', data)
};

export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  add: (data) => api.post('/wishlist', data),
  remove: (productId) => api.delete(`/wishlist/${productId}`)
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/status`),
  getSystemReports: () => api.get('/admin/reports'),
  toggleFeatured: (id) => api.put(`/admin/products/${id}/feature`)
};

export default api;
