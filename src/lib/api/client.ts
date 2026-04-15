import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3031";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

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
