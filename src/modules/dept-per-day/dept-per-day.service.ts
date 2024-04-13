import { z } from "zod";
import settingsService from "../settings/settings.service";

const KEY_DEPT_PER_DAY = "dept-per-day";

interface iSchemaDept<TData = any> {
  data: TData | null;
  success: boolean;
  message: string;
}

async function InitialDeptPerDay(amount: number): Promise<iSchemaDept> {
  const { data, message, success } = await settingsService.AddServiceSetting({
    type_setting: KEY_DEPT_PER_DAY,
    value_setting: amount
  });

  if (!success) {
    return {
      data: null,
      message,
      success
    };
  }

  return {
    data: data,
    message,
    success
  };
}

async function GetDeptPerDay(): Promise<iSchemaDept<number>> {
  const { data, message, success } = await settingsService.GetSetting(KEY_DEPT_PER_DAY);

  if (!success) {
    return {
      data: null,
      message,
      success
    };
  }

  try {
    const dataAmount = parseFloat(data?.value_setting ?? "");

    return {
      data: dataAmount,
      message,
      success
    };
  } catch (e: any) {
    return {
      data: null,
      message: e.message,
      success: false
    };
  }
}

async function UpdateDeptPerDay(amount: any): Promise<iSchemaDept<number>> {
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

  const dataValue: dataSchemaType | null = parser?.data ?? null;

  const { data, message, success } = await settingsService.ChangeValue({
    type_setting: KEY_DEPT_PER_DAY,
    value_setting: dataValue?.toString()
  });

  if (!success) {
    return {
      success: false,
      data: null,
      message
    };
  }

  try {
    return {
      data: parseFloat(data?.value_setting ?? "") ?? 0,
      message,
      success
    };
  } catch (e: any) {
    return {
      data: null,
      message: e.message,
      success: false
    };
  }
}

const deptPerDayService = {
  InitialDeptPerDay,
  GetDeptPerDay,
  UpdateDeptPerDay
};

export default deptPerDayService;