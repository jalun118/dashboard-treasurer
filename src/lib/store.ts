import { configureStore } from '@reduxjs/toolkit';
import { firstOpenReducer } from "./features/capture/firstOpenSlice";
import { lastOpenReducer } from "./features/capture/lastOpenSlice";
import { saldoReducer } from "./features/saldo/saldoSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      saldo: saldoReducer,
      firstOpen: firstOpenReducer,
      lastOpen: lastOpenReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];