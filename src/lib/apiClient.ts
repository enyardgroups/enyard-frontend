// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3011";
const API_VERSION = "/api";

interface CustomRequestConfig {
  url: string;
  method: string;
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, string>;
}

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}${API_VERSION}`;
  }

  protected async request<T>(config: CustomRequestConfig): Promise<T> {
    const { url, method, params, data, headers: customHeaders } = config;

    const fullUrl = new URL(`${this.baseUrl}${url}`);
    if (params) {
      Object.keys(params).forEach((key) =>
        fullUrl.searchParams.append(key, params[key]),
      );
    }

    const headers = new Headers(customHeaders || {});

    const token = localStorage.getItem("auth_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (data) {
      if (data instanceof FormData) {
        options.body = data;
        // Let browser set content-type for FormData
        headers.delete("Content-Type");
      } else {
        if (!headers.has("Content-Type")) {
          headers.set("Content-Type", "application/json");
        }
        options.body = JSON.stringify(data);
      }
    }

    try {
      const response = await fetch(fullUrl.toString(), options);

      if (response.status === 401) {
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: response.statusText }));
        let errorMessage = "An error occurred";
        if (errorData) {
          if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (typeof errorData === "string") {
            errorMessage = errorData;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        }
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        (error as any).response = { data: errorData, status: response.status };
        throw error;
      }

      if (
        response.status === 204 ||
        response.headers.get("Content-Length") === "0"
      ) {
        return null as T;
      }

      const responseData = await response.json();
      return responseData;
    } catch (error: any) {
      if (error.status) {
        // rethrow custom error
        throw error;
      }
      // Network error or other fetch-related error
      const enhancedError = new Error(
        error.message || "A network error occurred.",
      );
      throw enhancedError;
    }
  }

  // GET request
  protected async get<T>(url: string, params?: any): Promise<T> {
    return this.request({
      method: "GET",
      url,
      params,
    });
  }

  // POST request
  protected async post<T>(url: string, data?: any): Promise<T> {
    return this.request({
      method: "POST",
      url,
      data,
    });
  }

  // PUT request
  protected async put<T>(url: string, data?: any): Promise<T> {
    return this.request({
      method: "PUT",
      url,
      data,
    });
  }

  // DELETE request
  protected async delete<T>(url: string, data?: any): Promise<T> {
    return this.request({
      method: "DELETE",
      url,
      data,
    });
  }

  // Health check
  async getHealthStatus(): Promise<{
    status: string;
    timestamp: string;
    version: string;
    database: string;
  }> {
    return this.get("/health");
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
