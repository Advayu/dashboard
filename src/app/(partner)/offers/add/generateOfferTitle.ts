type OfferDetails = {
    discountType: string;
    discountValue?: string;
    minOrderValue?: string;
    maxOrderValue?: string;
    maxDiscountValue?: string;

};

export const generateOfferTitle = (offerDetail: any): string => {
    const { discountType, discountValue = 0, minOrderValue = 0, maxOrderValue = 0, maxDiscountValue = 0 } = offerDetail;

    switch (discountType?.toLowerCase()) {
        case "flat off":
            return `Flat Rs ${discountValue} off above Rs ${minOrderValue}`;

        case "percentage off":
            return `${discountValue}% OFF on all items above Rs ${minOrderValue} up to Rs ${maxDiscountValue}`;

        case "free gift":
            return `Get ${discountValue} All items on all above Rs. ${minOrderValue}`;

        case "items at set price":
            return `Get All items at Rs. ${minOrderValue}`;

        default:
            return "No discount available";
    }
};