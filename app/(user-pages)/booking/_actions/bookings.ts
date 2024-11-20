'use server'

import { db } from "@/lib/db";

const updateCapacity =  async (quartersId: string, capacity: number) => {
    try {
        const update = await db.quarters.update({
            where: {
                id: quartersId
            },
            data: {
                capacity
            }
        })
        return update
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const bookingDay = async (capacity: number, checkOut: Date) => {
    if(capacity === 0){
        return checkOut
    }
    else {
        return new Date()
    }
}
export const createBooking = async (booking: any) => {
    try {
        // Validate input data
        if (!booking.quarters || !booking.author || !booking.checkIn || !booking.checkOut) {
            throw new Error("Missing required booking information.");
        }

        updateCapacity(booking.quarters, booking.numberOfRooms)
        const create = await db.booking.create({
            data: {
                checkIn: booking.checkIn as Date,
                checkOut: booking.checkOut as Date,
                numberOfRooms: booking.numberOfRooms as number,
                quarters: {
                    connect: {
                        id: booking.quarters as string
                    }
                },
                author: {
                    connect: {
                        id: booking.author as string
                    }
                },
            }
        });
        return { status: 201, data: create };
        
    } catch (error) {
        console.error("Error creating booking:", error);
        return { error: error.message || "An unknown error occurred." };
    }
}
