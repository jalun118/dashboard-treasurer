import { defaultSaldo } from "@/lib/initial-settings";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface iSaldo {
  amount_saldo: number;
  update_at: string | Date;
}

const initialStateSaldo: iSaldo = {
  amount_saldo: defaultSaldo,
  update_at: (new Date().toString())
};

export const saldoSlice = createSlice({
  name: "saldo",
  initialState: initialStateSaldo,
  reducers: {
    SetSaldo: (state, action: PayloadAction<number>) => {
      state.amount_saldo = state.amount_saldo + action.payload;
      state.update_at = (new Date().toString());
    },
    SetInitialSaldo: (state, action: PayloadAction<number>) => {
      state.amount_saldo = action.payload;
    },
    SetReducingSaldo: (state, action: PayloadAction<number>) => {
      state.amount_saldo = state.amount_saldo - action.payload;
      state.update_at = (new Date().toString());
    }
  }
});

export const { SetSaldo, SetInitialSaldo, SetReducingSaldo } = saldoSlice.actions;
export const saldoReducer = saldoSlice.reducer;
