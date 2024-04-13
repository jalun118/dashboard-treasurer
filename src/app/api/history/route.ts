import ConnectionDB from "@/lib/ConnectionDB";
import historyService from "@/modules/history/history.service";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
  try {
    await ConnectionDB();

    const resultUsed = await historyService.GetAllHistory();

    if (resultUsed.success) {
      return NextResponse.json(resultUsed, { status: 200 });
    }

    return NextResponse.json(resultUsed, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({
      data: null,
      errors: null,
      success: false,
      message: `Webhook error: ${error.message}`
    }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const typePost = searchParams.get('type');

  if (typePost === "used") {
    try {
      const req = await request.json();

      await ConnectionDB();

      const resultUsed = await historyService.AddHistoryUsed(req);

      if (resultUsed.success) {
        return NextResponse.json(resultUsed, { status: 201 });
      }

      return NextResponse.json(resultUsed, { status: 400 });
    } catch (error: any) {
      return NextResponse.json({
        data: null,
        errors: null,
        success: false,
        message: `Webhook error: ${error.message}`
      }, { status: 400 });
    }
  }

  if (typePost === "payment") {
    try {
      const req = await request.json();

      await ConnectionDB();

      const resultPayment = await historyService.AddHistoryPayment(req);

      if (resultPayment.success) {
        return NextResponse.json(resultPayment, { status: 201 });
      }

      return NextResponse.json(resultPayment, { status: 400 });
    } catch (error: any) {
      return NextResponse.json({
        data: null,
        errors: null,
        success: false,
        message: `Webhook error: ${error.message}`
      }, { status: 400 });
    }
  }
  return NextResponse.json({
    data: null,
    errors: null,
    success: false,
    message: `Webhook error: query type is required`
  }, { status: 400 });

}