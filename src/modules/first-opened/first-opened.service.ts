import { ObjectStandartResponse } from "@/interfaces/object-response";
import { ThisDate } from "@/utils/date-format";
import DayDifference from "@/utils/day-difference";
import captureService from "../capture/capture.service";
import deptPerDayService from "../dept-per-day/dept-per-day.service";
import lastOpenedService from "../last-opened/last-opened.service";
import userService from "../user/user.service";

async function UpdatePaymentDept(): Promise<ObjectStandartResponse> {
  const { data, message: msgGetState, success: isSuccessGetState } = await captureService.GetCaptureState();

  if (!isSuccessGetState) {
    return {
      data: null,
      message: msgGetState,
      success: isSuccessGetState
    };
  }

  if (data?.value_setting === false) {
    return {
      data: null,
      message: "service is not running",
      success: true
    };
  }

  const { success: successGetLastOpen, data: LastDate, message: msgLastOpen } = await lastOpenedService.GetLastOpened();

  if (!successGetLastOpen) {
    return {
      data: null,
      message: msgLastOpen,
      success: successGetLastOpen
    };
  }

  const currentDate = ThisDate();

  if (currentDate !== LastDate) {
    const { data: DataCaptureDay, success: SuccessGetDay, message: msgGetDay } = await captureService.GetCaptureDay();

    if (!SuccessGetDay) {
      return {
        data: null,
        message: msgGetDay,
        success: SuccessGetDay
      };
    }

    const countDay = DayDifference(LastDate ?? "", currentDate, DataCaptureDay ?? []);

    let countDept = 0;
    if (countDay > 0) {
      const { data: AmountDeptPerDay, message: msgAmountPerDay, success: SuccessGetAmountPerDay } = await deptPerDayService.GetDeptPerDay();

      if (!SuccessGetAmountPerDay) {
        return {
          data: null,
          message: msgAmountPerDay,
          success: SuccessGetAmountPerDay
        };
      }

      countDept = countDay * (AmountDeptPerDay ?? 0);
    }

    const { data: dataIncrement, message: msgIncrement, success: successIncrementPayment } = await userService.IncrementAllPaymentDept(countDept);

    if (!successIncrementPayment) {
      return {
        data: null,
        message: msgIncrement,
        success: successIncrementPayment
      };
    }

    return {
      data: dataIncrement,
      message: msgIncrement,
      success: successIncrementPayment
    };
  }

  return {
    data: null,
    message: "date is the same as before",
    success: true
  };
}

const firstOpenedService = {
  UpdatePaymentDept
};

export default firstOpenedService;