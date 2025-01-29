import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminDetailsState {
  email: string;
  name: string;
  contactNo: string;
  showOtpInput: boolean;
  // errors: Record<string, string>; // Object to store error messages by field
}

const initialState: AdminDetailsState = {
  email: "",
  name: "",
  contactNo: "",
  showOtpInput: false,

  // errors: {}, // Initialize with an empty object
};

const adminDetailsSlice = createSlice({
  name: "adminDetails",
  initialState,
  reducers: {

   setAdminDetails (state, action: PayloadAction<Partial<AdminDetailsState>>) {
    console.log("action.payload:", action.payload);
     return { ...state, ...action.payload };
   }
,
   setShowOtpInput(state, action: PayloadAction<boolean>) {
     state.showOtpInput = action.payload;
   }




    // setError: (
    //   state,
    //   action: PayloadAction<{ field: keyof Omit<AdminDetailsState, "errors">; message: string }>
    // ) => {
    //   const { field, message } = action.payload;

    //   // Set an error message for the field
    //   // state.errors[field] = message;
    // },

    // resetErrors: (state) => {
    //   // Clear all errors
    //   state.errors = {};
    // },
  },
});

export const { setAdminDetails,setShowOtpInput } = adminDetailsSlice.actions;
export default adminDetailsSlice.reducer;