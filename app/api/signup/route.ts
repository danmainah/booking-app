import { NextResponse } from "next/server";
import { createUser } from "@/app/auth/_actions/user";

//Handling POST request
export async function POST(req: { json: () => any; }, res: NextResponse) {
    const body = await req.json()

    try{
        const addUser = await createUser(body)
        if(addUser){
            return NextResponse.json(addUser)
        } else {
            return NextResponse.json({error: 'User creation failed'})
        }
    } catch(error) {
        return NextResponse.json({error})
    }
}