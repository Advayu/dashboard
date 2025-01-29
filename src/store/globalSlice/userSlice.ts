import { createSlice } from '@reduxjs/toolkit';
import { set } from 'zod';

interface UserState {
  email: string;
  isEmailVerified: boolean;
  isCompletedAllStep: boolean
}

const initialState : UserState = {
  email: '',
  isEmailVerified: false,
  isCompletedAllStep: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    }, 
    setIsEmailVerified: (state, action) => {
      console.log("action.payload:", action.payload);
      state.isEmailVerified = action.payload; // Directly update the field
    },
    setIsCompletedAllStep: (state, action) => {
      state.isCompletedAllStep = action.payload;
    }
  },
});

export const {setEmail, setIsEmailVerified, setIsCompletedAllStep } = userSlice.actions;

export default userSlice.reducer;