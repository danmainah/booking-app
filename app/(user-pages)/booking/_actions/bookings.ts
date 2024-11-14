import { db } from "@/lib/db";
import { Booking } from "@/types";

export const createBooking = async (booking: Booking) => {
   try {
       const create = await db.booking.create({
           data: {
               ...booking,
               accomodation: {
                   connect: {
                       id: booking.accomodation
                   }
               },
               author: {
                   connect: {
                       id: booking.author
                   }
               },
           }
       })
       console.log(create)
       return create
   } catch (error) {
       console.log(error)
       return error
   }
}