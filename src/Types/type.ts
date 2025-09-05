export type BrandUser = {
  id: string;
  brand_id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  is_password_changed: boolean;
  is_active: boolean;
  isAuthenticated: boolean
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

type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";
export interface OfferDetails {
  id: string;
  brand_id: string;
  outlet_id: string;
  title: string;
  code: string | null;
  offer_type: "AUTO_APPLY" | "COUPON_CODE" | string; // Extend as needed
  discount_type: "PERCENTAGE" | "ABSOLUTE";
  discount_percent: number;
  discount_value: number;
  min_order_value: number;
  max_discount_value: number;
  applicable_product_ids: string[] | null;
  applicable_days: Day[]; // Can restrict to specific days if needed
  terms_conditions: string;
  start_date: string; // ISO string format
  end_date: string;
  is_active: boolean;
  max_per_user: number;
  total_limit: number;
  created_at: string;
  updated_at: string;
  status?: "Active" | "Inactive"; // Derived field (optional if computed)
}

