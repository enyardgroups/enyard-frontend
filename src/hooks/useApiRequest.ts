import { useState, useCallback } from "react";
import { AxiosError } from "axios";
import { apiClient } from "@/services/apiClient";

/**
 * Hook for making API requests with loading and error handling
 */
export function useApiRequest<T = unknown>() {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const execute = useCallback(
		async (
			method: "get" | "post" | "put" | "patch" | "delete",
			url: string,
			payload?: any,
			config?: any
		) => {
			setLoading(true);
			setError(null);

			try {
				let response;
				switch (method) {
					case "get":
						response = await apiClient.get(url, config);
						break;
					case "post":
						response = await apiClient.post(url, payload, config);
						break;
					case "put":
						response = await apiClient.put(url, payload, config);
						break;
					case "patch":
						response = await apiClient.patch(url, payload, config);
						break;
					case "delete":
						response = await apiClient.delete(url, config);
						break;
				}

				const result = response.data;
				console.log('API Response:', result);
				if (!result.success) {
					throw new Error(result.message || "Request failed");
				}

				setData(result.data);
				// Return the full result object so frontend can access both data and pagination
				return result;
			} catch (err) {
				let errorMessage = "An error occurred";
				
				if (err instanceof AxiosError) {
					// Network errors (server not running, connection refused, etc.)
					if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK' || !err.response) {
						errorMessage = "Cannot connect to server. Please make sure the backend server is running on port 3011.";
					} else if (err.response?.data) {
						// Server responded with error
						errorMessage = err.response.data.message || 
						              err.response.data.error || 
						              err.message;
					} else {
						errorMessage = err.message;
					}
				} else if (err instanceof Error) {
					errorMessage = err.message;
				} else if (typeof err === 'object' && err !== null) {
					// Check for common error formats
					errorMessage = (err as any).message || (err as any).error || "An error occurred";
				}

				setError(errorMessage);
				// Attach the error message to the error object for easier access
				const enhancedError = err instanceof Error ? err : new Error(errorMessage);
				(enhancedError as any).message = errorMessage;
				(enhancedError as any).response = err instanceof AxiosError ? err.response : undefined;
				(enhancedError as any).code = err instanceof AxiosError ? err.code : undefined;
				throw enhancedError;
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	const get = useCallback(
		async (url: string, config?: any) => execute("get", url, undefined, config),
		[execute]
	);

	const post = useCallback(
		async (url: string, payload?: any, config?: any) =>
			execute("post", url, payload, config),
		[execute]
	);

	const put = useCallback(
		async (url: string, payload?: any, config?: any) =>
			execute("put", url, payload, config),
		[execute]
	);

	const patch = useCallback(
		async (url: string, payload?: any, config?: any) =>
			execute("patch", url, payload, config),
		[execute]
	);

	const del = useCallback(
		async (url: string, config?: any) =>
			execute("delete", url, undefined, config),
		[execute]
	);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	return {
		data,
		loading,
		error,
		get,
		post,
		put,
		patch,
		delete: del,
		clearError,
		reset: () => {
			setData(null);
			setError(null);
			setLoading(false);
		},
	};
}

export default useApiRequest;
