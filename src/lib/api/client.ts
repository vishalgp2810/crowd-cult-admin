import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getBearerToken, setBearerToken, clearBearerToken } from "./authToken";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3031";

let authRedirectInProgress = false;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for HttpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Request Interceptor ---
apiClient.interceptors.request.use((config) => {
  const token = getBearerToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  /** Default JSON Content-Type breaks FormData boundary; let the runtime set multipart + boundary. */
  if (config.data instanceof FormData && config.headers) {
    config.headers.delete("Content-Type");
  }
  return config;
});

// --- Response Interceptor for Auto Refresh ---
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Catch 401 Unauthorized errors (except for the refresh/login endpoints themselves)
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !(originalRequest.url?.includes("/auth/refresh") || originalRequest.url?.includes("/auth/login"))
    ) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        const refreshRes = await axios.post<{ successResponse?: { data?: { token?: string } } }>(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = refreshRes.data?.successResponse?.data?.token;

        if (!newToken) {
          throw new Error("No token returned from refresh");
        }

        // Set new token in memory
        setBearerToken(newToken);
        processQueue(null, newToken);

        // Replay the original request with the brand new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearBearerToken();

        // One hard redirect: avoid a storm of failed refresh replay calling this in a loop.
        if (typeof window !== "undefined" && !authRedirectInProgress) {
          const path = window.location.pathname;
          if (path !== "/auth" && path !== "/") {
            authRedirectInProgress = true;
            window.location.assign("/auth");
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export interface ApiEnvelope<T> {
  statusCode: number;
  success: boolean;
  message: string;
  successResponse?: {
    data: T;
  };
  failResponse?: {
    data: unknown;
  };
}

export const unwrapApiResponse = <T>(response: { data: ApiEnvelope<T> }): T => {
  if (!response.data?.success || !response.data.successResponse) {
    throw new Error(response.data?.message || "Request failed");
  }
  return response.data.successResponse.data;
};
