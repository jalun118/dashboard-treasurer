import { InferSchemaType, Schema, model, models } from "mongoose";

const schema = new Schema(
  {
    presensi: {
      type: Number,
      required: true
    },
    current_saldo: {
      type: Number,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    payment_debt: {
      type: Number,
      required: true
    },
    extra_money: {
      type: Number,
      required: true
    },
    sid: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export type iUser = InferSchemaType<typeof schema>;

const user = models.users || model<iUser>("users", schema);
export default user;