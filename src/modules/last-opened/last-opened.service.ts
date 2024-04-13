import settingsService from "../settings/settings.service";

const KEY_LAST_OPEN = "last-opened";

interface iLastOpen<TData = any> {
  success: boolean;
  message: string;
  data: TData | null;
}

async function InitialLastOpened(value_last_open: string): Promise<iLastOpen> {
  try {
    const result = await settingsService.AddServiceSetting({
      type_setting: KEY_LAST_OPEN,
      value_setting: value_last_open
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

async function updateLastOpened(value_last_open: string): Promise<iLastOpen> {
  try {
    const result = await settingsService.ChangeValue({
      type_setting: KEY_LAST_OPEN,
      value_setting: value_last_open
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

async function GetLastOpened(): Promise<iLastOpen<string>> {
  const response = await settingsService.GetSetting(KEY_LAST_OPEN);

  if (!response.success) {
    return {
      data: null,
      success: true,
      message: response.message
    };
  }

  return {
    data: response.data?.value_setting ?? "",
    success: true,
    message: "success to get capture day"
  };
}

const lastOpenedService = {
  GetLastOpened,
  InitialLastOpened,
  updateLastOpened
}

export default lastOpenedService