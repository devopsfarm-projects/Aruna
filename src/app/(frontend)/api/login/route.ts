// app/api/login/route.js (for App Router)
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  // fake token generation for demo
  const token = "aruna";

  const response = NextResponse.json({ message: "Login successful" });

  response.cookies.set("payload-token", token, {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  return response;
}


