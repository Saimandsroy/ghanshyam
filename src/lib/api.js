import axios from 'axios';

/**
 * API Service Layer
 * Centralized service for all backend API calls
 */

// Base API URL - should match backend port
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor - Add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;

      // Handle 401 Unauthorized - redirect to login
      if (status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authRole');
        localStorage.removeItem('authUser');
        window.location.href = '/login';
      }

      // Handle other errors
      const errorMessage = data?.message || data?.error || 'An error occurred';
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // Request made but no response
      return Promise.reject(new Error('No response from server. Please check your connection.'));
    } else {
      // Something else happened
      return Promise.reject(error);
    }
  }
);

// ==================== Authentication APIs ====================

export const authAPI = {
  /**
   * Login user
   * @param {string} email 
   * @param {string} password 
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

// ==================== Admin APIs ====================

export const adminAPI = {
  // Users
  getUsers: async (filters = {}) => {
    const response = await api.get('/admin/users', { params: filters });
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  updateUser: async (userId, updates) => {
    const response = await api.put(`/admin/users/${userId}`, updates);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Websites
  getWebsites: async () => {
    const response = await api.get('/admin/websites');
    return response.data;
  },

  createWebsite: async (websiteData) => {
    const response = await api.post('/admin/websites', websiteData);
    return response.data;
  },

  updateWebsite: async (websiteId, updates) => {
    const response = await api.put(`/admin/websites/${websiteId}`, updates);
    return response.data;
  },

  deleteWebsite: async (websiteId) => {
    const response = await api.delete(`/admin/websites/${websiteId}`);
    return response.data;
  },

  uploadWebsites: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/admin/websites/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Statistics
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Price Charts
  getPriceCharts: async () => {
    const response = await api.get('/admin/price-charts');
    return response.data;
  },

  createPriceChart: async (data) => {
    const response = await api.post('/admin/price-charts', data);
    return response.data;
  },

  updatePriceChart: async (id, updates) => {
    const response = await api.put(`/admin/price-charts/${id}`, updates);
    return response.data;
  },

  deletePriceChart: async (id) => {
    const response = await api.delete(`/admin/price-charts/${id}`);
    return response.data;
  },
};

// ==================== Manager APIs ====================

export const managerAPI = {
  // Tasks
  getTasks: async (filters = {}) => {
    const response = await api.get('/manager/tasks', { params: filters });
    return response.data;
  },

  getTask: async (taskId) => {
    const response = await api.get(`/manager/tasks/${taskId}`);
    return response.data;
  },

  assignToWriter: async (taskId, writerId, instructions) => {
    const response = await api.patch(`/manager/tasks/${taskId}/assign`, {
      writer_id: writerId,
      instructions,
    });
    return response.data;
  },

  approveContent: async (taskId, bloggerId) => {
    const response = await api.patch(`/manager/tasks/${taskId}/approve-content`, {
      blogger_id: bloggerId,
    });
    return response.data;
  },

  returnToWriter: async (taskId, notes) => {
    const response = await api.patch(`/manager/tasks/${taskId}/return-to-writer`, { notes });
    return response.data;
  },

  finalizeTask: async (taskId) => {
    const response = await api.patch(`/manager/tasks/${taskId}/finalize`);
    return response.data;
  },

  rejectTask: async (taskId, reason) => {
    const response = await api.patch(`/manager/tasks/${taskId}/reject`, { reason });
    return response.data;
  },

  // Withdrawals
  getWithdrawals: async () => {
    const response = await api.get('/manager/withdrawals');
    return response.data;
  },

  approveWithdrawal: async (withdrawalId) => {
    const response = await api.patch(`/manager/withdrawals/${withdrawalId}/approve`);
    return response.data;
  },

  rejectWithdrawal: async (withdrawalId, reason) => {
    const response = await api.patch(`/manager/withdrawals/${withdrawalId}/reject`, { reason });
    return response.data;
  },
};

// ==================== Team APIs ====================

export const teamAPI = {
  getTasks: async () => {
    const response = await api.get('/team/tasks');
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/team/tasks', taskData);
    return response.data;
  },

  getTask: async (taskId) => {
    const response = await api.get(`/team/tasks/${taskId}`);
    return response.data;
  },
};

// ==================== Writer APIs ====================

export const writerAPI = {
  getTasks: async () => {
    const response = await api.get('/writer/tasks');
    return response.data;
  },

  getTask: async (taskId) => {
    const response = await api.get(`/writer/tasks/${taskId}`);
    return response.data;
  },

  markInProgress: async (taskId) => {
    const response = await api.patch(`/writer/tasks/${taskId}/mark-in-progress`);
    return response.data;
  },

  submitContent: async (taskId, content) => {
    const response = await api.post(`/writer/tasks/${taskId}/submit-content`, {
      content_body: content,
    });
    return response.data;
  },
};

// ==================== Blogger APIs ====================

export const bloggerAPI = {
  // Tasks
  getTasks: async () => {
    const response = await api.get('/blogger/tasks');
    return response.data;
  },

  getTask: async (taskId) => {
    const response = await api.get(`/blogger/tasks/${taskId}`);
    return response.data;
  },

  submitLink: async (taskId, liveUrl) => {
    const response = await api.post(`/blogger/tasks/${taskId}/submit-link`, {
      live_published_url: liveUrl,
    });
    return response.data;
  },

  // Wallet
  getWallet: async () => {
    const response = await api.get('/blogger/wallet');
    return response.data;
  },

  // Withdrawals
  requestWithdrawal: async (amount, notes = '') => {
    const response = await api.post('/blogger/withdrawals/request', { amount, notes });
    return response.data;
  },

  getWithdrawals: async () => {
    const response = await api.get('/blogger/withdrawals');
    return response.data;
  },

  // Statistics
  getStats: async () => {
    const response = await api.get('/blogger/stats');
    return response.data;
  },
};

// ==================== Accountant APIs ====================

export const accountantAPI = {
  // Payments
  getPayments: async (filters = {}) => {
    const response = await api.get('/accountant/payments', { params: filters });
    return response.data;
  },

  markAsPaid: async (paymentId) => {
    const response = await api.patch(`/accountant/payments/${paymentId}/pay`);
    return response.data;
  },
};

// ==================== Config APIs ====================

export const configAPI = {
  getConfig: async () => {
    const response = await api.get('/config');
    return response.data;
  },

  getConfigValue: async (key) => {
    const response = await api.get(`/config/${key}`);
    return response.data;
  },

  updateConfig: async (key, value, description) => {
    const response = await api.put(`/config/${key}`, { value, description });
    return response.data;
  },
};

// Export default axios instance for custom requests
export default api;
