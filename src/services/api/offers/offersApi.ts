import { generateUniqueUUID } from "@/functions/function";
import { LAMBDA_URL } from "@/utils/constants";
import axiosInstance from "@/utils/axiosInstance";

// draft offerdetails by signing is_active: false
export const saveOfferAsDraft = async (
    offerDetail: any,
    outletId: string,
    brandId: string
) => {
    console.log("Offer detail for launch:", offerDetail);

    //Todo: get brand outlet id and brand id from the redux
    const data = {
        id: generateUniqueUUID(),
        title: offerDetail.title,
        brand_id: brandId,
        outlet_id: outletId,
        code: offerDetail.discountCode || "",
        discount_type: offerDetail.discountType || "",
        discount_value: Number(offerDetail.discountValue) || 0,
        min_order_value: Number(offerDetail.minOrderValue) || 0,
        max_discount_value: Number(offerDetail.maxDiscountValue) || 0,
        applicable_days: offerDetail.applicableDays || [],
        terms_conditions: "",
        start_date: offerDetail.startDate || null,
        end_date: offerDetail.endDate || null,
        total_limit: Number(offerDetail.totalLimit) || 0,
        is_active: false,
    };

    try {
        const response = await axiosInstance.post(`${LAMBDA_URL}/offers`, data, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });

        console.log("Response:", response);

        return response.status;
    } catch (error: any) {
        console.error("Error:", error.response?.data || error.message);
    }
};

export const getDetailsByBrandId = async (brandId: string) => {
    try {
        const response = await axiosInstance.get(
            `${LAMBDA_URL}/v1/brands/${brandId}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        return;
    }
};


// get outlet data by brand id 
export const getOutletDataByBrandId = async (brandId: string) => {
    try {
        const response = await axiosInstance.get(
            `${LAMBDA_URL}/v1/outlets?brand_id=${brandId}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};
