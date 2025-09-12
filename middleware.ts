import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Logger
  console.log("Path:", req.nextUrl.pathname);

//   // Auth
//   if (req.nextUrl.pathname.startsWith("/admin")) {
//     const token = req.cookies.get("token");
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//   }

//   // Another check...
//   if (req.nextUrl.pathname.startsWith("/api/private")) {
//     // block requests without API key
//     if (!req.headers.get("x-api-key")) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//   }

  return NextResponse.next();
}