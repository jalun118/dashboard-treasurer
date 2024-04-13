import { errorsParse } from "@/interfaces/zod-type";
import userModel, { iUser } from "@/modules/user/user.model";
import { GenerateWithModel } from "@/utils/generate-string";
import { isEmpityString } from "@/utils/utils";
import { z } from "zod";
import historyService from "../history/history.service";

const defaultProjection = {
  __v: 0,
  _id: 0,
  createdAt: 0,
  updatedAt: 0,
};

interface userReturnService<TData = any> {
  success: boolean;
  data: TData | null;
  message: string;
}

interface userReturnServiceWithError<TError = any, TData = any> {
  success: boolean;
  data: TData | null;
  message: string;
  errors: TError | null;
}

async function GetAllUser(): Promise<userReturnService<iUser[]>> {
  try {
    const getAllUser = await userModel.find({}, defaultProjection).sort({ presensi: 1 });
    return {
      data: getAllUser,
      success: true,
      message: "success get all user"
    };
  } catch (err: any) {
    return {
      data: null,
      success: false,
      message: err.message
    };
  }
}

interface ErrorsTypeAddUser {
  current_saldo: string[],
  username: string[],
  payment_debt: string[],
  presensi: string[],
  extra_money: string[];
}

async function AddUser(input: any): Promise<userReturnServiceWithError<ErrorsTypeAddUser, iUser>> {
  const schemaObject = z.object({
    current_saldo: z.coerce.number({
      required_error: "current saldo is required",
      invalid_type_error: "current saldo is not a number"
    }),
    username: z.string({
      required_error: "username is required",
      invalid_type_error: "username is not a string",
    }),
    payment_debt: z.number({
      required_error: "payment debt is required",
      invalid_type_error: "payment debt is not a number"
    }),
    presensi: z.number({
      required_error: "presensi is required",
      invalid_type_error: "presensi is not a number"
    }),
    extra_money: z.number({
      required_error: "extra money is required",
      invalid_type_error: "extra money is not a number"
    }),
  });

  type dataSchemaType = z.infer<typeof schemaObject>;

  const parser: any = schemaObject.safeParse(input);

  const errors: ErrorsTypeAddUser = {
    current_saldo: [],
    username: [],
    payment_debt: [],
    presensi: [],
    extra_money: []
  };

  if (!parser.success) {
    const errs: errorsParse[] = parser?.error?.errors;

    errs.forEach(obj => {
      if (obj.path[0] === "current_saldo") errors.current_saldo.push(obj.message);
      if (obj.path[0] === "username") errors.username.push(obj.message);
      if (obj.path[0] === "payment_debt") errors.payment_debt.push(obj.message);
      if (obj.path[0] === "presensi") errors.presensi.push(obj.message);
      if (obj.path[0] === "extra_money") errors.extra_money.push(obj.message);
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

  if (isEmpityString(data?.username ?? "")) {
    errors.username.push("username is required");
    return {
      success: false,
      errors: errors,
      data: null,
      message: "invalid type"
    };
  }

  const dataUsername = data?.username.toLowerCase();

  const checkUser = await userModel.findOne({ username: dataUsername });

  if (checkUser !== null) {
    errors.username.push("user already exists");

    return {
      success: false,
      errors: errors,
      data: null,
      message: "duplicate user"
    };
  }

  const dataPresensi = data?.presensi ?? 0;
  const checkPresensi = await userModel.findOne({ presensi: dataPresensi });

  if (checkPresensi !== null) {
    errors.presensi.push("user presensi already exists");

    return {
      success: false,
      errors: errors,
      data: null,
      message: "duplicate user"
    };
  }

  const newUser = new userModel({
    presensi: data?.presensi,
    username: dataUsername,
    payment_debt: data?.payment_debt ?? 0,
    current_saldo: data?.current_saldo ?? 0,
    extra_money: data?.extra_money ?? 0,
    sid: await GenerateWithModel(userModel, 20)
  });

  try {
    const result = await newUser.save();
    return {
      success: true,
      errors: null,
      data: result,
      message: "success to insert user"
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

interface ErrorsTypeAddAmountSaldoUser {
  amount_saldo: string[],
  sid: string[],
}

async function AddAmountSaldoUser(input: any): Promise<userReturnServiceWithError<ErrorsTypeAddAmountSaldoUser, iUser>> {
  const schemaObject = z.object({
    sid: z.string({ required_error: "sid is required", invalid_type_error: "sid is not a string" }),
    amount_saldo: z.number({ required_error: "amount saldo is required", invalid_type_error: "amount_saldo is not a number" }),
  });

  type dataSchemaType = z.infer<typeof schemaObject>;

  const parser: any = schemaObject.safeParse(input);

  const errors: ErrorsTypeAddAmountSaldoUser = {
    amount_saldo: [],
    sid: [],
  };

  if (!parser.success) {
    const errs: errorsParse[] = parser?.error?.errors;

    errs.forEach(obj => {
      if (obj.path[0] === "amount_saldo") errors.amount_saldo.push(obj.message);
      if (obj.path[0] === "sid") errors.sid.push(obj.message);
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

  if (isEmpityString(data?.sid ?? "")) {
    errors.sid.push("sid is required");
    return {
      success: false,
      errors: errors,
      data: null,
      message: "invalid type"
    };
  }


  const queryFilter = {
    sid: data?.sid
  };

  const currentData = await userModel.findOne<iUser>(queryFilter);
  if (!currentData || (data?.amount_saldo || 0) < 1) {
    if (!currentData) {
      errors.sid.push("user not found");
    }

    if ((data?.amount_saldo || 0) < 1) {
      errors.amount_saldo.push("amount saldo cannot be 0");
    }

    return {
      success: false,
      errors: errors,
      data: null,
      message: "error, incomplete form"
    };
  }

  const finnalySaldo: number = currentData.current_saldo + (data?.amount_saldo || 0);
  const finnalyPaymentDept = (currentData.payment_debt - (data?.amount_saldo || 0)) <= 0 ? 0 : (currentData.payment_debt - (data?.amount_saldo || 0));
  const finnalyExtraMoney = currentData.extra_money + (finnalyPaymentDept <= 0 ? (data?.amount_saldo || 0) - currentData.payment_debt : 0);

  const setData = {
    $set: {
      current_saldo: finnalySaldo,
      payment_debt: finnalyPaymentDept,
      extra_money: finnalyExtraMoney
    }
  };

  try {
    const result = await userModel.findOneAndUpdate(queryFilter, setData, { projection: defaultProjection });
    const { errors: errorHistory, message: msgHistory, success: SuccessAddHistory } = await historyService.AddHistoryPayment({
      sid: data?.sid,
      large_payment: data?.amount_saldo
    });

    if (!SuccessAddHistory) {
      return {
        success: false,
        errors: {
          sid: errorHistory?.sid ?? [],
          amount_saldo: errorHistory?.large_payment ?? []
        },
        data: result,
        message: msgHistory
      };
    }

    return {
      success: true,
      errors: null,
      data: result,
      message: "success to add amount user"
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

async function GetUser(stringId: any): Promise<userReturnService<iUser>> {
  const schema = z.string({
    required_error: "sid is required",
    invalid_type_error: "sid is not a string"
  });

  type dataSchemaType = z.infer<typeof schema>;

  const parser: any = schema.safeParse(stringId);

  if (!parser.success) {
    return {
      success: false,
      data: null,
      message: parser.error.errors[0].message
    };
  }

  const data: dataSchemaType | null = parser?.data ?? null;

  if (isEmpityString(data ?? "")) {
    return {
      success: false,
      data: null,
      message: "sid is required"
    };
  }

  const queryFilter = {
    sid: data
  };

  try {
    const currentData = await userModel.findOne(queryFilter);
    if (!currentData) {
      return {
        success: false,
        data: null,
        message: "user not found"
      };
    }

    return {
      success: true,
      data: currentData,
      message: "success to get user"
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.message
    };
  }
}

async function DeleteUser(input: any): Promise<userReturnService<iUser>> {
  const schema = z.string({
    required_error: "sid is required",
    invalid_type_error: "sid is not a string"
  });

  type dataSchemaType = z.infer<typeof schema>;

  const parser: any = schema.safeParse(input);

  if (!parser.success) {
    return {
      success: false,
      data: null,
      message: parser.error.errors[0].message
    };
  }

  const data: dataSchemaType | null = parser?.data ?? null;

  if (isEmpityString(data ?? "")) {
    return {
      success: false,
      data: null,
      message: "sid is required"
    };
  }

  const queryFilter = {
    sid: data
  };

  try {
    const currentData = await userModel.findOneAndDelete(queryFilter);
    if (!currentData) {
      return {
        success: false,
        data: null,
        message: "user not found"
      };
    }

    return {
      success: true,
      data: currentData,
      message: "success to delete user "
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.message
    };
  }
}

async function IncrementAllPaymentDept(amount: any): Promise<userReturnService<any>> {
  const schema = z.number({
    required_error: "amount is required",
    invalid_type_error: "amount is not a number"
  });

  type dataSchemaType = z.infer<typeof schema>;

  const parser: any = schema.safeParse(amount);

  if (!parser.success) {
    return {
      success: false,
      data: null,
      message: parser.error.errors[0].message
    };
  }

  const dataValue: dataSchemaType | null = parser?.data ?? 0;

  const filter = {};

  const updateValue = [
    {
      $set: {
        extra_money: {
          $cond: {
            if: {
              $gt: [
                {
                  $subtract: ["$extra_money", dataValue]
                },
                0]
            },
            then: {
              $subtract: ["$extra_money", dataValue]
            },
            else: 0,
          },
        },
        payment_debt: {
          $cond: {
            if: {
              $lt: [
                {
                  $subtract: ["$extra_money", dataValue]
                },
                0]
            },
            then: {
              $add: [
                "$payment_debt",
                {
                  $subtract: [dataValue, "$extra_money"]
                }
              ]
            },
            else: "$payment_debt",
          },
        },
      },
    }
  ];

  try {
    const result = await userModel.updateMany(filter, updateValue);

    return {
      success: true,
      data: result,
      message: `success increment value for ${result.modifiedCount} users out of ${result.matchedCount} data`
    };
  } catch (e: any) {
    return {
      success: false,
      data: null,
      message: e.message
    };
  }
}
const userService = {
  AddUser,
  AddAmountSaldoUser,
  DeleteUser,
  GetUser,
  GetAllUser,
  IncrementAllPaymentDept
};

export default userService;