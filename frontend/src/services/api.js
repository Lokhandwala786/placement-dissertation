// API service for connecting React with Django backend
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include CSRF token
api.interceptors.request.use(
  (config) => {
    // Get CSRF token from cookies
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    
    // Include session credentials
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      window.location.href = '/accounts/login/';
    }
    return Promise.reject(error);
  }
);

// Placement API functions
export const placementAPI = {
  // Get all placements for current user
  getPlacements: () => api.get('/placements/'),
  
  // Get placement by ID
  getPlacement: (id) => api.get(`/placements/${id}/`),
  
  // Create new placement request
  createPlacement: (data) => api.post('/placements/', data),
  
  // Update placement
  updatePlacement: (id, data) => api.patch(`/placements/${id}/`, data),
  
  // Approve placement (for tutors)
  approvePlacement: (id) => api.post(`/placements/${id}/approve/`),
  
  // Reject placement (for tutors)
  rejectPlacement: (id, comments) => api.post(`/placements/${id}/reject/`, { comments }),
  
  // Get placement statistics
  getStatistics: () => api.get('/placements/statistics/'),
};

// Messages API functions
export const messageAPI = {
  // Get inbox messages
  getInbox: () => api.get('/messages/inbox/'),
  
  // Get sent messages
  getSent: () => api.get('/messages/sent/'),
  
  // Create new message
  createMessage: (data) => api.post('/messages/', data),
  
  // Mark message as read
  markAsRead: (id) => api.post(`/messages/${id}/mark_read/`),
  
  // Get unread count
  getUnreadCount: () => api.get('/messages/unread_count/'),
  
  // Mark all as read
  markAllAsRead: () => api.post('/messages/mark_all_read/'),
  
  // Delete message
  deleteMessage: (id) => api.delete(`/messages/${id}/`),
};

// Visits API functions
export const visitAPI = {
  // Get all visits
  getVisits: () => api.get('/visits/'),
  
  // Create visit
  createVisit: (data) => api.post('/visits/', data),
  
  // Get upcoming visits
  getUpcomingVisits: () => api.get('/visits/upcoming/'),
  
  // Get calendar data
  getCalendarData: () => api.get('/visits/calendar_data/'),
  
  // Mark visit as completed
  markCompleted: (id) => api.post(`/visits/${id}/mark_completed/`),
};

// Users API functions
export const userAPI = {
  // Get users for message recipients
  getUsers: () => api.get('/users/'),
};

// Reports API functions
export const reportAPI = {
  // Get reports
  getReports: () => api.get('/reports/'),
  
  // Create report
  createReport: (data) => api.post('/reports/', data),
};

export default api;
