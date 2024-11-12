import { db } from "@/lib/db";
import { Booking } from "@/types";

export const createBooking = async (booking: object) => {
   try {
       const create = await db.booking.create({
           data: booking as Booking
       })
       return create
   } catch (error) {
       return error
   }
}