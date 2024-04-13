import { errorsParse } from "@/interfaces/zod-type";
import historyModel from "@/modules/history/history.model";
import { isEmpityString } from "@/utils/utils";
import { z } from "zod";
import saldoService from "../saldo/saldo.service";
import userService from "../user/user.service";

interface InputHistoryUsed {
  item_price: any;
  title_item: any;
}

interface ErrorsTypeHistoryUsed {
  item_price: string[];
  title_item: string[];
}

async function AddHistoryUsed(input: InputHistoryUsed): Promise<{ success: boolean; errors: ErrorsTypeHistoryUsed | null; data: any | null; message: string; }> {
  const schemaObject = z.object({
    item_price: z.number({
      required_error: "item_price is required",
      invalid_type_error: "item_price is not a number",
    }),
    title_item: z.string({
      required_error: "title_item is required",
      invalid_type_error: "title_item is not a string",
    })
  });

  type dataSchemaType = z.infer<typeof schemaObject>;

  const parser: any = schemaObject.safeParse(input);

  const errors: ErrorsTypeHistoryUsed = {
    item_price: [],
    title_item: []
  };

  if (!parser.success) {
    const errs: errorsParse[] = parser?.error?.errors;

    errs.forEach(obj => {
      if (obj.path[0] === "item_price") errors.item_price.push(obj.message);
      if (obj.path[0] === "title_item") errors.title_item.push(obj.message);
    });
  }

  if (!parser.success) {
    return {
      data: null,
      errors: errors,
      message: "invalid type",
      success: false
    };
  }

  const data: dataSchemaType | null = parser?.data ?? null;

  if (isEmpityString(data?.title_item ?? "")) {
    errors.title_item.push("title_item is required");
    return {
      data: null,
      errors: errors,
      message: "invalid type",
      success: false
    };
  }

  const { data: dataSaldo, success: isSuccess, message: msgGetSaldo } = await saldoService.GetSaldo();

  if (!isSuccess) {
    return {
      data: null,
      errors: null,
      message: msgGetSaldo,
      success: false
    };
  }

  const finnalySaldo = (dataSaldo?.value_setting || 0) - (data?.item_price || 0);

  const newHistory = new historyModel({
    finally_saldo: finnalySaldo,
    current_saldo: dataSaldo?.value_setting || 0,
    type: "used",
    amount: null,
    used: {
      item_price: data?.item_price || 0,
      title_item: data?.title_item,
    },
    payment: null
  });

  try {
    const result = await newHistory.save();

    return {
      data: result,
      errors: null,
      message: "success to add history",
      success: true
    };
  } catch (error: any) {
    return {
      success: false,
      errors: null,
      data: null,
      message: error.message
    };
  }
}

interface ErrorsTypeHistoryPayment {
  large_payment: string[];
  sid: string[];
}

interface InputHistoryPayment {
  large_payment: any;
  sid: any;
}

async function AddHistoryPayment(input: InputHistoryPayment): Promise<{ success: boolean; errors: ErrorsTypeHistoryPayment | null; data: any | null; message: string; }> {
  const schemaObject = z.object({
    large_payment: z.coerce.number({
      required_error: "large_payment is required",
      invalid_type_error: "large_payment is not a number",
    }),
    sid: z.string({
      required_error: "sid is required",
      invalid_type_error: "sid is not a string",
    })
  });

  type dataSchemaType = z.infer<typeof schemaObject>;

  const parser: any = schemaObject.safeParse(input);

  const errors: ErrorsTypeHistoryPayment = {
    sid: [],
    large_payment: []
  };

  if (!parser.success) {
    const errs: errorsParse[] = parser?.error?.errors;

    errs.forEach(obj => {
      if (obj.path[0] === "large_payment") errors.large_payment.push(obj.message);
      if (obj.path[0] === "sid") errors.sid.push(obj.message);
    });
  }

  if (!parser.success) {
    return {
      data: null,
      errors: errors,
      message: "invalid type",
      success: false
    };
  }

  if (isEmpityString(input.sid ?? "")) {
    errors.sid.push("sid is required");
    return {
      data: null,
      errors: errors,
      message: "invalid type",
      success: false
    };
  }

  const { message: msgUser, success: isSuccessUser } = await userService.GetUser(input.sid);

  if (!isSuccessUser) {
    return {
      data: null,
      message: msgUser,
      success: isSuccessUser,
      errors: null
    };
  }

  const data: dataSchemaType | null = parser?.data ?? null;

  const { data: dataSaldo, success: isSuccess, message: msgGetSaldo } = await saldoService.GetSaldo();

  if (!isSuccess) {
    return {
      data: null,
      errors: null,
      message: msgGetSaldo,
      success: false
    };
  }

  const finnalySaldo = (dataSaldo?.value_setting || 0) + (data?.large_payment || 0);

  const newHistory = new historyModel({
    finally_saldo: finnalySaldo,
    current_saldo: dataSaldo?.value_setting || 0,
    type: "payment",
    payment: {
      large_payment: (data?.large_payment || 0),
      sid: data?.sid,
    },
    used: null
  });

  try {
    const result = await newHistory.save();

    const { success: isSuccess, message: msgAddSaldo } = await saldoService.AddSaldo(data?.large_payment || 0);

    if (!isSuccess) {
      const { success: SuccessDelete, message: msgDeleteHistory } = await DeleteOneHistory(result._id);

      if (!SuccessDelete) {
        return {
          data: result,
          errors: null,
          message: msgDeleteHistory,
          success: false
        };
      }

      return {
        data: result,
        errors: null,
        message: msgAddSaldo,
        success: false
      };
    }

    return {
      data: result,
      errors: null,
      message: "success to add history",
      success: true
    };
  } catch (error: any) {
    return {
      success: false,
      errors: null,
      data: null,
      message: error.message
    };
  }
}

