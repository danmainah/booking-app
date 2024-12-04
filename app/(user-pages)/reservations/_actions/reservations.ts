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

export const deleteReservation = async (id: string) => {
    try {
        const deleted = await db.booking.delete({
            where: {
                id
            }
        })
        return deleted
    } catch (error) {
        console.log(error)
        throw error
    }
}
