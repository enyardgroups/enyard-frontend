import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import { auth } from "@/firebase/config";

/**
 * API Client with Firebase Token Injection
 * Automatically attaches Firebase ID token to all requests
 */

/**
 * Get API Base URL based on environment
 * - In production: Uses VITE_API_BASE_URL or detects from current domain
 * - In development: Uses localhost
 */
const getApiBaseUrl = () => {
  // In development, always use localhost
  if (import.meta.env.DEV) {
    const envUrl = import.meta.env.VITE_API_BASE_URL;
    // If env URL is set to network IP, override it to localhost
    if (envUrl && envUrl.includes('10.0.0.243')) {
      console.warn('⚠️  Network IP detected in VITE_API_BASE_URL. Using localhost instead to avoid CORS issues.');
      return 'http://localhost:3011';
    }
    return envUrl || 'http://localhost:3011';
  }
  
  // In production
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  
  // If VITE_API_BASE_URL is set, use it
  if (envUrl) {
    return envUrl;
  }
  
  // Auto-detect API URL based on current domain
  const currentHost = window.location.hostname;
  const protocol = window.location.protocol;
  
  // Option 1: Use same domain with /api path (recommended - no subdomain needed)
  // This works if you're using a reverse proxy to serve /api from the same domain
  if (currentHost === 'enyard.in' || currentHost === 'www.enyard.in' || 
      currentHost === 'enyard.cloud' || currentHost === 'www.enyard.cloud') {
    // Use same domain with /api path (reverse proxy setup)
    const apiUrl = `${protocol}//${currentHost}`;
    console.log('🔗 Using same-domain API URL:', apiUrl);
    console.log('📝 Note: API requests will go to /api on the same domain');
    return apiUrl;
  }
  
  // Option 2: Use API subdomains (if you prefer separate subdomains)
  // Uncomment below and comment above if you want to use api.enyard.in/api.enyard.cloud
  /*
  if (currentHost === 'enyard.in' || currentHost === 'www.enyard.in') {
    const apiUrl = `${protocol}//api.enyard.in`;
    console.log('🔗 Auto-detected API URL for enyard.in:', apiUrl);
    return apiUrl;
  }
  
  if (currentHost === 'enyard.cloud' || currentHost === 'www.enyard.cloud') {
    const apiUrl = `${protocol}//api.enyard.cloud`;
    console.log('🔗 Auto-detected API URL for enyard.cloud:', apiUrl);
    return apiUrl;
  }
  */
  
  // Option 3: Single API server for both domains
  // If you want to use a single API server, set VITE_API_BASE_URL in .env
  // Example: VITE_API_BASE_URL=https://api.enyard.in
  
  // Fallback to localhost (shouldn't happen in production)
  console.warn('⚠️  Could not determine API URL, using localhost fallback');
  return 'http://localhost:3011';
};

const API_BASE_URL = getApiBaseUrl();

// Log API URL for debugging
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_BASE_URL);
}

/**
 * Create API client instance with Firebase token injection
 */
const createApiClient = (): AxiosInstance => {
	// Determine if API_BASE_URL already includes /api or if we need to add it
	// If using same-domain setup, API_BASE_URL will be the domain itself (e.g., https://enyard.in)
	// If using subdomain setup, API_BASE_URL might already include /api
	const baseURL = API_BASE_URL.endsWith('/api') 
		? API_BASE_URL 
		: `${API_BASE_URL}/api`;

	const client = axios.create({
		baseURL: baseURL,
		timeout: 30000, // Increased to 30 seconds for slow networks
		headers: {
			"Content-Type": "application/json",
		},
	});

	/**
	 * Request interceptor: Inject JWT token from localStorage
	 */
	client.interceptors.request.use(
		async (config) => {
			try {
				// Use JWT token from localStorage (set by backend)
				const token = localStorage.getItem("auth_token");
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
			} catch (error) {
				console.error("Failed to get auth token:", error);
				// Continue anyway - endpoint may not require auth
			}
			return config;
		},
		(error) => Promise.reject(error)
	);

	/**
	 * Response interceptor: Handle common API errors
	 */
	client.interceptors.response.use(
		(response) => response,
		(error: AxiosError) => {
			if (error.response?.status === 401) {
				// Token expired or invalid - clear auth state
				console.warn("Unauthorized: Token may have expired");
				// You can dispatch logout action here if using Redux/Context
			}

			if (error.response?.status === 403) {
				console.warn("Forbidden: Insufficient permissions");
			}

			return Promise.reject(error);
		}
	);

	return client;
};

