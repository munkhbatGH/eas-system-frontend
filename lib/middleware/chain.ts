import { NextRequest, NextResponse } from "next/server";

export type Middleware = (req: NextRequest) => NextResponse | void;

export function chain(middlewares: Middleware[]) {
  return (req: NextRequest) => {
    for (const mw of middlewares) {
      const res = mw(req);
      if (res) return res; // stop if one middleware returns a response
    }
    return NextResponse.next();
  };
}