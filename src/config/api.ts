// API Configuration
export const API_CONFIG = {
  // For development
  development: {
    baseURL: 'http://localhost:3001/api'
  },
  // For production - updated with your live backend URL
  production: {
    baseURL: 'https://chatbot-widget-backend-uqa3.onrender.com/api'
  }
};

// Get the current environment
const isDevelopment = import.meta.env.DEV;

// Export the current API base URL
export const API_BASE_URL = isDevelopment 
  ? API_CONFIG.development.baseURL 
  : API_CONFIG.production.baseURL;

// API endpoints
export const API_ENDPOINTS = {
  adminLogin: `${API_BASE_URL}/admin/login`,
  adminConfig: `${API_BASE_URL}/admin/config`,
  widgetConfig: `${API_BASE_URL}/widget/config`,
  chat: `${API_BASE_URL}/chat`
};