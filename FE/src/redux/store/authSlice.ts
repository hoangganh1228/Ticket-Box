/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: any | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: any }>) => {
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.user = null;
    },
    update: (state, action: PayloadAction<{ user: any }>) => {
      state.user = action.payload;
    },
  },
});

export const { loginSuccess, logout, update } = authSlice.actions;
export default authSlice.reducer;
