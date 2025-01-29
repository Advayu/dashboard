

import { configureStore } from "@reduxjs/toolkit";
import sellerReducer from "./slices/sellerSlice";
import brandDetailsReducer from './slices/brandDetailsSlice';
import outletReducer from './slices/outletSlice';
import productReducer from './slices/productSlice';
import userReducer from './globalSlice/userSlice';
import adminReducer from './slices/adminDetailsSlice'


export const onboardingStore = configureStore({
  reducer: {
    seller: sellerReducer,
    brandDetails: brandDetailsReducer,
    outlets: outletReducer,
    products: productReducer,
    user: userReducer,
    admin: adminReducer,

  },
});

export type RootState = ReturnType<typeof onboardingStore.getState>;
export type AppDispatch = typeof onboardingStore.dispatch;