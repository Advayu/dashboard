import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface AccessibilityFeatures {
  wheelchair_access: boolean;
  braille_menu: boolean;
  hearing_assist: boolean;
  reserved_seating: boolean;
}
interface Outlet {
  id: string
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  neighborhood: string;
  street: string;
  postal_code: string;
  country_code: string;
  manager_name: string;
  services: string[];
  service: string;
  amenities: string[];
  amenity: string;
  accessibility_features: AccessibilityFeatures;
  manager_phone: string;
  opening_time: string;
  closing_time: string;
  days_open: string[];
  customerCapacity: string;
  methodsOfPayment: string[];
  images: string[];
  imagesUrl: string[]
}

// Define the type for outlet state
interface OutletState {
  outlet: Outlet[];
  outletIds: string[];
  currenOutlet: Outlet;

}

const initialState: OutletState = {
  outletIds: [],
  outlet: [],
  currenOutlet: {
    id: "",
    name: "",
    address: "",
    latitude: null,
    longitude: null,
    neighborhood: "",
    street: "",
    postal_code: "",
    country_code: "+91",
    manager_name: "",
    services: [],
    service: "",
    amenities: [],
    amenity: "",
    accessibility_features: {
      wheelchair_access: false,
      braille_menu: false,
      hearing_assist: false,
      reserved_seating: false,
    },
    manager_phone: "",
    days_open: [],
    opening_time: "",
    closing_time: "",
    customerCapacity: "",
    methodsOfPayment: [],
    images: [],
    imagesUrl: []
  }

};

const outletSlice = createSlice({
  name: "outlet",
  initialState,
  reducers: {
    setMultipleOutletIds: (state, action: PayloadAction<string[]>) => {
      state.outletIds = [...state.outletIds, ...action.payload]; // Push multiple IDs

    },
    setCurrentOutlet: (state, action: PayloadAction<Outlet>) => {
      state.currenOutlet = action.payload;
    },
    addOutlet: (state, action: PayloadAction<Outlet>) => {

      state.outlet.push(action.payload);
    },

    // push current outlet multiple image in images array 
    addCurrentOutletImage: (state, action: PayloadAction<string>) => {
      state.currenOutlet.images.push(action.payload);
    },

    addCurrentOutletImagesUrl: (state, action:
      PayloadAction<string>) => {
      state.currenOutlet.imagesUrl.push(action.payload);
    },
    toggleAccessibilityFeature: (state, action: PayloadAction<{ feature: keyof AccessibilityFeatures, value: boolean }>) => {
      const { feature, value } = action.payload;
      state.currenOutlet.accessibility_features[feature] = value;
    },


    // remove current outlet image
    removeCurrentOutletImage: (state, action: PayloadAction<number>) => {
      const indexToRemove = action.payload;

      // Safeguard to ensure index exists within the array bounds
      if (indexToRemove >= 0 && indexToRemove < state.currenOutlet.images.length) {
        state.currenOutlet.images = state.currenOutlet.images.filter((_, index) => index !== indexToRemove);
      }

      if (indexToRemove >= 0 && indexToRemove < state.currenOutlet.imagesUrl.length) {
        state.currenOutlet.imagesUrl = state.currenOutlet.imagesUrl.filter((_, index) => index !== indexToRemove);
      }
    },


    //remove one outlet 
    removeOutlet: (state, action: PayloadAction<number>) => {
      state.outlet = state.outlet.filter((_, index) => index !== action.payload);
    },
    //clear current outlet state
    clearCurrentOutlet: (state) => {
      state.currenOutlet = initialState.currenOutlet
    },

    resetOutlets: (state) => {
      state.outlet = [];
    },

  },
});

export const {
  setCurrentOutlet,
  addOutlet,
  clearCurrentOutlet,
  removeOutlet,
  removeCurrentOutletImage,
  addCurrentOutletImage,
  setMultipleOutletIds,
  addCurrentOutletImagesUrl,
  toggleAccessibilityFeature,
  resetOutlets
} = outletSlice.actions;

export default outletSlice.reducer;