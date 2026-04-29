import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from './types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth_token='))
        ?.split('=')[1];

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        'An error occurred';

      return Promise.reject(new Error(message));
    }

    if (error.request) {
      return Promise.reject(
        new Error('Network error. Please check your connection.'),
      );
    }

    return Promise.reject(error);
  },
);

export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/students/register',
  VERIFY_OTP: '/students/verify-otp',
  RESEND_OTP: '/students/resend-otp',
};
