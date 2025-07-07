
import axiosInstance from "@/utils/axiosInstance";
import { LAMBDA_URL } from "@/utils/constants";


export const getOffers = async (brand_id: string) => {
    const response = await axiosInstance.get(`/offers`, {
        params: { brand_id },
    });
    return response.data;
};


export const getOffer = async (id: string) => {
    const response = await axiosInstance.get(`/offers/${id}`);
    return response.data;
};

export const getOfferByOutletId = async (id: string) => {
    const response = await axiosInstance.get(`/offers?outlet_id=${id}`);
    return response.data;
};



export const updateOffer = async (id: string, data: any) => {
    const response = await axiosInstance.put(`/offers/${id}`, data);
    return response.data;
};

export const deleteOffer = async (id: string) => {
    const response = await axiosInstance.delete(`/offers/${id}`);
    return response.data;
};

export const createOffer = async (data: any) => {
    console.log("offer data", data)
    const response = await axiosInstance.post(`/offers`, data);
    return response.data;
};