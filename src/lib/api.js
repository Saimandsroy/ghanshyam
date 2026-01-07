import axios from 'axios';

/**
 * API Service Layer
 * Centralized service for all backend API calls
 */

// Base API URL - should match backend port (5001)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Enable/disable detailed logging
const ENABLE_API_LOGGING = true;

// Logger utility
const logger = {
  request: (config) => {
    if (!ENABLE_API_LOGGING) return;
    console.group(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log('📍 Full URL:', `${config.baseURL}${config.url}`);
    console.log('📋 Headers:', config.headers);
    if (config.data) console.log('📦 Body:', config.data);
    if (config.params) console.log('🔍 Params:', config.params);
    console.groupEnd();
  },
  response: (response) => {
    if (!ENABLE_API_LOGGING) return;
    console.group(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    console.log('📊 Status:', response.status, response.statusText);
    console.log('📦 Data:', response.data);
    console.groupEnd();
  },
  error: (error) => {
    if (!ENABLE_API_LOGGING) return;
    console.group(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
    if (error.response) {
      console.log('📊 Status:', error.response.status, error.response.statusText);
      console.log('📦 Error Data:', error.response.data);
    } else if (error.request) {
      console.log('🔌 No Response - Server may be down or CORS issue');
      console.log('📍 Request URL:', error.config?.baseURL + error.config?.url);
    } else {
      console.log('⚠️ Error:', error.message);
    }
    console.groupEnd();
  }
};

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
  withCredentials: true, // Enable CORS credentials
});

console.log('🔗 API Base URL configured:', API_BASE_URL);

// Request interceptor - Add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    logger.request(config);
    return config;
  },
  (error) => {
    logger.error(error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    logger.response(response);
    return response;
  },
  (error) => {
    logger.error(error);

    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;

      // Handle 401 Unauthorized - redirect to login
      if (status === 401) {
        console.warn('🔐 Unauthorized - Clearing auth and redirecting to login');
        localStorage.removeItem('authToken');
        localStorage.removeItem('authRole');
        localStorage.removeItem('authUser');
        window.location.href = '/login';
      }

      // Handle other errors - extract message from various formats
      let errorMessage = 'An error occurred';
      if (typeof data === 'string') {
        errorMessage = data;
      } else if (data?.message) {
        errorMessage = data.message;
      } else if (data?.error?.message) {
        errorMessage = data.error.message;
      } else if (data?.error && typeof data.error === 'string') {
        errorMessage = data.error;
      } else if (data?.error) {
        // If error is still an object, stringify it
        errorMessage = JSON.stringify(data.error);
      }
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // Request made but no response
      console.error('🔌 Network Error - Check if backend is running on port 5001');
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

  // Tasks (Admin overview)
  getTasks: async (filters = {}) => {
    const response = await api.get('/admin/tasks', { params: filters });
    return response.data;
  },

  // Withdrawals (Admin overview)
  getWithdrawals: async () => {
    const response = await api.get('/admin/withdrawals');
    return response.data;
  },

  // Wallet Management
  getBloggersWallets: async (params = {}) => {
    const response = await api.get('/admin/wallet/bloggers', { params });
    return response.data;
  },

  getPaymentHistory: async (params = {}) => {
    const response = await api.get('/admin/wallet/payment-history', { params });
    return response.data;
  },

  getWithdrawalRequests: async (params = {}) => {
    const response = await api.get('/admin/wallet/withdrawal-requests', { params });
    return response.data;
  },

  approveWithdrawal: async (id) => {
    const response = await api.put(`/admin/wallet/withdrawal-requests/${id}/approve`);
    return response.data;
  },

  rejectWithdrawal: async (id, reason) => {
    const response = await api.put(`/admin/wallet/withdrawal-requests/${id}/reject`, { reason });
    return response.data;
  },

  // Orders (admin orders endpoint)
  getOrders: async (filters = {}) => {
    const response = await api.get('/admin/orders', { params: filters });
    return response.data;
  },

  updateOrder: async (orderId, orderData) => {
    const response = await api.patch(`/admin/orders/${orderId}`, orderData);
    return response.data;
  },

  getOrderDetails: async (orderId) => {
    const response = await api.get(`/admin/orders/${orderId}/details`);
    return response.data;
  },
};

// ==================== Manager APIs ====================

export const managerAPI = {
  // Dashboard stats
  getDashboard: async () => {
    const response = await api.get('/manager/dashboard');
    return response.data;
  },

  // Tasks
  getTasks: async (filters = {}) => {
    const response = await api.get('/manager/tasks', { params: filters });
    return response.data;
  },

  getTask: async (taskId) => {
    const response = await api.get(`/manager/tasks/${taskId}`);
    return response.data;
  },

  // Get team members for assignment dropdown
  getTeamMembers: async () => {
    const response = await api.get('/manager/team-members');
    return response.data;
  },

  // Get writers for assignment dropdown
  getWriters: async () => {
    const response = await api.get('/manager/writers');
    return response.data;
  },

  // Get bloggers for assignment dropdown
  getBloggers: async () => {
    const response = await api.get('/manager/bloggers');
    return response.data;
  },

  // Get websites/sites for manager view (with pagination)
  getWebsites: async (params = {}) => {
    const { page = 1, limit = 50 } = params;
    const response = await api.get(`/manager/websites?page=${page}&limit=${limit}`);
    return response.data;
  },

  // WORKFLOW STEP 1: Create order and push to team
  createOrder: async (orderData) => {
    const response = await api.post('/manager/orders', orderData);
    return response.data;
  },

  assignToTeam: async (taskId, teamId) => {
    const response = await api.patch(`/manager/tasks/${taskId}/assign-team`, {
      team_id: teamId,
    });
    return response.data;
  },

  // WORKFLOW STEP 3: Approve and assign to writer
  assignToWriter: async (taskId, writerId, instructions, websiteDetails = []) => {
    const response = await api.patch(`/manager/tasks/${taskId}/assign`, {
      writer_id: writerId,
      instructions,
      website_details: websiteDetails,
    });
    return response.data;
  },

  // WORKFLOW STEP 5: Approve content and assign to blogger
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

  // WORKFLOW STEP 7: Verify and credit blogger
  finalizeTask: async (taskId) => {
    const response = await api.patch(`/manager/tasks/${taskId}/finalize`);
    return response.data;
  },

  rejectTask: async (taskId, reason) => {
    const response = await api.patch(`/manager/tasks/${taskId}/reject`, { rejection_reason: reason });
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
    const response = await api.patch(`/manager/withdrawals/${withdrawalId}/reject`, { rejection_reason: reason });
    return response.data;
  },

  // Orders management
  getOrders: async (filters = {}) => {
    const response = await api.get('/manager/orders', { params: filters });
    return response.data;
  },

  updateOrder: async (orderId, orderData) => {
    const response = await api.patch(`/manager/orders/${orderId}`, orderData);
    return response.data;
  },

  getOrderDetails: async (orderId) => {
    const response = await api.get(`/manager/orders/${orderId}/details`);
    return response.data;
  },

  getPendingFromBloggers: async () => {
    const response = await api.get('/manager/pending-from-bloggers');
    return response.data;
  },

  getPendingFromTeams: async () => {
    const response = await api.get('/manager/pending-from-teams');
    return response.data;
  },

  getPendingFromWriters: async () => {
    const response = await api.get('/manager/pending-from-writers');
    return response.data;
  },

  approveTeamSubmission: async (taskId) => {
    const response = await api.patch(`/manager/tasks/${taskId}/approve-team`);
    return response.data;
  },

  rejectTeamSubmission: async (taskId, reason) => {
    const response = await api.patch(`/manager/tasks/${taskId}/reject-team`, { reason });
    return response.data;
  },

  getRejectedOrders: async (page = 1, limit = 20) => {
    const response = await api.get('/manager/rejected-orders', { params: { page, limit } });
    return response.data;
  },

  // WORKFLOW STEP 5 (AUTO-ROUTING): Push tasks to bloggers
  // Each website is automatically assigned to its owner (the vendor who uploaded it)
  pushToBloggers: async (taskId) => {
    const response = await api.post(`/manager/tasks/${taskId}/push-to-bloggers`);
    return response.data;
  },

  // Get pending blogger submissions
  getPendingFromBloggers: async () => {
    const response = await api.get('/manager/pending-from-bloggers');
    return response.data;
  },

  // WORKFLOW STEP 7: Manager reviews blogger submission
  // Get blogger submission detail for review
  getBloggerSubmission: async (detailId) => {
    const response = await api.get(`/manager/blogger-submissions/${detailId}`);
    return response.data;
  },

  // Finalize blogger submission - mark complete and credit blogger
  finalizeFromBlogger: async (detailId, creditAmount = null) => {
    const response = await api.post(`/manager/blogger-submissions/${detailId}/finalize`, {
      credit_amount: creditAmount
    });
    return response.data;
  },

  // Reject blogger submission - sends back to blogger with reason
  rejectBloggerSubmission: async (detailId, reason) => {
    const response = await api.post(`/manager/blogger-submissions/${detailId}/reject`, {
      rejection_reason: reason
    });
    return response.data;
  },
};

// ==================== Team APIs ====================

export const teamAPI = {
  getDashboard: async () => {
    const response = await api.get('/team/dashboard');
    return response.data;
  },

  getTasks: async () => {
    const response = await api.get('/team/tasks');
    return response.data;
  },

  // Get tasks assigned by Manager (pending action)
  getAssignedTasks: async () => {
    const response = await api.get('/team/assigned');
    return response.data;
  },

  getTask: async (taskId) => {
    const response = await api.get(`/team/tasks/${taskId}`);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/team/tasks', taskData);
    return response.data;
  },

  // WORKFLOW STEP 2: Submit selected website back to Manager
  submitWebsite: async (taskId, websiteId, notes, suggestedTopicUrl) => {
    const response = await api.patch(`/team/tasks/${taskId}/submit-website`, {
      website_id: websiteId,
      notes,
      suggested_topic_url: suggestedTopicUrl,
    });
    return response.data;
  },

  // Get available websites for selection
  getWebsites: async (filters = {}) => {
    const response = await api.get('/team/websites', { params: filters });
    return response.data;
  },

  // Add a new website 
  addWebsite: async (websiteData) => {
    const response = await api.post('/team/websites', websiteData);
    return response.data;
  },

  // ==================== ORDER NOTIFICATIONS (Push to Manager Flow) ====================
  // Get orders pushed by Manager
  getOrderNotifications: async () => {
    const response = await api.get('/team/order-notifications');
    return response.data;
  },

  // Get specific order for Push to Manager page
  getTaskForPush: async (taskId) => {
    const response = await api.get(`/team/order-notifications/${taskId}`);
    return response.data;
  },

  // Submit selected websites for an order (batch)
  submitWebsitesToManager: async (taskId, websiteIds, notes, websiteData = []) => {
    const response = await api.post(`/team/order-notifications/${taskId}/submit`, {
      website_ids: websiteIds,
      notes,
      website_data: websiteData
    });
    return response.data;
  },

  // ==================== COMPLETED ORDERS ====================
  getCompletedOrders: async () => {
    const response = await api.get('/team/completed-orders');
    return response.data;
  },

  getCompletedOrderDetail: async (id) => {
    const response = await api.get(`/team/completed-orders/${id}`);
    return response.data;
  },

  // Get order by ID for detail page
  getOrderById: async (id) => {
    const response = await api.get(`/team/tasks/${id}`);
    return response.data;
  },

  // ==================== REJECTED LINKS ====================
  getRejectedLinks: async () => {
    const response = await api.get('/team/rejected-links');
    return response.data;
  },

  // ==================== THREADS ====================
  getManagers: async () => {
    const response = await api.get('/team/managers');
    return response.data;
  },

  getThreads: async () => {
    const response = await api.get('/team/threads');
    return response.data;
  },

  createThread: async (data) => {
    const response = await api.post('/team/threads', data);
    return response.data;
  },

  getThreadMessages: async (threadId) => {
    const response = await api.get(`/team/threads/${threadId}/messages`);
    return response.data;
  },

  sendMessage: async (threadId, message) => {
    const response = await api.post(`/team/threads/${threadId}/messages`, { message });
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

  submitContent: async (taskId, websiteSubmissions) => {
    const response = await api.post(`/writer/tasks/${taskId}/submit-content`, {
      website_submissions: websiteSubmissions,
    });
    return response.data;
  },

  getDashboard: async () => {
    const response = await api.get('/writer/dashboard');
    return response.data;
  },

  getCompletedOrders: async () => {
    const response = await api.get('/writer/completed-orders');
    return response.data;
  },

  getCompletedOrderDetail: async (id) => {
    const response = await api.get(`/writer/completed-orders/${id}`);
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

  // WORKFLOW STEP 6: Submit live published URL
  submitLink: async (taskId, liveUrl) => {
    const response = await api.post(`/blogger/tasks/${taskId}/submit-link`, {
      live_url: liveUrl,
    });
    return response.data;
  },

  // Reject task assigned from Manager - sends back with rejection reason
  rejectTask: async (taskId, reason) => {
    const response = await api.post(`/blogger/tasks/${taskId}/reject`, {
      rejection_reason: reason,
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

  getInvoices: async (params = {}) => {
    const { page = 1, limit = 50 } = params;
    const response = await api.get(`/blogger/invoices?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Statistics
  getStats: async () => {
    const response = await api.get('/blogger/stats');
    return response.data;
  },

  // Sites Management
  getSites: async (params = {}) => {
    const { page = 1, limit = 50 } = params;
    const response = await api.get(`/blogger/sites?page=${page}&limit=${limit}`);
    return response.data;
  },

  addSite: async (siteData) => {
    const response = await api.post('/blogger/sites', siteData);
    return response.data;
  },

  updateSite: async (siteId, updates) => {
    const response = await api.put(`/blogger/sites/${siteId}`, updates);
    return response.data;
  },

  deleteSite: async (siteId) => {
    const response = await api.delete(`/blogger/sites/${siteId}`);
    return response.data;
  },

  // Notifications
  getNotifications: async () => {
    const response = await api.get('/blogger/notifications');
    return response.data;
  },

  markNotificationRead: async (notificationId) => {
    const response = await api.patch(`/blogger/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllNotificationsRead: async () => {
    const response = await api.patch('/blogger/notifications/read-all');
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

// ==================== Threads/Tickets APIs ====================

export const threadsAPI = {
  // Get thread stats
  getStats: async () => {
    const response = await api.get('/threads/stats');
    return response.data;
  },

  // Get all threads
  getThreads: async (filters = {}) => {
    const response = await api.get('/threads', { params: filters });
    return response.data;
  },

  // Get thread by ID with messages
  getThread: async (threadId) => {
    const response = await api.get(`/threads/${threadId}`);
    return response.data;
  },

  // Create new thread
  createThread: async (threadData) => {
    const response = await api.post('/threads', threadData);
    return response.data;
  },

  // Add message to thread
  addMessage: async (threadId, message, attachments = null) => {
    const response = await api.post(`/threads/${threadId}/messages`, {
      message,
      attachments
    });
    return response.data;
  },

  // Update thread status
  updateStatus: async (threadId, status) => {
    const response = await api.patch(`/threads/${threadId}/status`, { status });
    return response.data;
  },

  // Update thread details
  updateThread: async (threadId, updates) => {
    const response = await api.put(`/threads/${threadId}`, updates);
    return response.data;
  },

  // Delete thread
  deleteThread: async (threadId) => {
    const response = await api.delete(`/threads/${threadId}`);
    return response.data;
  },
};

// Export default axios instance for custom requests
export default api;
