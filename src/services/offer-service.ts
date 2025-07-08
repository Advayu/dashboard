import axiosInstance from "@/utils/axiosInstance";
import { LAMBDA_URL } from "@/utils/constants";

// 1. Get offers with pagination
export const getOffers = async (
    brand_id: string,
    limit: number = 10,
    page: number = 1
) => {
    const response = await axiosInstance.get(`/offers`, {
        params: {
            brand_id,
            limit,
            page,
        },
    });
    return response.data;
};

// 2. Get a single offer by ID
export const getOffer = async (id: string) => {
    const response = await axiosInstance.get(`/offers/${id}`);
    return response.data;
};

// 3. Get offer(s) by outlet ID (with optional pagination)
export const getOfferByOutletId = async (
    outlet_id: string,
    limit: number = 10,
    page: number = 1
) => {
    const response = await axiosInstance.get(`/offers`, {
        params: {
            outlet_id,
            limit,
            page,
        },
    });
    return response.data;
};

// 4. Update an offer
export const updateOffer = async (id: string, data: any) => {
    const response = await axiosInstance.patch(`/offers/${id}`, data);
    return response.data;
};

// 5. Delete an offer
export const deleteOffer = async (id: string) => {
    const response = await axiosInstance.delete(`/offers/${id}`);
    return response.data;
};

// 6. Create an offer
export const createOffer = async (data: any) => {
    const response = await axiosInstance.post(`/offers`, data);
    return response.data;
};