export const apiClient = createApiClient();

/**
 * Type-safe API response wrapper
 */
export interface ApiResponse<T = unknown> {
	success: boolean;
	message?: string;
	data?: T;
	error?: string;
}

/**
 * GET request helper
 */
export async function apiGet<T = unknown>(
	url: string,
	config?: any
): Promise<T> {
	try {
		const response = await apiClient.get<ApiResponse<T>>(url, config);
		if (!response.data.success) {
			throw new Error(response.data.message || "API request failed");
		}
		return response.data.data as T;
	} catch (error) {
		throw handleApiError(error);
	}
}

/**
 * POST request helper
 */
export async function apiPost<T = unknown>(
	url: string,
	data?: any,
	config?: any
): Promise<T> {
	try {
		const response = await apiClient.post<ApiResponse<T>>(url, data, config);
		if (!response.data.success) {
			throw new Error(response.data.message || "API request failed");
		}
		return response.data.data as T;
	} catch (error) {
		throw handleApiError(error);
	}
}

/**
 * PUT request helper
 */
export async function apiPut<T = unknown>(
	url: string,
	data?: any,
	config?: any
): Promise<T> {
	try {
		const response = await apiClient.put<ApiResponse<T>>(url, data, config);
		if (!response.data.success) {
			throw new Error(response.data.message || "API request failed");
		}
		return response.data.data as T;
	} catch (error) {
		throw handleApiError(error);
	}
}

/**
 * PATCH request helper
 */
export async function apiPatch<T = unknown>(
	url: string,
	data?: any,
	config?: any
): Promise<T> {
	try {
		const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
		if (!response.data.success) {
			throw new Error(response.data.message || "API request failed");
		}
		return response.data.data as T;
	} catch (error) {
		throw handleApiError(error);
	}
}

/**
 * DELETE request helper
 */
export async function apiDelete<T = unknown>(
	url: string,
	config?: any
): Promise<T> {
	try {
		const response = await apiClient.delete<ApiResponse<T>>(url, config);
		if (!response.data.success) {
			throw new Error(response.data.message || "API request failed");
		}
		return response.data.data as T;
	} catch (error) {
		throw handleApiError(error);
	}
}

/**
 * Handle API errors consistently
 */
function handleApiError(error: unknown): Error {
	if (axios.isAxiosError(error)) {
		const status = error.response?.status;
		const data = error.response?.data as ApiResponse | undefined;

		// Handle API error response
		if (data?.message) {
			return new Error(data.message);
		}

		// Handle HTTP status codes
		switch (status) {
			case 400:
				return new Error("Invalid request. Please check your input.");
			case 401:
				return new Error("Unauthorized. Please sign in again.");
			case 403:
				return new Error(
					"Forbidden. You don't have permission to access this."
				);
			case 404:
				return new Error("Resource not found.");
			case 409:
				return new Error("Conflict. Resource already exists.");
			case 500:
				return new Error("Server error. Please try again later.");
			case 503:
				return new Error("Service unavailable. Please try again later.");
			default:
				return new Error(
					error.message || "An error occurred while making the request"
				);
		}
	}

	if (error instanceof Error) {
		return error;
	}

	return new Error("An unknown error occurred");
}

export default apiClient;
