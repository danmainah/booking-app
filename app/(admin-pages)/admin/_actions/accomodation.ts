'use server'

import { db } from "@/lib/db"
import { Accomodation } from "@/types"

export const createAccomodation = async (product: object) => {
    try {
        const create = await db.accomodation.create({
            data: product as Accomodation
        })

        return create
    } catch (error) {
        console.log(error)
        return error
    }
}

export const getAccomodations = async (): Promise<Accomodation[]> => {
    try {
        const accomodations = await db.accomodation.findMany({
            orderBy: {
                id: "asc"
            }
        })
        return accomodations
    } catch (error) {
        console.log(error)
        return error
    }
}   

