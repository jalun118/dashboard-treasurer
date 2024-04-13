import ConnectionDB from "@/lib/ConnectionDB";
import deptPerDayService from "@/modules/dept-per-day/dept-per-day.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await ConnectionDB();

    const resultResponse = await deptPerDayService.GetDeptPerDay();

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

    const amountValue = req.amount;

    const resultResponse = await deptPerDayService.UpdateDeptPerDay(amountValue)

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