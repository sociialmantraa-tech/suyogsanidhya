/**
 * Admin API service layer with token headers
 */

const getApiBase = () => {
    if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }
    if (typeof process !== 'undefined' && process.env.VITE_API_URL) {
        return process.env.VITE_API_URL;
    }
    if (typeof window !== 'undefined' && (window.location.port === '3001' || window.location.port === '5174')) {
        return 'http://localhost/astrologer/api';
    }
    return '/api';
};

const API_BASE = getApiBase();

export async function adminApiFetch(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}/${endpoint.replace(/^\//, '')}`;
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    
    const headers = {
        ...options.headers
    };

    // Attach token if exists
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Set JSON content type unless handling FormData (file uploads)
    if (typeof FormData !== 'undefined' && !(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const fetchOptions = {
        ...options,
        headers
    };

    if (fetchOptions.body && typeof fetchOptions.body === 'object' && typeof FormData !== 'undefined' && !(fetchOptions.body instanceof FormData)) {
        fetchOptions.body = JSON.stringify(fetchOptions.body);
    }

    try {
        const response = await fetch(url, fetchOptions);
        
        if (response.status === 204) {
            return null;
        }

        let data = {};
        const text = await response.text();
        try {
            data = text ? JSON.parse(text) : {};
        } catch {
            data = { error: text || `HTTP error! status: ${response.status}` };
        }

        if (!response.ok) {
            // Handle automatic logout on token expiration
            if (response.status === 401 && !endpoint.includes('auth/login')) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('admin_token');
                    localStorage.removeItem('admin_user');
                    window.location.href = '/login';
                }
            }
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`Admin API Error [${endpoint}]:`, error);
        throw error;
    }
}

export const adminApi = {
    get: (endpoint, options = {}) => adminApiFetch(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options = {}) => adminApiFetch(endpoint, { ...options, method: 'POST', body }),
    put: (endpoint, body, options = {}) => adminApiFetch(endpoint, { ...options, method: 'PUT', body }),
    delete: (endpoint, options = {}) => adminApiFetch(endpoint, { ...options, method: 'DELETE' })
};
