import axiosInstance from "@/utils/axiosInstance";
import { LAMBDA_URL } from "@/utils/constants";

// 1. Get offers with pagination and filters
export const getOffers = async ({ page, limit, brand_id, outlet_id, start_date, end_date, status }: any) => {
    const response = await axiosInstance.get(`/offers`, {
        params: {
            brand_id,
            limit,
            page,
            outlet_id,
            start_date,
            end_date,
            status
        },
    });


    return response.data;

}










// 2. Get a single offer by ID
export const getOffer = async (id: string) => {
    const response = await axiosInstance.get(`/offers/${id}`);
    return response.data;
};

// 3. Get offer(s) by outlet ID (with optional pagination)
export const getOfferByOutletId = async (
    outlet_id: string,
    limit: number = 4,
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

// 7. get offer using parama
export async function fetchOffers(params: any) {
    const response = await axiosInstance.get('/offers', params);
    return response.data;
}

// 8. get offer analytics

export const getOfferAnalytics = async (
    id: string,
    start?: string,
    end?: string
) => {
    const params: Record<string, string> = {};
    if (start) params.start = start;
    if (end) params.end = end;

    const response = await axiosInstance.get(`/offers/${id}/analytics`, {
        params,
    });

    return response.data;
};