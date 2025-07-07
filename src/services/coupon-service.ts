import axiosInstance from "@/utils/axiosInstance";


export const createCoupon = async (data: any) => {

    console.log("coupon data", data)
    const response = await axiosInstance.post(`/coupons`, data);
    return response.data;
};

export const getCoupons = async (brand_id: string) => {
    const response = await axiosInstance.get(`/coupons`, {
        params: { brand_id },
    });
    return response.data;
};

export const getCoupon = async (id: string) => {
    const response = await axiosInstance.get(`/coupons/${id}`);
    return response.data;
};

export const getCouponByOfferId = async (id: string) => {
    const response = await axiosInstance.get(`/coupons?offer_id=${id}`);
    return response.data;
};

export const updateCoupon = async (id: string, data: any) => {
    const response = await axiosInstance.put(`/coupons/${id}`, data);
    return response.data;
};

export const deleteCoupon = async (id: string) => {
    const response = await axiosInstance.delete(`/coupons/${id}`);
    return response.data;
};

