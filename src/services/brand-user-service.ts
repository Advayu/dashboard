// services/brandService.ts

import axiosInstance from "@/utils/axiosInstance";
import { LAMBDA_URL } from "@/utils/constants";

export interface BrandUserUpdateInput {
    id: string,
    name: string;
    email: string;
    phone: string;
    password?: string;
}

export interface BrandUserResponse {
    id: string;
    name: string;
    email: string;
    phone: string;
    // Add more fields based on your API response shape
}


export const getBrandUser = async (brandUserId: string): Promise<any> => {
    const apiUrl = `${LAMBDA_URL}/brand-users/${brandUserId}`;
    const response = await axiosInstance.get(apiUrl);

    return response.data;
};








export const putBrandUser = async (
    data: BrandUserUpdateInput,
    brandId: string
): Promise<BrandUserResponse> => {
    const apiUrl = `${LAMBDA_URL}/brand-users/${brandId}`;

    const requestData: Record<string, any> = {
        name: data.name,
        email: data.email,
        phone: data.phone,
    };

    if (data.password) {
        requestData.password_hash = data.password;
        requestData.is_password_changed = true;
    }

    const response = await axiosInstance.put(apiUrl, requestData, {
    });

    return response.data as BrandUserResponse;
};



