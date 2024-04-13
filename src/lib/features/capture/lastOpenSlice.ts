import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface iLastOpen {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

const initialState: iLastOpen = {
  isLoading: true,
  isSuccess: false,
  isError: false,
};

export const lastOpenSlice = createSlice({
  name: "saldo",
  initialState: initialState,
  reducers: {
    SetLastOpenCondition: (state, action: PayloadAction<iLastOpen>) => {
      state.isLoading = action.payload.isLoading;
      state.isSuccess = action.payload.isSuccess;
      state.isError = action.payload.isError;
    },
  }
});

export const { SetLastOpenCondition } = lastOpenSlice.actions;
export const lastOpenReducer = lastOpenSlice.reducer;