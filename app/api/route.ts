import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest , response:NextResponse){
  return NextResponse.json({
    message: "Hello from the demo API route!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: "1.0.0"
  });
}