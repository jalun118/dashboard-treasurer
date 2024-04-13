import ConnectionDB from "@/lib/ConnectionDB";
import userService from "@/modules/user/user.service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const req = await request.json();

    const input_amount = req.amount;

    await ConnectionDB();

    const result = await userService.IncrementAllPaymentDept(input_amount);

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