import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: '',
  name: '',
  category_name: '',
  subcategories: {
    food: [],
    beverages: [],
  },
  description: '',
  tagline: '',
  phone: '',
  alternate_phone: '',
  email: '',
  website_url: '',
  logo_url: '',
  banner_url: '',
  social_links: {
    facebook: '',
    instagram: '',
  },
  gst_number: '',
  fssai_number: '',
  license_details: {
    trade_license: '',
    health_license: '',
  },
  established_year: null,
  is_verified: false,
  verified_at: null,
  token: '',

};

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {
    setBrandData: (state, action) => {
      console.log("action.payload", action.payload, state);
      return { ...state, ...action.payload };
    },

  },
});

export const { setBrandData } = brandSlice.actions;

export default brandSlice.reducer;