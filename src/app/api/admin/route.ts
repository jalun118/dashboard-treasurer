import ConnectionDB from "@/lib/ConnectionDB";
import administratorService from "@/modules/administrator/administrator.service";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const tokenUser = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if ((tokenUser as any).role === "super-admin") {
      const searchParams = request.nextUrl.searchParams;
      const isWithMe = searchParams.get('with-me') ?? "false";

      await ConnectionDB();

      const result = await administratorService.GetAllAdmin(tokenUser?.sub ?? "", isWithMe);

      if (result.success) {
        return NextResponse.json(result, { status: 200 });
      }

      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json({});
  } catch (error: any) {
    return NextResponse.json({
      data: null,
      success: false,
      message: `Webhook error: ${error.message}`
    }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const tokenUser = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if ((tokenUser as any).role === "super-admin") {
      const req = await request.json();

      await ConnectionDB();

      const resultUsed = await administratorService.AddNewAdmin(req);

      if (resultUsed.success) {
        return NextResponse.json(resultUsed, { status: 201 });
      }

      return NextResponse.json(resultUsed, { status: 400 });
    }
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
    const req = await request.json();

    const tokenUser = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    await ConnectionDB();

    if ((tokenUser as any).role === "super-admin") {
      const result = await administratorService.ChangePasswordSuper({
        sid: tokenUser?.sub,
        new_password: req.new_password,
      });

      if (result.success) {
        return NextResponse.json(result, { status: 200 });
      }

      return NextResponse.json(result, { status: 400 });
    }

    const result = await administratorService.ChangePassword({
      sid: tokenUser?.sub,
      new_password: req.new_password,
      old_password: req.old_password
    });

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
