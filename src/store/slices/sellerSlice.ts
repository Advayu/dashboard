import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SellerState {
  name: string;
  contactNo: string;
}

const initialState: SellerState = {
  name: "",
  contactNo: "",
};

export const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setContactNo: (state, action: PayloadAction<string>) => {
      state.contactNo = action.payload;
    },
  },
});

export const { setName, setContactNo } = sellerSlice.actions;
export default sellerSlice.reducer;