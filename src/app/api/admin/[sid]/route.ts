import ConnectionDB from "@/lib/ConnectionDB";
import administratorService from "@/modules/administrator/administrator.service";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { sid: string; }; }) {
  try {
    const tokenUser = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if ((tokenUser as any).role === "super-admin") {
      await ConnectionDB();

      const result = await administratorService.GetOneAdmin(params.sid);

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
};

export async function PUT(request: NextRequest, { params }: { params: { sid: string; }; }) {
  try {
    const req = await request.json();

    const tokenUser = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if ((tokenUser as any).role === "super-admin") {
      await ConnectionDB();

      const result = await administratorService.ChangePasswordSuper({
        sid: params.sid,
        new_password: req.new_password
      });

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
};


export async function DELETE(request: NextRequest, { params }: { params: { sid: string; }; }) {
  try {
    const tokenUser = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if ((tokenUser as any).role === "super-admin") {
      await ConnectionDB();

      const result = await administratorService.DeleteAdmin(params.sid);

      if (result.success) {
        return NextResponse.json(result, { status: 200 });
      }

      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      data: null,
      success: false,
      message: `Webhook error: ${error.message}`
    }, { status: 400 });
  }
}
