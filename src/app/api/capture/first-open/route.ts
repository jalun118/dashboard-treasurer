import ConnectionDB from "@/lib/ConnectionDB";
import firstOpenedService from "@/modules/first-opened/first-opened.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await ConnectionDB();

    const result = await firstOpenedService.UpdatePaymentDept();

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    }

    return NextResponse.json(result, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({
      data: null,
      errors: null,
      success: false,
      message: `Webhook error: ${error.message}`
    }, { status: 400 });
  }
}