// lib/axios.js
import { addToast } from '@heroui/toast';
import axios from 'axios';
import Cookies from 'js-cookie';

const token_name = process.env.NEXT_PUBLIC_TOKEN || 'eas-token';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get(token_name); // or whatever key you're using
    if (token) {
      console.log('----axios token-----', token)
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor (optional)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove(token_name);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    const parsedError = error.response?.data || error.message || 'An unknown error occurred';
    addToast({
      title: `${parsedError.error || ''}`,
      description: `${parsedError.statusCode || ''}, ${parsedError.message || 'An unknown error occurred'}`,
      color: "danger",
    })

    return Promise.reject(parsedError);
  }
);

export default axiosInstance;
