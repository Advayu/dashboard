type OfferDetails = {
    discountType: string;
    discountValue?: string;
    minOrderValue?: string;
    maxOrderValue?: string;
    maxDiscountValue?: string;

};

export const generateOfferTitle = (offerDetail: any): string => {
    const { discountType, discount_value, min_order_value, discount_percent, max_discount_value } = offerDetail;
    console.log("offerDetail", offerDetail)

    switch (discountType) {
        case "ABSOLUTE":
            return `Flat Rs ${discount_value} off above Rs ${min_order_value}`;

        case "PERCENTAGE":
            return `${discount_percent}% OFF  above Rs ${min_order_value} up to Rs ${max_discount_value}`;

        // case "free gift":
        //     return `Get ${discount_value} All items on all above Rs. ${min_order_value}`;

        // case "items at set price":
        //     return `Get All items at Rs. ${min_order_value}`;

        default:
            return "No discount available";
    }
};