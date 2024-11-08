import NextAuth from "@/auth";
import type { NextApiRequest } from 'next';
export const GET = async (req: unknown, res: unknown) => {
    return await NextAuth(req, res);
}

export const POST = async (req: Request) => {
    const { email, password } = await req.json();

    const result = await NextAuth(req, {
      method: "POST",
      body: JSON.stringify({ email, password }),  // Ensure email and password are in the body
      headers: { "Content-Type": "application/json" },
    });
  
    // Return a new Response object with JSON data
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };