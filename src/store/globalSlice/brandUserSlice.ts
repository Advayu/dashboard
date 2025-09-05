import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BrandUser } from '@/Types/type';


// Initial state adhering to the BrandUser interface
const initialState: BrandUser = {
    id: "",
    brand_id: "",
    name: "",
    email: "",
    phone: "",
    role: "",
    is_password_changed: false,
    is_active: false,

};

// Create the slice
const userSlice = createSlice({
    name: "branduser",
    initialState,
    reducers: {
        // Set the entire user object
        setBrandUser(state, action: PayloadAction<BrandUser>) {

            return { ...state, ...action.payload };
        },
        setBrandUserId(state, action: PayloadAction<string>) {
            state.id = action.payload;
        },

        // Reset the state to its initial structure
        resetBrandUser() {
            return { ...initialState };
        },
    },
});

// Export actions and reducer
export const { setBrandUser, resetBrandUser, setBrandUserId } = userSlice.actions;
export default userSlice.reducer;