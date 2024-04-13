
// const initialState: iHistoryManagePerDay[] = [];

// interface PayloadHistory {
//   date: string | Date;
//   input: iHistoryManage;
// }

// function IsSameDay(sepecificDate: Date | string, findDate: Date | string) {
//   const same = (new Date(sepecificDate).setHours(0, 0, 0, 0) - new Date(findDate).setHours(0, 0, 0, 0));
//   const isSame = same === 0;
//   return isSame;
// }

// export const historySlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     SetAllHistory: (state, action: PayloadAction<iHistoryManagePerDay[]>) => {
//       state = action.payload;
//     },
//   }
// });

// export const { SetSaldo } = saldoSlice.actions;
// export const saldoReducer = saldoSlice.reducer;
