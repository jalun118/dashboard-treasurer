import { InferSchemaType, Schema, model, models } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
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

type iSchemaAdmin = InferSchemaType<typeof schema>;
export type tRoleAdmin = "super-admin" | "admin"
export type iAdmin = Omit<iSchemaAdmin, "role"> & { role: tRoleAdmin; };
export type iAdminSafe = Omit<iAdmin, "password">;
export type iAdminSession = Omit<iAdmin, "password" | "sid" | "_id" | "createdAt" | "updatedAt">;

const administrator = models.administrators || model<iAdmin>("administrators", schema);
export default administrator;