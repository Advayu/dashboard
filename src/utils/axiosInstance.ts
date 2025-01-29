"use client"
import axios, { AxiosInstance } from 'axios';
import { LAMBDA_URL } from './constants';
import { toast } from '@/hooks/use-toast';

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
    baseURL: LAMBDA_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true,
});

// Function to set up interceptors

const setupInterceptors = (axiosInstance: AxiosInstance) => {
    axiosInstance.interceptors.response.use(
        response => response,
        error => {
            if (typeof window !== 'undefined') {
                if (error.response?.status === 401) {
                    console.error("Unauthorized error, redirecting to /auth", error.response);
                    toast({
                        variant: "destructive",
                        title: "Unauthorized",
                        description: "Unauthorized access. Please log in again.",
                    })
                    window.location.href = '/auth'; // Redirect to login page
                } else {
                    console.error("API error:", error.response);
                }
            }
            return Promise.reject(error);
        }
    );
};

// Set up interceptors only on the client side
if (typeof window !== 'undefined') {
    setupInterceptors(axiosInstance);
}

export default axiosInstance;