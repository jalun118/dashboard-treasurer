import ConnectionDB from "@/lib/ConnectionDB";
import saldoService from "@/modules/saldo/saldo.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await ConnectionDB();

    const result = await saldoService.GetSaldo();

    if (result?.success) {
      return NextResponse.json(result, { status: 200 });
    }

    return NextResponse.json(result, { status: 400 });
  } catch (err: any) {

    return NextResponse.json({
      message: `Webhook error: ${err.message}`
    }, {
      status: 400
    });
  }
}

export async function PUT(request: Request) {
  try {
    const req = await request.json();

    const input_amount = req.amount;

    await ConnectionDB();

    const result = await saldoService.AddSaldo(input_amount);

    if (result?.success) {
      return NextResponse.json(result, {
        status: 200
      });
    }

    return NextResponse.json(result, {
      status: 400
    });

  } catch (error: any) {

    return NextResponse.json({
      data: null,
      success: false,
      message: `Webhook error: ${error.message}`
    }, {
      status: 400
    });
  }
}