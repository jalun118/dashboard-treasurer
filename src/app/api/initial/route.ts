import ConnectionDB from "@/lib/ConnectionDB";
import captureService from "@/modules/capture/capture.service";
import deptPerDayService from "@/modules/dept-per-day/dept-per-day.service";
import lastOpenedService from "@/modules/last-opened/last-opened.service";
import saldoService from "@/modules/saldo/saldo.service";
import { ThisDate } from "@/utils/date-format";
import { NextRequest, NextResponse } from "next/server";

const init = {
  SALDO: 0,
  CAPTURE_DAY: "[0,1,2,3,4,5,6]",
  CAPTURE_STATE: true,
  LAST_OPEN: ThisDate(),
  DEP_PER_DAY: 1000
};

interface iStatusInit {
  name: string;
  status: boolean;
  message: string;
}

type RequestObj = {
  init_saldo: number;
  array_days: string;
  capture_state: boolean;
  dept_amount: number;
};

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();

    const objReq: RequestObj = {
      init_saldo: req.init_saldo ?? init.SALDO,
      array_days: req.array_days ?? init.CAPTURE_DAY,
      capture_state: req.capture_state ?? init.CAPTURE_STATE,
      dept_amount: req.dept_amount ?? init.DEP_PER_DAY,
    };


    const statusInit: iStatusInit[] = [];
    await ConnectionDB();

    const { success: StatusInitSaldo, message: MessageInitSaldo } = await saldoService.InitialSaldo(objReq.init_saldo);
    statusInit.push({ name: "saldo", status: StatusInitSaldo, message: MessageInitSaldo });
    const { success: StatusInitLastOpen, message: MessageInitLastOpen } = await lastOpenedService.InitialLastOpened(init.LAST_OPEN);
    statusInit.push({ name: "last-open", status: StatusInitLastOpen, message: MessageInitLastOpen });
    const { success: StatusInitDayCapture, message: MessageInitDayCapture } = await captureService.InitialSetDayCapture(objReq.array_days);
    statusInit.push({ name: "day-capture", status: StatusInitDayCapture, message: MessageInitDayCapture });
    const { success: StatusInitDayCaptureState, message: MessageInitDayCaptureState } = await captureService.InitialCaptureState(objReq.capture_state);
    statusInit.push({ name: "day-capture-state", status: StatusInitDayCaptureState, message: MessageInitDayCaptureState });
    const { success: StatusInitDeptPerDay, message: MessageInitDeptPerDay } = await deptPerDayService.InitialDeptPerDay(objReq.dept_amount);
    statusInit.push({ name: "dep-per-day", status: StatusInitDeptPerDay, message: MessageInitDeptPerDay });

    return NextResponse.json({
      info: statusInit,
      success: true,
      message: `success to initial database`
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      info: null,
      success: false,
      message: `Webhook error: ${error.message}`
    }, { status: 400 });
  }
};
