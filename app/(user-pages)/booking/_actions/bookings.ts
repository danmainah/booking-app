'use server'

import { db } from "@/lib/db";
import { stat } from "fs";

export const createBooking = async (booking: any) => {
    try {
        // Validate input data
        if (!booking.quarters || !booking.author || !booking.checkIn || !booking.checkOut) {
            throw new Error("Missing required booking information.");
        }

        const create = await db.booking.create({
            data: {
                checkIn: booking.checkIn as Date,
                checkOut: booking.checkOut as Date,
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
