"use server"

import { db } from "@/lib/db"
import { AccomodationCreateInput } from "@/types"

export const createAccomodation = async (product: object) => {
    try {
        const create = await db.accomodation.create({
            data: product as AccomodationCreateInput
        })

        return create
    } catch (error) {
        console.log(error)
        return error
    }
}