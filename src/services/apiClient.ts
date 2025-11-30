import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import { auth } from "@/firebase/config";

/**
 * API Client with Firebase Token Injection
 * Automatically attaches Firebase ID token to all requests
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3011";

/**
 * Create API client instance with Firebase token injection
 */
const createApiClient = (): AxiosInstance => {
	const client = axios.create({
		baseURL: `${API_BASE_URL}/api`,
		timeout: 10000,
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
