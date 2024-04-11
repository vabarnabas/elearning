import { NextRequest, NextResponse } from "next/server"

import { verify } from "./services/verify-token"

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("elearning-token")

  const path = req.nextUrl.pathname
  if (!req.nextUrl.pathname.startsWith("/forgot-password")) {
    if (!req.nextUrl.pathname.startsWith("/reset-password")) {
      if (req.nextUrl.pathname.startsWith("/login")) {
        if (token?.value === undefined || token.value === "undefined") {
          req.cookies.delete("elearning-token")
        }
        return NextResponse.next()
      }
      if (req.nextUrl.pathname.startsWith("/_next")) {
        return NextResponse.next()
      }
      if (!req.nextUrl.pathname.startsWith("/login")) {
        if (token?.value === undefined || token.value === "undefined") {
          req.cookies.delete("elearning-token")
          return NextResponse.redirect(
            new URL(`/login${path !== "/" ? `?origin=${path}` : ""}`, req.url)
          )
        }
        try {
          await verify(token.value, "elearning")
          return NextResponse.next()
        } catch (error) {
          return NextResponse.redirect(
            new URL(`/login${path !== "/" ? `?origin=${path}` : ""}`, req.url)
          )
        }
      }
    }
  }
}
