import ConnectionDB from "@/lib/ConnectionDB";
import captureService from "@/modules/capture/capture.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await ConnectionDB();

    const resultResponse = await captureService.GetCaptureDay();

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

export async function PUT(request: Request) {
  try {
    const req = await request.json();

    const arrayData = req.array_day;

    const resultResponse = await captureService.SetArrayDayCapture(arrayData);

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