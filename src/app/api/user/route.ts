import ConnectionDB from "@/lib/ConnectionDB";
import userService from "@/modules/user/user.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await ConnectionDB();

    const results = await userService.GetAllUser();

    if (results.success) {
      return NextResponse.json(results, { status: 200 });
    }

    return NextResponse.json(results, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({
      data: null,
      errors: null,
      success: false,
      message: `Webhook error: ${error.message}`
    }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const res = await request.json();

    await ConnectionDB();

    const resultAdd = await userService.AddUser(res);

    if (resultAdd.success) {
      return NextResponse.json(resultAdd, { status: 201 });
    }

    return NextResponse.json(resultAdd, { status: 400 });
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

    await ConnectionDB();

    const resultAddAmount = await userService.AddAmountSaldoUser(req);

    if (resultAddAmount.success) {
      return NextResponse.json(resultAddAmount, { status: 200 });
    }

    return NextResponse.json(resultAddAmount, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({
      data: null,
      errors: null,
      success: false,
      message: `Webhook error: ${error.message}`
    }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const stringId = searchParams.get('sid');

    await ConnectionDB();

    const resultAddAmount: any = await userService.DeleteUser(stringId);

    if (resultAddAmount?.success) {
      return NextResponse.json(resultAddAmount, { status: 200 });
    }

    return NextResponse.json(resultAddAmount, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({
      data: null,
      errors: null,
      success: false,
      message: `Webhook error: ${error.message}`
    }, { status: 400 });
  }
}