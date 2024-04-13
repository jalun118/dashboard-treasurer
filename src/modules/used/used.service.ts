import { errorsParse } from "@/interfaces/zod-type";
import { isEmpityString } from "@/utils/utils";
import { z } from "zod";
import historyService from "../history/history.service";
import saldoService from "../saldo/saldo.service";

interface ErrorsTypeUsed {
  title: string[],
  amount: string[],
}

interface defaultSchemaUsed<TError = any, TData = any> {
  message: string;
  data: TData | null;
  errors: TError | null;
  success: boolean;
}

async function AddUsedSaldo(input: any): Promise<defaultSchemaUsed> {
  const schema = z.object({
    title: z.string({
      required_error: "title is required",
      invalid_type_error: "title is not string"
    }),
    amount: z.number({
      required_error: "amount is required",
      invalid_type_error: "amount is not number"
    })
  });

  type dataSchemaType = z.infer<typeof schema>;

  const parser: any = schema.safeParse(input);

  const errors: ErrorsTypeUsed = {
    title: [],
    amount: []
  };

  if (!parser.success) {
    const errs: errorsParse[] = parser?.error?.errors;

    errs.forEach(obj => {
      if (obj.path[0] === "title") errors.title.push(obj.message);
      if (obj.path[0] === "amount") errors.amount.push(obj.message);
    });
  }

  if (!parser.success) {
    return {
      success: false,
      errors: errors,
      data: null,
      message: "invalid type"
    };
  }


  const data: dataSchemaType | null = parser?.data ?? null;

  if (isEmpityString(data?.title ?? "")) {
    errors.title.push("title is required");
    return {
      success: false,
      errors: errors,
      data: null,
      message: "invalid type"
    };
  }

  const booleanAmountUnderZero = (data?.amount || 0) < 1;
  const booleanTitle = (data?.title.trim()) === "";

  if (booleanAmountUnderZero || booleanTitle) {
    if (booleanAmountUnderZero) {
      errors.amount.push("amount cannot be 0");
    }
    if (booleanTitle) {
      errors.title.push("title is required");
    }

    return {
      success: false,
      errors: errors,
      data: null,
      message: "invalid value"
    };
  }

  const { success: isSuccessAddHistory, message: msgAddHistory, errors: errHistory, data: DataHistory } = await historyService.AddHistoryUsed({
    item_price: data?.amount,
    title_item: data?.title
  });

  if (!isSuccessAddHistory) {
    return {
      data: data,
      errors: errHistory,
      message: msgAddHistory,
      success: isSuccessAddHistory
    };
  }

  const { success: isSuccessReducing, message: msgReducingSaldo, data: dataSaldo } = await saldoService.reducingSaldo(data?.amount);

  if (!isSuccessReducing) {
    await historyService.DeleteOneHistory(DataHistory._id);
    return {
      data: null,
      errors: null,
      message: msgReducingSaldo,
      success: false
    };
  }

  return {
    data: dataSaldo,
    errors: null,
    message: msgReducingSaldo,
    success: true
  };
}

const usedService = {
  AddUsedSaldo
};

export default usedService;