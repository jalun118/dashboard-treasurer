import { InferSchemaType, Schema, model, models } from "mongoose";

const schema = new Schema(
  {
    type_setting: {
      type: String,
      required: true
    },
    value_setting: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export type iSetting = InferSchemaType<typeof schema>;

const setting = models.setting || model<iSetting>("setting", schema);
export default setting;