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





export default axiosInstance;

