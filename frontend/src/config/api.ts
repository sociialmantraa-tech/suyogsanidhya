// Centralized API configuration
const isLocalDev = window.location.port === '5173';
const defaultBaseUrl = isLocalDev 
  ? 'http://localhost/astrologer/api' 
  : '/api';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || defaultBaseUrl;
