// utils/sanitize-brand-details.ts
export const sanitizeBrandDetails = (brand: any): any => {
    return {
        ...brand,
        logo_url: typeof brand.logo_url === "string" ? [brand.logo_url] : [],
        banner_url: typeof brand.banner_url === "string" ? [brand.banner_url] : [],
    };
};
