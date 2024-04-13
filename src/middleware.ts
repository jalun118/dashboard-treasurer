// import { NextResponse } from "next/server";
// import withAuth from "./middlewares/withAuth";

// export function mainMiddleware() {
//   const res = NextResponse.next();
//   return res;
// }

// export default withAuth(mainMiddleware, [])

export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/:path*"]
};
