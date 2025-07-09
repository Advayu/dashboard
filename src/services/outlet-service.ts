
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

    return response.data;
};

interface TrafficParams {
    brand_id: string;
    outlet_ids?: string[]; // optional
    fy?: string;
    start?: string;
    end?: string;
}

export const getRedemptionTraffic = async ({
    brand_id,
    outlet_ids = [],
    fy,
    start,
    end,
}: TrafficParams) => {
    const params = new URLSearchParams();
    params.append("brand_id", brand_id);

    outlet_ids.forEach((id) => {
        if (id) params.append("outlet_ids", id);
    });

    if (fy) params.append("fy", fy);
    if (start) params.append("start", start);
    if (end) params.append("end", end);

    const response = await axiosInstance.get(
        `/redemption/traffic?${params.toString()}`,
        {
            headers: {
                accept: "*/*",
            },
        }
    );

    return response.data;
};