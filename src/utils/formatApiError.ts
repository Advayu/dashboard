// utils/formatApiError.ts
import axios, { AxiosError } from 'axios';

/**
 * Formats an error object (especially Axios errors) into a user-friendly string.
 */
export const formatApiError = (error: unknown): string => {
    // Handle Axios errors
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>;

        // Server responded with a status code outside the 2xx range
        if (axiosError.response) {
            const { status, data } = axiosError.response;

            // Common backend error structures
            if (typeof data === 'string') {
                return data; // e.g. plain text error message
            }

            if (data?.message) {
                return data.message; // standard error object with message
            }

            if (data?.error?.message) {
                return data.error.message; // nested error object
            }

            return `Request failed with status ${status}`;
        }

        // No response received (e.g. network error, timeout)
        if (axiosError.request) {
            return 'No response from server. Please check your network connection.';
        }

        // Something happened in setting up the request
        return axiosError.message || 'An unknown error occurred during the request.';
    }

    // Handle non-Axios or unknown errors
    if (error instanceof Error) {
        return error.message;
    }

    return 'An unexpected error occurred. Please try again.';
};
