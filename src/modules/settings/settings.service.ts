import settingModel, { iSetting } from "@/modules/settings/settings.model";
import { isEmpityString } from "@/utils/utils";
import { z } from "zod";

interface ErrorsTypeSetting {
  type_setting: string[];
  value_setting: string[];
}

interface errorsParse {
  code: string;
  expected: string;
  received: string;
  path: string[];
  message: string;
}

interface DefaultResponseSetting {
  success: boolean;
  data: iSetting | null;
  message: string;
}

interface ResponseSettingWithError<TError = any> {
  success: boolean;
  errors: TError | null;
  data: iSetting | null;
  message: string;
}

interface inputData {
  type_setting?: any;
  value_setting?: any;
}

const defaultProjection = {
  __v: 0,
  _id: 0
};

async function AddServiceSetting(input: inputData): Promise<ResponseSettingWithError<ErrorsTypeSetting>> {
  const schemaObject = z.object({
    type_setting: z.coerce.string({ required_error: "type_setting is required", invalid_type_error: "type_setting is not a string" }),
    value_setting: z.coerce.string({ required_error: "value_setting is required", invalid_type_error: "value_setting is not a string" }),
  });

  type dataSchemaType = z.infer<typeof schemaObject>;

  const parser: any = schemaObject.safeParse(input);

  const errors: ErrorsTypeSetting = {
    type_setting: [],
    value_setting: []
  };

  if (!parser.success) {
    const errs: errorsParse[] = parser?.error?.errors;

    errs.forEach(obj => {
      if (obj.path[0] === "type_setting") errors.type_setting.push(obj.message);
      if (obj.path[0] === "value_setting") errors.value_setting.push(obj.message);
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

  if (isEmpityString(data?.value_setting ?? "")) {
    errors.value_setting.push("value_setting is required");
  }

  if (isEmpityString(data?.type_setting ?? "")) {
    errors.type_setting.push("type_setting is required");
  }

  if (isEmpityString(data?.value_setting ?? "") || isEmpityString(data?.type_setting ?? "")) {
    return {
      success: false,
      errors: errors,
      data: null,
      message: "invalid type"
    };
  }

  const checkSetting = await settingModel.findOne({ type_setting: data?.type_setting });

  if (checkSetting !== null) {
    errors.type_setting.push("type setting already exists");

    return {
      success: false,
      errors: errors,
      data: null,
      message: "duplicate key"
    };
  }

  const newSetting = new settingModel({
    type_setting: data?.type_setting,
    value_setting: data?.value_setting,
  });

  try {
    const result = await newSetting.save();
    return {
      success: true,
      errors: null,
      data: result._doc,
      message: "success to create new setting"
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

async function GetSetting(type_key: any): Promise<DefaultResponseSetting> {
  const schema = z.string({
    required_error: "type_setting is required",
    invalid_type_error: "type_setting is not a string"
  });

  type dataSchemaType = z.infer<typeof schema>;

  const parser: any = schema.safeParse(type_key);

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
      message: "type_setting is required"
    };
  }

  const queryFilter = {
    type_setting: data
  };

  try {
    const currentData = await settingModel.findOne(queryFilter, defaultProjection);
    if (!currentData) {
      return {
        success: false,
        data: null,
        message: `${data} not found`
      };
    }

    return {
      success: true,
      data: currentData?._doc,
      message: `success to get ${data}`
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.message
    };
  }
}

async function ChangeValue(input: inputData): Promise<ResponseSettingWithError<ErrorsTypeSetting>> {
  const schemaObject = z.object({
    type_setting: z.coerce.string({ required_error: "type_setting is required", invalid_type_error: "type_setting is not a string" }),
    value_setting: z.coerce.string({ required_error: "value_setting is required", invalid_type_error: "value_setting is not a string" }),
  });

  type dataSchemaType = z.infer<typeof schemaObject>;

  const parser: any = schemaObject.safeParse(input);

  const errors: ErrorsTypeSetting = {
    type_setting: [],
    value_setting: []
  };

  if (!parser.success) {
    const errs: errorsParse[] = parser?.error?.errors;

    errs.forEach(obj => {
      if (obj.path[0] === "type_setting") errors.type_setting.push(obj.message);
      if (obj.path[0] === "value_setting") errors.value_setting.push(obj.message);
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

  if (isEmpityString(data?.value_setting ?? "")) {
    errors.value_setting.push("value_setting is required");
  }

  if (isEmpityString(data?.type_setting ?? "")) {
    errors.type_setting.push("type_setting is required");
  }

  if (isEmpityString(data?.value_setting ?? "") || isEmpityString(data?.type_setting ?? "")) {
    return {
      success: false,
      errors: errors,
      data: null,
      message: "invalid type"
    };
  }

  const queryFilter = {
    type_setting: data?.type_setting
  };

  try {
    const checkSetting = await settingModel.findOneAndUpdate<iSetting>(queryFilter, { $set: { value_setting: data?.value_setting } }, { projection: defaultProjection });

    if (checkSetting === null) {
      errors.type_setting.push(`${data?.value_setting} not found`);

      return {
        success: false,
        errors: errors,
        data: null,
        message: `${data?.type_setting} not found`
      };
    }

    return {
      success: true,
      errors: null,
      data: (checkSetting as any)._doc,
      message: `success to change ${data?.type_setting}`
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

async function DeleteSetting(type_key: any): Promise<DefaultResponseSetting> {
  const schema = z.string({
    required_error: "sid is required",
    invalid_type_error: "sid is not a string"
  });

  type dataSchemaType = z.infer<typeof schema>;

  const parser: any = schema.safeParse(type_key);

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
    value_setting: data
  };

  try {
    const currentData = await settingModel.findOneAndDelete(queryFilter);
    if (!currentData) {
      return {
        success: false,
        data: null,
        message: `${data} not found`
      };
    }

    return {
      success: true,
      data: currentData,
      message: `success to delete ${data}`
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.message
    };
  }
}

const settingsService = {
  AddServiceSetting,
  GetSetting,
  ChangeValue,
  DeleteSetting,
};

export default settingsService;