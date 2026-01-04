import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
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

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  getProfile: () => api.get('/auth/profile'),
  changePassword: (currentPassword, newPassword) => 
    api.post('/auth/change-password', { currentPassword, newPassword }),
};

// Projects API
export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

// Experiences API
export const experiencesAPI = {
  getAll: () => api.get('/experiences'),
  getOne: (id) => api.get(`/experiences/${id}`),
  create: (data) => api.post('/experiences', data),
  update: (id, data) => api.put(`/experiences/${id}`, data),
  delete: (id) => api.delete(`/experiences/${id}`),
};

// About API
export const aboutAPI = {
  get: () => api.get('/about'),
  update: (data) => api.put('/about', data),
};

// About Info API (for About Section)
export const aboutInfoAPI = {
  get: () => api.get('/about-info'),
  update: (data) => api.put('/about-info', data),
};

// Contact API
export const contactAPI = {
  get: () => api.get('/contact'),
  update: (data) => api.put('/contact', data),
};

// Blog API
export const blogAPI = {
  getAll: (params) => api.get('/blog/posts', { params }),
  getOne: (id) => api.get(`/blog/posts/${id}`),
  getBySlug: (slug) => api.get(`/blog/posts/slug/${slug}`),
  create: (data) => api.post('/blog/posts', data),
  update: (id, data) => api.put(`/blog/posts/${id}`, data),
  delete: (id) => api.delete(`/blog/posts/${id}`),
};

// Testimonials API
export const testimonialsAPI = {
  getAll: (params) => api.get('/testimonials', { params }),
  getOne: (id) => api.get(`/testimonials/${id}`),
  create: (data) => api.post('/testimonials', data),
  update: (id, data) => api.put(`/testimonials/${id}`, data),
  delete: (id) => api.delete(`/testimonials/${id}`),
};

// Newsletter API
export const newsletterAPI = {
  getSubscribers: () => api.get('/newsletter/subscribers'),
  subscribe: (data) => api.post('/newsletter/subscribe', data),
  unsubscribe: (email) => api.post(`/newsletter/unsubscribe/${email}`),
  deleteSubscriber: (id) => api.delete(`/newsletter/subscribers/${id}`),
};

// Skills API
export const skillsAPI = {
  getAll: () => api.get('/skills'),
  getOne: (id) => api.get(`/skills/${id}`),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
};

// Messages API
export const messagesAPI = {
  getAll: () => api.get('/messages'),
  getOne: (id) => api.get(`/messages/${id}`),
  create: (data) => api.post('/messages', data),
  updateStatus: (id, status) => api.patch(`/messages/${id}/status`, { status }),
  delete: (id) => api.delete(`/messages/${id}`),
};

// Certifications API
export const certificationsAPI = {
  getAll: () => api.get('/certifications'),
  getOne: (id) => api.get(`/certifications/${id}`),
  create: (data) => api.post('/certifications', data),
  update: (id, data) => api.put(`/certifications/${id}`, data),
  delete: (id) => api.delete(`/certifications/${id}`),
};

// Upload API
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Analytics API
export const analyticsAPI = {
  trackEvent: (data) => api.post('/analytics/track', data),
  getStatistics: () => api.get('/analytics/statistics'),
  getRecentActivities: (limit = 50) => api.get(`/analytics/activities?limit=${limit}`),
  getChartData: () => api.get('/analytics/chart'),
};

// Helper functions
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

export const getAdmin = () => {
  const admin = localStorage.getItem('admin');
  return admin ? JSON.parse(admin) : null;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('admin');
  window.location.href = '/admin/login';
};

export default api;
