export type BrandUser = {
  id: string;
  brand_id: string;
  name: string;
  email: string;
  phone: string;
  password_hash: string;
  role: string;
  permissions: {
    view_orders: boolean;
    manage_products: boolean;
  };
  is_password_changed: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};





export type Offer = {
  id: string;
  title: string;
  brandId: string;
  outletId: string;
  discountCode: string;
  discountType: string;
  discountValue: number;
  minOrderValue: number;
  maxDiscountValue: number;
  applicableDays: string[];
  termsConditions: string;
  startDate: string;
  endDate: string;
  totalLimit: number;
  isActive: boolean;
};

export type OfferDetailsType = {
  title?: string;
  discountCode?: string;
  discountType?: string;
  discountValue?: string;
  minOrderValue?: string;
  maxDiscountValue?: string;
  applicableDays?: string[];
  startDate?: string;
  endDate?: string;
  totalLimit?: string;
}
