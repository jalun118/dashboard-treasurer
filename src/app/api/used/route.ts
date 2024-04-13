import ConnectionDB from "@/lib/ConnectionDB";
import usedService from "@/modules/used/used.service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const req = await request.json();

    await ConnectionDB();

    const result = await usedService.AddUsedSaldo(req);

    if (result?.success) {
      return NextResponse.json(result, {
        status: 201
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
};
