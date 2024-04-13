import { z } from "zod";
import historyService from "../history/history.service";
import settingService from "../settings/settings.service";

const key_saldo = "all_money";

interface iSaldo {
  value_setting: number;
  createdAt?: NativeDate | undefined;
  updatedAt?: NativeDate | undefined;
  type_setting?: string | undefined;
}

interface saldoSchema {
  success: boolean;
  data: iSaldo | null;
  message: string;
}

async function GetSaldo(): Promise<saldoSchema> {
  const currentData = await settingService.GetSetting(key_saldo);

  if (currentData.success) {
    const saldoValue = parseFloat(currentData?.data?.value_setting || "");
    const pushToDefault = { ...currentData, data: { ...currentData.data, value_setting: saldoValue } };
    return pushToDefault;
  }

  return {
    data: null,
    message: currentData.message,
    success: false,
  };
}

async function InitialSaldo(input_amount: any): Promise<saldoSchema> {
  const schema = z.coerce.number({
    required_error: "amount is required",
    invalid_type_error: "amount is not a number"
  });

  type dataSchemaType = z.infer<typeof schema>;

  const parser: any = schema.safeParse(input_amount);

  if (!parser.success) {
    return {
      success: false,
      data: null,
      message: parser.error.errors[0].message
    };
  }

  const data: dataSchemaType | null = parser?.data ?? null;

  const { success: isSuccess, errors: errCreate, data: dataSuccess } = await settingService.AddServiceSetting({
    type_setting: key_saldo,
    value_setting: data
  });

  if (!isSuccess) {
    if ((errCreate?.type_setting?.length || 0) > 0) {
      return {
        success: false,
        data: null,
        message: errCreate?.type_setting[0] || ""
      };
    }

    return {
      success: false,
      data: null,
      message: errCreate?.value_setting[0] || ""
    };
  }

  const saldoValue = parseFloat(dataSuccess?.value_setting || "");
  const dataCurrent = { ...dataSuccess, value_setting: saldoValue };

  return {
    success: true,
    data: dataCurrent,
    message: `success to add default saldo`
  };
}

async function AddSaldo(input_amount: any): Promise<saldoSchema> {
  const schema = z.coerce.number({
    required_error: "amount is required",
    invalid_type_error: "amount is not a number"
  }).min(1, "amount cannot be empty");

  type dataSchemaType = z.infer<typeof schema>;

  const parser: any = schema.safeParse(input_amount);

  if (!parser.success) {
    return {
      success: false,
      data: null,
      message: parser.error.errors[0].message
    };
  }

  const data: dataSchemaType | null = parser?.data ?? null;

  const { success: isSuccess, data: currentData, message: messageResult } = await settingService.GetSetting(key_saldo);

  if (!isSuccess) {
    return {
      success: false,
      data: null,
      message: messageResult
    };
  }

  const { message: msgHistory, success: isSuccessAddHistory, data: DataHistory } = await historyService.AddHistorySaldo(data || 0);

  if (!isSuccessAddHistory) {
    return {
      success: true,
      data: null,
      message: msgHistory
    };
  }

  const finallySaldo = (parseFloat(currentData?.value_setting || "")) + (data || 0);

  const { success: successChange, errors: errCreate, data: dataSuccess } = await settingService.ChangeValue({ type_setting: key_saldo, value_setting: finallySaldo });

  if (!successChange) {
    await historyService.DeleteOneHistory(DataHistory._id);

    if ((errCreate?.type_setting?.length || 0) > 0) {
      return {
        success: false,
        data: null,
        message: errCreate?.type_setting[0] || ""
      };
    }

    return {
      success: false,
      data: null,
      message: errCreate?.value_setting[0] || ""
    };
  }


  const saldoValue = parseFloat(dataSuccess?.value_setting || "");
  const currenSaldoData = { ...dataSuccess, value_setting: saldoValue };

  return {
    success: true,
    data: currenSaldoData,
    message: `success to add saldo`
  };
}

async function reducingSaldo(input_amount: any): Promise<saldoSchema> {
  const schema = z.coerce.number({
    required_error: "amount is required",
    invalid_type_error: "amount is not a number"
  });

  type dataSchemaType = z.infer<typeof schema>;

  const parser: any = schema.safeParse(input_amount);

  if (!parser.success) {
    return {
      success: false,
      data: null,
      message: parser.error.errors[0].message
    };
  }

  const data: dataSchemaType | null = parser?.data ?? null;

  const { success: isSuccess, data: currentData, message: messageResult } = await settingService.GetSetting(key_saldo);

  if (!isSuccess) {
    return {
      success: false,
      data: null,
      message: messageResult
    };
  }

  const finallySaldo = (parseFloat(currentData?.value_setting || "")) - (data || 0);

  if (finallySaldo < 0) {
    return {
      success: false,
      data: null,
      message: "your money is not enough"
    };
  }

  const { success: successChange, errors: errCreate, data: dataSuccess } = await settingService.ChangeValue({ type_setting: key_saldo, value_setting: finallySaldo });

  if (!successChange) {
    if ((errCreate?.type_setting?.length || 0) > 0) {
      return {
        success: false,
        data: null,
        message: errCreate?.type_setting[0] || ""
      };
    }

    return {
      success: false,
      data: null,
      message: errCreate?.value_setting[0] || ""
    };
  }

  const saldoValue = parseFloat(dataSuccess?.value_setting || "");
  const currenSaldoData = { ...dataSuccess, value_setting: saldoValue };

  return {
    success: true,
    data: currenSaldoData,
    message: `success to add saldo`
  };
}

const saldoService = {
  InitialSaldo,
  GetSaldo,
  AddSaldo,
  reducingSaldo
};

export default saldoService;