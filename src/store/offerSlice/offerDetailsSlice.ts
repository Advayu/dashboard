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

// interface FlatOffCondition {
//     flatOffAmount: number;
//     abovePurchase: number;
// }

// interface PercentageOffCondition {
//     percentage: number;
//     price: number;
//     abovePurchase: number;
//     uptoRs: number;
// }

// interface BuyNGetNCondition {
//     buy: number;
//     get: number;
//     description: string;
// }

// interface ItemsAtSetPriceCondition {
//     get: string;
//     value: number;
// }

// interface RedemptionDetail {
//     startDate: string;
//     endDate: string;
//     activeDays: string[];
//     maximumRedemptions: number;
//     maximumRedemptionsPerUser: number;
//     durationBetweenRedemptions: number;
// }

// type OfferCondition =
//     | FlatOffCondition
//     | PercentageOffCondition
//     | BuyNGetNCondition
//     | ItemsAtSetPriceCondition;

// interface OfferDetailsState {
//     offerType: string;
//     offerCode: string;
//     discountValue: number;
//     minOrderValue: number;
//     maxDiscountValue: number;
//     conditions: OfferCondition[];
//     redemptionDetails: RedemptionDetail | null;
// }

// const initialState: OfferDetailsState = {
//     offerType: '',
//     offerCode: '',
//     discountValue: 0,
//     conditions: [],
//     redemptionDetails: null,
// };

//     setOfferType(state, action: PayloadAction<string>) {
//         console.log("offer type:", action.payload);
//         state.offerType = action.payload;
//         state.conditions = []; // Clear conditions on type change
//     },
//     setOfferCondition(state, action: PayloadAction<OfferCondition>) {
//         state.conditions = [action.payload]; // Replace existing conditions
//     },
//     clearOfferConditions(state) {
//         state.conditions = [];
//     },
//     setOfferCode(state, action: PayloadAction<string>) {
//         state.offerCode = action.payload;
//     },
//     setRedemptionDetails(state, action: PayloadAction<Partial<RedemptionDetail>>) {
//       Object.assign(state, action.payload); // Merge updates with existing state
//   },
//     setActiveDays(state, action: PayloadAction<string[]>) {
//         if (state.redemptionDetails) {
//             state.redemptionDetails.activeDays = action.payload;
//         }
//     },
