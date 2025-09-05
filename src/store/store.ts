import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Reducers
import brandReducer from "./globalSlice/brandSlice";
import userReducer from "./globalSlice/userSlice";
import outletReducer from "./slices/outletSlice";
import offerDetailsReducer from "./offerSlice/offerDetailsSlice";
import outletReducer2 from "./globalSlice/outletSlice";
import brandUserReducer from "./globalSlice/brandUserSlice";
import OfferDetails from "./offerSlice/offerDetailsSlice";

// Persist configuration for brand
const brandPersistConfig = {
  key: "brand",
  storage,

};

// Persist configuration for brandUser
const brandUserPersistConfig = {
  key: "brandUser",
  storage,
  whitelist: ["brand_id", "name", "email", "phone", "is_password_changed", "id", "role"], // Only persist `name` and `email` fields

};

// Wrap brandReducer and brandUserReducer with persistReducer
const persistedBrandReducer = persistReducer(brandPersistConfig, brandReducer);
const persistedBrandUserReducer = persistReducer(
  brandUserPersistConfig,
  brandUserReducer
);

// Combine all reducers
const rootReducer = combineReducers({
  // brand: persistedBrandReducer, // Persist this slice
  user: userReducer,
  // outlets: outletReducer,
  // offerDetails: offerDetailsReducer,
  // outlet2: outletReducer2,
  brandUser: persistedBrandUserReducer,
  // offer: OfferDetails,
});

// Configure store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

// Persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;