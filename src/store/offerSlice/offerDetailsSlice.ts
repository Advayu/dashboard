import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Offer {
  id: string;
  title: string;
  brandId: string;
  outletId: string;
  discountCode: string;
  discountType: string;
  discountValue: string;
  minOrderValue: string;
  maxDiscountValue: string;
  applicableDays: string[];
  termsConditions: string;
  startDate: string;
  endDate: string;
  totalLimit: string;
  isActive: boolean;
  // offerDetailsText: string
}

const initialOfferState: Offer = {
  id: "",
  title: "",
  brandId: "",
  outletId: "",
  discountCode: "",
  discountType: "",
  discountValue: "",
  minOrderValue: "",
  maxDiscountValue: "",
  applicableDays: [],
  termsConditions: "",
  startDate: "",
  endDate: "",
  totalLimit: "",
  isActive: false,
  // offerDetailsText: ''
};

const offerDetailsSlice = createSlice({
  name: "offerDetails",
  initialState: initialOfferState,
  reducers: {
    // Generic setter for dynamic updates
    setOfferfield<K extends keyof Offer>(
      state: any,
      action: PayloadAction<{ field: K; value: Offer[K] }>
    ) {
      console.log(
        "action.payload.field:",
        action.payload.field,
        "action.payload.value:",
        action.payload.value
      );
      state[action.payload.field] = action.payload.value;
    },

    // Setter for multiple fields at once
    setOfferDetails(state, action: PayloadAction<Partial<Offer>>) {
      Object.assign(state, action.payload);
    },

    // Reset to initial state
    resetOfferDetails() {
      return initialOfferState;
    },
  },
});

export const { setOfferfield, setOfferDetails, resetOfferDetails } =
  offerDetailsSlice.actions;

export default offerDetailsSlice.reducer;

