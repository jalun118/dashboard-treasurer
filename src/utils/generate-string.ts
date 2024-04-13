import { iUser } from "@/modules/user/user.model";
import type { Model } from "mongoose";

export function GenerateString(length: number): string {
  if (typeof length !== "number") {
    throw Error("length is not number");
  }

  if (length > 100000) {
    return "kepanjangan";
  }

  const lowerAlphabet = "abcdefghijklmnopqrstuvwxyz";
  const upperAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numeric = "0123456789";

  const data = lowerAlphabet + upperAlphabet + numeric;

  let generator = '';

  for (let index = 0; index < length; index++) {
    generator += data[~~(Math.random() * data.length)];
  }
  return generator;
}

export async function GenerateWithModel(model: Model<iUser>, length: number): Promise<string> {
  const stringRandom = GenerateString(length);
  const modelFind = await model.findOne({
    sid: stringRandom
  });

  if (!modelFind?.$isEmpty) {
    GenerateWithModel(model, length);
  }

  return stringRandom;
}

