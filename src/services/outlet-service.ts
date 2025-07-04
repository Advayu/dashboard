
import axiosInstance from "@/utils/axiosInstance";
import { sanitizeOutletPayload } from "@/utils/outlet-utils";



/* Todo: need to look into this */
export const createOutlet = async (brand_id: string, data: any) => {
    const normalizedBrandId = brand_id.replace(/"/g, "");
    const URL = `/v1/outlets`;

    const payload = sanitizeOutletPayload(data, normalizedBrandId);

    const response = await axiosInstance.post(URL, payload);
    return response.data;
};

export const getOutlet = async (id: string) => {
    const URL = `/v1/outlets/${id}`;
    const response = await axiosInstance.get(URL);

    return response.data;
};

export const updateOutlet = async (id: string, data: any) => {
    const URL = `/v1/outlets/${id}`;
    const payload = sanitizeOutletPayload(data); // No brand_id needed here

    const response = await axiosInstance.patch(URL, payload);
    return response.data;
};

export const deleteOutlet = async (id: string) => {
    const URL = `/v1/outlets/${id}`;
    const response = await axiosInstance.delete(URL);

    return response.data;
};

export const getOutlets = async (brand_id: string) => {
    brand_id = brand_id.replace(/"/g, "");

    const URL = `/v1/outlets?brand_id=${brand_id}`;
    const response = await axiosInstance.get(URL);
    console.log("response outlets", response)
    return response.data;
};