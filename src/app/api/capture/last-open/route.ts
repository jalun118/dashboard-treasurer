import ConnectionDB from "@/lib/ConnectionDB";
import lastOpenedService from "@/modules/last-opened/last-opened.service";
import { ThisDate } from "@/utils/date-format";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await ConnectionDB();

    const resultResponse = await lastOpenedService.GetLastOpened();

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

export async function POST() {
  try {
    await ConnectionDB();

    const thisDate = ThisDate();

    const resultResponse = await lastOpenedService.updateLastOpened(thisDate);

    if (resultResponse.success) {
      return NextResponse.json(resultResponse, { status: 201 });
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