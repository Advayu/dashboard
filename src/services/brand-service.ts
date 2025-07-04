import axios from "axios";
import { LAMBDA_URL } from "@/utils/constants";

// Create a new brand
export const createBrand = async (brandData: any) => {
    const response = await axios.post(`${LAMBDA_URL}/v1/brands`, brandData, {
        withCredentials: true,
    });
    return response.data;
};

// Update an existing brand
/* need to remove logo  and banner url from brand data */
export const updateBrand = async (brandId: string, brandData: any) => {
    const response = await axios.put(`${LAMBDA_URL}/v1/brands/${brandId}`, { ...brandData }, {
        withCredentials: true,
    });
    return response.data;
};

// Delete a brand
export const deleteBrand = async (brandId: string) => {
    const response = await axios.delete(`${LAMBDA_URL}/v1/brands/${brandId}`, {
        withCredentials: true,
    });
    return response.data;
};

export const getBrand = async (id: string) => {
    try {
        const response = await axios.get(`${LAMBDA_URL}/v1/brands/${id}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching brand:", error);
        throw error;
    }
};

