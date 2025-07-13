"use client";
import axios from "axios";
import { LAMBDA_URL } from "./constants";

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: LAMBDA_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Add a response interceptor to handle 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle 401 error: unauthorized
      console.warn("Unauthorized access - maybe redirect to login?");
      window.location.href = "/login";
    }

    // Pass other errors down the chain
    return Promise.reject(error);
  }
);

export default axiosInstance;
