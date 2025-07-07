import { generateOfferTitle } from "../generateOfferTitle";

// src/utils/offerSubmission.ts
export const handleOfferSubmission = async (
    data: any,
    brandId: string,
    createOffer: any,
    createCoupon: any
) => {
    for (const outlet_id of data.outletIds) {
        const offer_payload: any = {
            brand_id: brandId,
            offer_type: data.offer_type,
            discount_type: data.discountType,
            start_date: data.startDate + "T23:59:59.000Z",
            end_date: data.endDate + "T23:59:59.000Z",
            applicable_days: data.applicableDays,
            max_per_user: Number(data.max_per_user),
            total_limit: Number(data.total_limit),
            min_order_value: Number(data.min_order_value),
            terms_conditions: "terms and conditions", // change later
            title: generateOfferTitle(data),
            outlet_id: outlet_id,
            is_active: true,
        };

        if (offer_payload.discount_type === "PERCENTAGE") {
            offer_payload["discount_percent"] = Number(data.discount_percent);
            offer_payload["discount_value"] = Number(data.max_discount_value);
            offer_payload["max_discount_value"] = Number(data.max_discount_value);
        } else {
            offer_payload["discount_value"] = Number(data.discount_value);
        }

        try {
            // Step 1: Create the offer
            const offerResponse = await createOffer(offer_payload);

            const offer_id = offerResponse?.id;
            if (!offer_id) {
                console.warn("Failed to create offer for outlet:", outlet_id);
                continue;
            }

            // Step 2: Create coupons only if offer type is COUPON_CODE
            if (offerResponse.offer_type === "COUPON_CODE") {
                var coupon_payload: any = {
                    offer_id: offer_id,
                    expires_at: data.endDate + "T23:59:59.000Z",
                };
                if (data.coupon_type === "fixed_code") {
                    for (const coupon of data.coupon_code) {
                        coupon_payload["code"] = coupon;
                        const couponResponse = await createCoupon(coupon_payload);
                        console.log("Coupon created:", couponResponse);
                    }
                } else {
                    for (let i = 0; i < data.no_of_coupons; i++) {
                        coupon_payload["code"] =
                            `COUPON-${Math.random().toString(36).substring(2, 15)}`;
                        const couponResponse = await createCoupon(coupon_payload);
                        console.log("Coupon created:", couponResponse);
                    }
                }
            }
        } catch (error) {
            console.error(`Failed to process outlet ${outlet_id}:`, error);
        }
    }
};

const createCoupons = async (data: any, offerId: string, createCoupon: any) => {
    const basePayload = {
        offer_id: offerId,
        expires_at: `${data.endDate}T23:59:59.000Z`,
    };

    if (data.coupon_type === "fixed_code") {
        for (const code of data.coupon_code) {
            await createCoupon.mutateAsync({ ...basePayload, code });
        }
    } else {
        for (let i = 0; i < data.no_of_coupons; i++) {
            const code = `COUPON-${Math.random().toString(36).substring(2, 15)}`;
            await createCoupon.mutateAsync({ ...basePayload, code });
        }
    }
};