async function DeleteOneHistory(objectId: any): Promise<{ success: boolean, data: any | null; message: string; }> {
  const schemaObject = z.coerce.string({
    required_error: "objectId is required",
    invalid_type_error: "objectId is not a string",
  });

  type dataSchemaType = z.infer<typeof schemaObject>;

  const parser: any = schemaObject.safeParse(objectId);

  if (!parser.success) {
    return {
      success: false,
      data: null,
      message: parser.error.errors[0].message
    };
  }

  const data: dataSchemaType | null = parser?.data ?? null;

  try {
    const result = await historyModel.findByIdAndDelete(data);

    if (!result) {
      return {
        data: null,
        message: "history not found",
        success: false
      };
    }

    return {
      data: result,
      message: "success to delete history",
      success: true
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.message
    };
  }
}

async function AddHistorySaldo(input: any): Promise<{ success: boolean; data: any | null; message: string; }> {
  const schemaObject = z.number({
    required_error: "large_payment is required",
    invalid_type_error: "large_payment is not a number",
  });

  type dataSchemaType = z.infer<typeof schemaObject>;

  const parser: any = schemaObject.safeParse(input);

  if (!parser.success) {
    const errs: errorsParse[] = parser?.error?.errors;

    return {
      data: null,
      message: errs[0].message,
      success: false
    };
  }

  const data: dataSchemaType | null = parser?.data ?? null;

  const { data: dataSaldo, success: isSuccess, message: msgGetSaldo } = await saldoService.GetSaldo();

  if (!isSuccess) {
    return {
      data: null,
      message: msgGetSaldo,
      success: false
    };
  }

  const finnalySaldo = (dataSaldo?.value_setting || 0) + (data || 0);

  const newHistory = new historyModel({
    finally_saldo: finnalySaldo,
    current_saldo: dataSaldo?.value_setting || 0,
    type: "add-amount",
    amount: data || 0,
    payment: null,
    used: null
  });

  try {
    const result = await newHistory.save();

    return {
      data: result,
      message: "success to add history",
      success: true
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.message
    };
  }
}

async function GetAllHistory() {
  try {
    const results = await historyModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "payment.sid",
          foreignField: "sid",
          as: "user",
        }
      },
      {
        $addFields: {
          payment: {
            "$cond": {
              if: { "$eq": ["$payment", null] },
              then: null,
              else: "$payment",
            }
          },
        }
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          finally_saldo: 1,
          current_saldo: 1,
          type: 1,
          used: 1,
          payment: 1,
          amount: 1,
          "user.username": 1,
          "user.presensi": 1,
          createdAt: 1
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          historys: {
            $push: "$$ROOT"
          }
        }
      },
      {
        $project: {
          _id: 0,
          date_transaction: "$_id",
          historys: 1,
        }
      },
      {
        $sort: {
          "date_transaction.day": -1
        }
      },
    ]);

    if (!results) {
      return {
        data: null,
        message: "history not found",
        success: false
      };
    }

    return {
      data: results,
      message: "success to get all historys",
      success: true
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.message
    };
  }
}

const historyService = {
  AddHistoryUsed,
  AddHistoryPayment,
  AddHistorySaldo,
  DeleteOneHistory,
  GetAllHistory,
};

export default historyService;