import { iHistoryManage } from "@/interfaces/history-manage";
import { Schema, model, models } from "mongoose";

const schema = new Schema<iHistoryManage>(
  {
    finally_saldo: {
      type: Number,
      required: true
    },
    current_saldo: {
      type: Number,
      required: true
    },
    type: {
      type: String || "used" || "payment",
      required: true
    },
    amount: {
      type: Number,
    } || null,
    used: {
      item_price: Number,
      title_item: String,
    } || null,
    payment: {
      large_payment: Number,
      sid: String
    } || null,
  },
  {
    timestamps: true
  }
);

const history = models.histories || model<iHistoryManage>("histories", schema);
export default history;