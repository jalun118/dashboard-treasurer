import ConnectionDB from "@/lib/ConnectionDB";
import captureDayService from "@/modules/capture/capture.service";
import lastOpenedService from "@/modules/last-opened/last-opened.service";
import { ThisDate } from "@/utils/date-format";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await ConnectionDB();

    const resultResponse = await captureDayService.GetCaptureState();

    if (resultResponse.success) {
      return NextResponse.json(resultResponse, { status: 200 });
    }

    return NextResponse.json(resultResponse, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({
      data: null,
      errors: null,
      success: false,
      message: `Webhook error: ${error.message}`
    }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const valueState = body.state_data;

    await ConnectionDB();

    const resultResponse = await captureDayService.ChangeState(valueState);

    if (!resultResponse.success) {
      return NextResponse.json(resultResponse, { status: 400 });
    }

    const currentDate = ThisDate();

    const resultResponseChangeLastDay = await lastOpenedService.updateLastOpened(currentDate);

    if (resultResponseChangeLastDay.success) {
      return NextResponse.json(resultResponse, { status: 200 });
    }

    return NextResponse.json(resultResponseChangeLastDay, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({
      data: null,
      errors: null,
      success: false,
      message: `Webhook error: ${error.message}`
    }, { status: 400 });
  }
}

