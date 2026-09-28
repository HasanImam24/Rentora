import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const auth = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    return api.post('/auth/logout');
  },
};

export const listings = {
  getAll: (params) => api.get('/listings', { params }),
  getById: (id) => api.get(`/listings/${id}`),
  create: (data) => api.post('/listings', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/listings/${id}`, data),
  delete: (id) => api.delete(`/listings/${id}`),
  getMyListings: () => api.get('/listings/user/me'),
};

export const rentals = {
  create: (data) => api.post('/rentals', data),
  getMyRentals: () => api.get('/rentals/my'),
  getReceivedRentals: () => api.get('/rentals/received'),
  getById: (id) => api.get(`/rentals/${id}`),
  accept: (id) => api.patch(`/rentals/${id}/accept`),
  reject: (id) => api.patch(`/rentals/${id}/reject`),
  cancel: (id) => api.patch(`/rentals/${id}/cancel`),
  complete: (id) => api.patch(`/rentals/${id}/complete`),
  getBookedDates: (listingId) => api.get(`/rentals/booked-dates/${listingId}`),
};

export const orders = {
  create: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my'),
  getReceivedOrders: () => api.get('/orders/received'),
  getById: (id) => api.get(`/orders/${id}`),
  accept: (id) => api.patch(`/orders/${id}/accept`),
  reject: (id) => api.patch(`/orders/${id}/reject`),
  cancel: (id) => api.patch(`/orders/${id}/cancel`),
  complete: (id) => api.patch(`/orders/${id}/complete`),
};

export const complaints = {
  create: (data) => api.post('/complaints', data),
  getAll: () => api.get('/complaints'),
  getById: (id) => api.get(`/complaints/${id}`),
  delete: (id) => api.delete(`/complaints/${id}`),
};

export const admin = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  toggleUserStatus: (id) => api.patch(`/admin/users/${id}/toggle-status`),
  getListings: () => api.get('/admin/listings'),
  updateListingStatus: (id, status) => api.patch(`/admin/listings/${id}/status`, { status }),
  deleteListing: (id) => api.delete(`/admin/listings/${id}`),
  getComplaints: () => api.get('/admin/complaints'),
  respondToComplaint: (id, data) => api.patch(`/admin/complaints/${id}/respond`, data),
};

export default api;
