import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { LAMBDA_URL } from "@/utils/constants";

export const logout = async () => {
    const response = await axiosInstance.post(`/auth/logout`);
    return response.data;
};

export const login = async ({
    email,
    password,
}: {
    email: string;
    password: string;
}) => {
    const response = await axios.post(`${LAMBDA_URL}/auth/login`, {
        email,
        password,
    }, { withCredentials: true });

    return response.data;
};

// password reset

export const resetPassword = async (email: string) => {
    const response = await axios.post(`${LAMBDA_URL}/password-reset/request`, {
        email,
    }, { withCredentials: true });

    return response.data;
};


// confirm reset password
export const passwordResetConfirm = async (token: string, password: string) => {
    const response = await axios.post(`${LAMBDA_URL}/password-reset/confirm`, {
        token,
        password,
    }, { withCredentials: true });

    return response.data;
};