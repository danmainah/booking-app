import NextAuth from "@/auth";

export const GET = async (req: unknown, res: unknown) => {
    return await NextAuth(req, res);
}

export const POST = async (req: unknown, res: unknown) => {
    return await NextAuth(req, res);
}
