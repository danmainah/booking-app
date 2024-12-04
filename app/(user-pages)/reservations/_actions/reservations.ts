"use server"

import { db } from "@/lib/db"

export const getReservations = async (id: string) => {
    try {
        // get reservation using user id
        const reservations = await db.booking.findMany({
            where: {
                author: {
                    id: id
                }
            }
        })
        return reservations
    } catch (error) {
        console.log(error)
        throw error
    }   
}