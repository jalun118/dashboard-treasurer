import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server";

export default function withAuth(middleware: NextMiddleware, requiredAuth: string[] = []) {
  return async (req: NextRequest, next: NextFetchEvent) => {
    const pathname = req.nextUrl.pathname;

    if (requiredAuth.includes(pathname)) {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
      });

      if (!token) {
        const url = new URL("/api/auth/signin", req.url);
        if (!url.searchParams.get("callbackUrl")) {
          url.searchParams.set("callbackUrl", encodeURI(req.url));
        }
        return NextResponse.redirect(url);
      }
    }
    return middleware(req, next);
  };
};
