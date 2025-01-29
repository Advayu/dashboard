import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { clear } from 'console';

interface BrandDetailsState {
  name: string;
  industry: string;
  category: string;
  ageGroup: string[];
  description: string;
  tagline: string;
  phoneNumber: string;
  alternateNumber: string;
  email: string;
  gstNumber: string;
  fssaiNumber: string;
  imageUrl: string;
  bannerImageUrl: string;
  websiteUrls: string[];
  socialUrls: string[];
  websiteUrl: string;
  socialUrl: string;
}

const initialState: BrandDetailsState = {
  name: '',
  industry: '',
  category: '',
  ageGroup: [],
  description: '',
  tagline: '',
  phoneNumber: '',
  alternateNumber: '',
  email: '',
  gstNumber: '',
  fssaiNumber: '',
  imageUrl: '',
  bannerImageUrl: '',
  websiteUrls: [],
  socialUrls: [],
  websiteUrl: "",
  socialUrl: "",
};

const brandDetailsSlice = createSlice({
  name: 'brandDetails',
  initialState,
  reducers: {
    setBrandDetails(state, action: PayloadAction<Partial<BrandDetailsState>>) {
      return { ...state, ...action.payload };
    },
    setAgeGroup(state, action: PayloadAction<string[]>) {
      state.ageGroup = action.payload;
    },
    setWebsiteLinks(state, action: PayloadAction<string[]>) {
      state.websiteUrls = action.payload;
    },
    setSocialLinks(state, action: PayloadAction<string[]>) {
      state.socialUrls = action.payload;
    },
    setImageUrl(state, action: PayloadAction<string>) {
      state.imageUrl = action.payload;
    },
    setBannerImageUrl(state, action: PayloadAction<string>) {
      state.bannerImageUrl = action.payload;
    },

    clearImageUrl(state) {
      state.imageUrl = '';
    },

    clearBannerImageUrl(state) {
      state.bannerImageUrl = '';
    },

  },
});

export const { setBrandDetails,
   setAgeGroup, 
   setWebsiteLinks,setSocialLinks, setImageUrl, setBannerImageUrl, clearBannerImageUrl, clearImageUrl } = brandDetailsSlice.actions;
export default brandDetailsSlice.reducer;