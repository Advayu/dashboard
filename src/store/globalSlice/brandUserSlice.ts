import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BrandUser } from '@/Types/type';


// Initial state adhering to the BrandUser interface
const initialState: BrandUser = {
    id: "",
    brand_id: "",
    name: "",
    email: "",
    phone: "",
    password_hash: "",
    role: "",
    permissions: {
        view_orders: false,
        manage_products: false,
    },
    is_active: false,
    created_at: "",
    updated_at: "",
};

// Create the slice
const userSlice = createSlice({
    name: "branduser",
    initialState,
    reducers: {
        // Set the entire user object
        setBrandUser(state, action: PayloadAction<BrandUser>) {
            console.log("Brand User", action.payload);
            return { ...state, ...action.payload };
        },

        // Reset the state to its initial structure
        resetBrandUser() {
            return { ...initialState };
        },
    },
});

// Export actions and reducer
export const { setBrandUser, resetBrandUser } = userSlice.actions;
export default userSlice.reducer;