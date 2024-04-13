import { ParseBooleanString } from "@/utils/parse-boolean-string";
import { stringToArray } from "@/utils/string-to-array";
import { isEmpityString } from "@/utils/utils";
import { z } from "zod";
import settingService from "../settings/settings.service";

const KEY_CAPTURE = "capture_state";

interface ErrorsTypeSetting {
  type_setting: string[];
  value_setting: string[];
}

interface iCaptureDay {
  value_setting: boolean;
  createdAt?: NativeDate;
  updatedAt?: NativeDate;
  type_setting?: string;
}

interface DefaultResponseCaptureDay {
  success: boolean;
  data: iCaptureDay | null;
  message: string;
}

interface ResponseCaptureDayWithError {
  success: boolean;
  data: iCaptureDay | null;
  message: string;
  errors: ErrorsTypeSetting | null;
}

async function InitialCaptureState(value_capture: boolean): Promise<ResponseCaptureDayWithError> {
  const response = await settingService.AddServiceSetting({
    type_setting: KEY_CAPTURE,
    value_setting: value_capture
  });

  if (!response.success) {
    return {
      ...response,
      data: null
    };
  }

  const { data } = response;
  const newData = { ...data, value_setting: (ParseBooleanString(data?.value_setting || "true")) };
  return { ...response, data: newData };
}

async function GetCaptureState(): Promise<DefaultResponseCaptureDay> {
  const response = await settingService.GetSetting(KEY_CAPTURE);

  if (!response.success) {
    return {
      ...response,
      data: null
    };
  }

  const { data } = response;
  const newData = { ...data, value_setting: (ParseBooleanString(data?.value_setting || "true")) };
  return { ...response, data: newData };
}

async function ChangeState(value_state: any): Promise<ResponseCaptureDayWithError> {
  let valueState = true;

  try {
    const parseBool = ParseBooleanString(value_state);

    valueState = parseBool;
  } catch (e: any) {
    return {
      data: null,
      errors: null,
      success: false,
      message: `${e.message}`
    };
  }

  const response = await settingService.ChangeValue({
    type_setting: KEY_CAPTURE,
    value_setting: valueState
  });

  if (!response.success) {
    return {
      ...response,
      data: null
    };
  }

  const { data } = response;
  const newData = { ...data, value_setting: (ParseBooleanString(data?.value_setting || "true")) };
  return { ...response, data: newData };
}

const KEY_DAY_CAPTURE = "day-capture";

async function SetArrayDayCapture(array_day: any) {
  const schema = z.string({
    required_error: "array_day is required",
    invalid_type_error: "array_day is not a string array"
  });

  type dataSchemaType = z.infer<typeof schema>;

  const parser: any = schema.safeParse(array_day);

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
      message: "array_day is required"
    };
  }

  const { error } = stringToArray<number>(data ?? "");

  if (error !== null) {
    return {
      success: false,
      data: null,
      message: error
    };
  }

  try {
    const result = await settingService.ChangeValue({
      type_setting: KEY_DAY_CAPTURE,
      value_setting: data
    });

    if (result.success) {
      return {
        success: true,
        data: result.data,
        message: result.message
      };
    }

    return {
      success: false,
      data: null,
      message: result.message
    };
  } catch (e: any) {
    return {
      success: false,
      data: null,
      message: e.message
    };
  }
}

async function InitialSetDayCapture(value_day: string) {
  try {
    const result = await settingService.AddServiceSetting({
      type_setting: KEY_DAY_CAPTURE,
      value_setting: value_day
    });

    if (result.success) {
      return {
        success: true,
        data: result.data,
        message: result.message
      };
    }

    return {
      success: false,
      data: null,
      message: result.message
    };
  } catch (e: any) {
    return {
      success: false,
      data: null,
      message: e.message
    };
  }
}

interface iGetCapture {
  data: number[] | null;
  message: string;
  success: boolean;
}

async function GetCaptureDay(): Promise<iGetCapture> {
  const response = await settingService.GetSetting(KEY_DAY_CAPTURE);

  if (!response.success) {
    return {
      data: null,
      success: true,
      message: response.message
    };
  }

  const { error, data } = stringToArray<number>(response.data?.value_setting ?? "");
  if (error !== null) {
    return {
      data: null,
      success: false,
      message: error
    };
  }

  return {
    data: data,
    success: true,
    message: "success to get capture day"
  };
}

const captureService = {
  InitialCaptureState,
  GetCaptureState,
  ChangeState,
  SetArrayDayCapture,
  InitialSetDayCapture,
  GetCaptureDay,
};

export default captureService;