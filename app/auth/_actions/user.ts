import { db } from '@/lib/db';
import { hashPassword } from '@/utils/password';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import {z} from 'zod'

const userSchema = z.object({
    username: z.string().min(3).max(100),
    email: z.string().email(),
    password: z.string(),
    role: z.string(),
})

export async function createUser(credentials: z.infer<typeof userSchema>) {
    const data = userSchema.safeParse(credentials)   

    if(data.success === false){
        return data.error.cause
    }
    
    const registedUser = await db.user.findUnique({
        where: {
          email: { equals: credentials.email }
        }
      })

    if(registedUser){
        return {data: "user already exists",status: 409}
    } else {
        const user = await db.user.create({
            data: {
                username: credentials.username,
                email: credentials.email,
                password: await hashPassword(credentials.password),
                role: credentials.role || 'user',
            },
        })
       
        return {data: user,status: 201}
    }
}