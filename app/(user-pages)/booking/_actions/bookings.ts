'use server'

import { db } from "@/lib/db";

const updateCapacityForDay = async (quartersId: string, capacity: number, date: Date) => {
    try {
      const dateTime = new Date(date)
      const update = await db.accomodation.update({
        where: {
          id: quartersId
        },
        data: {
          capacityByDates: {
            create: {
                date: dateTime,
              capacity: capacity
            }
          }
        }
      })
      return update
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const getCapacityForDay = async (quartersId: string, date: Date, capacity: number) => {
    try {
      const available = await db.accomodation.findUnique({
        where: {
          id: quartersId
        },
        select: {
          capacityByDates:{
            where: {
              date: date,
              capacity: capacity
            }
          }
        }
      })
      return available
    } catch (error) {
      console.log(error)
      throw error
    }
  }


export const createBooking = async (booking: any) => {
    try {
        // Validate input data
        if (!booking.quarters || !booking.author || !booking.checkIn || !booking.checkOut) {
            throw new Error("Missing required booking information.");
        }

  // Calculate the number of days between checkIn and checkOut
  const numDays = Math.round((booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 3600 * 24));

  // Check if the booking is valid for each day
  for (let i = 0; i <= numDays; i++) {
    const date = new Date(booking.checkIn.getTime() + (i * 1000 * 3600 * 24));
    const capacity = await getCapacityForDay(booking.quarters, date);
    if (capacity < booking.numberOfRooms) {
      throw new Error(`Not enough capacity for ${booking.quarters} on ${date.toISOString()}`);
    }
  }

  // Create the booking
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

  // Update the capacity for each day
  for (let i = 0; i < numDays; i++) {
    const date = new Date(booking.checkIn.getTime() + (i * 1000 * 3600 * 24));
    await updateCapacityForDay(booking.quarters, date, booking.numberOfRooms);
  }

  return { status: 201, data: create };
        
    } catch (error) {
        console.error("Error creating booking:", error);
        return { error: error.message || "An unknown error occurred." };
    }
}
