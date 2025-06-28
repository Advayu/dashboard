
import { useImageUpload } from "@/hooks/use-image";
import axiosInstance from "@/utils/axiosInstance";
import { LAMBDA_URL, OUTLET_BUCKET_NAME } from "@/utils/constants";


/* Todo: need to look into this */
export const createOutlet = async (brand_id: string, data: any) => {
    const URL = `${LAMBDA_URL}/v1/outlets`;
    const response = await axiosInstance.post(URL, { ...data, brand_id: brand_id });

    return response.data;
};

export const getOutlet = async (id: string) => {
    const URL = `${LAMBDA_URL}/v1/outlets/${id}`;
    const response = await axiosInstance.get(URL);

    return response.data;
};

export const updateOutlet = async (id: string, data: any) => {
    const URL = `${LAMBDA_URL}/v1/outlets/${id}`;
    const response = await axiosInstance.patch(URL, data);

    return response.data;
};

export const deleteOutlet = async (id: string) => {
    const URL = `${LAMBDA_URL}/v1/outlets/${id}`;
    const response = await axiosInstance.delete(URL);

    return response.data;
};

export const getOutlets = async (brand_id: string) => {
    const URL = `${LAMBDA_URL}/v1/outlets?brand_id=${brand_id}`;
    const response = await axiosInstance.get(URL);

    return response.data;
};