import { Types } from "mongoose";

// {
//   historys: [
//     {
//       _id: ObjectId('660eb062b1f54570bf818655'),
//       finally_saldo: -5000,
//       current_saldo: 45000,
//       type: 'used',
//       used: { item_price: 50000, title_item: 'kue' },
//       payment: null,
//       createdAt: ISODate('2024-04-04T13:51:30.311Z')
//     },
//     {
//       _id: ObjectId('660eb03ab1f54570bf80883b'),
//       finally_saldo: 95000,
//       current_saldo: 85000,
//       type: 'payment',
//       used: null,
//       payment: { large_payment: 10000, sid: '9PAsRiBeW6chOm1ytvmY' },
//       createdAt: ISODate('2024-04-04T13:50:50.322Z'),
//       user: { presensi: 0, username: 'john maulana' }
//     }
//   ],
//   date_transaction: { year: 2024, month: 4, day: 4 }
// }

export type TypeHistory = "used" | "payment" | "add-amount";
export interface iHistoryManage {
  _id: Types.ObjectId;
  finally_saldo: number;
  current_saldo: number;
  type: TypeHistory;
  used?: {
    item_price: number;
    title_item: string;
  };
  amount?: number;
  payment?: {
    large_payment: number;
    sid: string;
  };
  user?: {
    presensi: number;
    username: string;
  };
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

export interface iHistoryManagePerDay {
  date_transaction: {
    year: number;
    month: number;
    day: number;
  };
  historys: iHistoryManage[];
}