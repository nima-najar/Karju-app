import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Shifts API
export const shiftsAPI = {
  getAll: (params?: any) => api.get('/shifts', { params }),
  getById: (id: string) => api.get(`/shifts/${id}`),
  create: (data: any) => api.post('/shifts', data),
  update: (id: string, data: any) => api.put(`/shifts/${id}`, data),
};

// Applications API
export const applicationsAPI = {
  apply: (data: any) => api.post('/applications', data),
  getByShift: (shiftId: string) => api.get(`/applications/shift/${shiftId}`),
  getMyApplications: () => api.get('/applications/worker/my-applications'),
  updateStatus: (id: string, data: any) => api.patch(`/applications/${id}`, data),
};

// Dashboard API
export const dashboardAPI = {
  getWorkerDashboard: () => api.get('/dashboard/worker'),
  getBusinessDashboard: () => api.get('/dashboard/business'),
};

// Profile API
export const profileAPI = {
  getWorkerProfile: (userId: string) => api.get(`/profile/worker/${userId}`),
  updateWorkerProfile: (data: any) => api.put('/profile/worker', data),
  updateBusinessProfile: (data: any) => api.put('/profile/business', data),
};

// Ratings API
export const ratingsAPI = {
  create: (data: any) => api.post('/ratings', data),
  getByUser: (userId: string) => api.get(`/ratings/user/${userId}`),
};

// Notifications API
export const notificationsAPI = {
  getAll: (params?: any) => api.get('/notifications', { params }),
  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};

export default api;



