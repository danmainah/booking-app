import NextAuth from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: unknown, res: unknown) => {
    return await NextAuth(req, res);
}

export const POST = async (req: NextRequest, res: NextResponse) => {
  return await NextAuth(req, res);
};