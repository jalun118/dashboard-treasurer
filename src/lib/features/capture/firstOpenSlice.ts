import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface iFirstOpen<TResponse = any> {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

const initialState: iFirstOpen = {
  isLoading: true,
  isSuccess: false,
  isError: false,
};

export const firstOpenSlice = createSlice({
  name: "saldo",
  initialState: initialState,
  reducers: {
    SetFirstOpenCondition: (state, action: PayloadAction<iFirstOpen>) => {
      state.isLoading = action.payload.isLoading;
      state.isSuccess = action.payload.isSuccess;
      state.isError = action.payload.isError;
    },
  }
});

export const { SetFirstOpenCondition } = firstOpenSlice.actions;
export const firstOpenReducer = firstOpenSlice.reducer;