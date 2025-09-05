import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Reducers
import brandUserReducer from "./globalSlice/brandUserSlice";


// Persist configuration for brandUser
const brandUserPersistConfig = {
  key: "brandUser",
  storage,
  whitelist: ["brand_id", "name", "email", "phone", "is_password_changed", "id", "role", "isAuthenticated"], // Only persist `name` and `email` fields

};

// Wrap brandReducer and brandUserReducer with persistReducer
const persistedBrandUserReducer = persistReducer(
  brandUserPersistConfig,
  brandUserReducer
);

// Combine all reducers
const rootReducer = combineReducers({

  brandUser: persistedBrandUserReducer,
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