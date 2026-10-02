import { API_BASE_URL } from '../config/api';

/**
 * Custom Error class representing a meaningful backend or client-side request failure
 */
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

interface ApiOptions extends RequestInit {
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * Shared API Client wrapper
 */
export async function apiFetch<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  // Format target URL
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_BASE_URL}/${endpoint.replace(/^\//, '')}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const fetchOptions: RequestInit = {
    ...options,
    headers
  };

  // Setup body serialization
  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  // Setup abort timeout (defaults to 5 seconds)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, options.timeout || 5000);

  // Link signal if not already provided
  if (!fetchOptions.signal) {
    fetchOptions.signal = controller.signal;
  }

  if (import.meta.env.DEV) {
    console.log(`[API Request] ${fetchOptions.method || 'GET'} -> ${url}`);
  }

  try {
    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);

    // Handle empty content response
    if (response.status === 204) {
      return null as unknown as T;
    }

    let responseData: any = null;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      // Safe fallback if JSON parsing is not available
      try {
        responseData = text ? JSON.parse(text) : null;
      } catch {
        responseData = { message: text };
      }
    }

    if (!response.ok) {
      const errMsg = responseData?.error || responseData?.message || `HTTP Request failed with status ${response.status}`;
      throw new ApiError(errMsg, response.status, responseData);
    }

    if (import.meta.env.DEV) {
      console.log(`[API Response] Success ->`, responseData);
    }

    return responseData as T;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new ApiError('Request timed out after 5 seconds', 408, null);
    }
    if (import.meta.env.DEV) {
      console.error(`[API Error] Request failed on [${endpoint}]:`, error);
    }
    throw error;
  }
}

export const api = {
  get: <T>(endpoint: string, options: ApiOptions = {}) => apiFetch<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body: any, options: ApiOptions = {}) => apiFetch<T>(endpoint, { ...options, method: 'POST', body }),
  put: <T>(endpoint: string, body: any, options: ApiOptions = {}) => apiFetch<T>(endpoint, { ...options, method: 'PUT', body }),
  delete: <T>(endpoint: string, options: ApiOptions = {}) => apiFetch<T>(endpoint, { ...options, method: 'DELETE' })
};
