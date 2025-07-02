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
    });

    return response.data;
};
