"use server";

import type { Accomodation } from "@/types";

import { db } from "@/lib/db";

export const createBooking = async (booking: any) => {
  try {
    // Get the accomodation details
    const accomodation = await db.accomodation.findUnique({
      where: { id: booking.quarters },
    });

    // Check if the accomodation exists
    if (!accomodation) {
      throw new Error(`Accomodation not found with id ${booking.quarters}`);
    }

    // Check if the checkIn and checkOut dates are valid
    if (booking.checkIn >= booking.checkOut) {
      throw new Error(`Invalid dates: checkIn must be before checkOut`);
    }

    // Check if the booking meets the capacity criteria
    const maxBookableRooms = await getMaxBookableRooms(booking.quarters, booking.checkIn, accomodation);
    if (maxBookableRooms <= 0) {
      throw new Error(`No rooms available on ${booking.checkIn.toISOString().split('T')[0]}`);
    }
    if (booking.numberOfRooms > maxBookableRooms) {
      throw new Error(`Cannot book ${booking.numberOfRooms} rooms, only ${maxBookableRooms} rooms available`);
    }

    // Create the booking
    const newBooking = await db.booking.create({
      data: {
        quarters: {
          connect: {
            id: booking.quarters,
          },
        },
        author:{
          connect: {
            id: booking.author,
          },
        },
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        numberOfRooms: booking.numberOfRooms,
      },
    });

    // Update the accomodation capacity
    await updateAccomodationCapacity(accomodation, booking.checkIn, booking.numberOfRooms);
    return {status: 201, booking: newBooking};
  } catch (error) {
    return { status: 500, error: error.message };
  }
};

// Create a method to get the maximum bookable rooms in a given day
export const getMaxBookableRooms = async (quarters: string, date: Date, accomodation: Accomodation) => {
  // Get the existing bookings for the accomodation on the given date
  const existingBookings = await db.booking.findMany({
    where: {
      id: quarters,
      checkIn: {
        gte: date,
        lt: new Date(date.getTime() + 86400000), // 86400000 is the number of milliseconds in a day
      },
    },
  });

  // Calculate the total rooms booked
  const totalBookedRooms = existingBookings.reduce((acc, booking) => acc + booking.numberOfRooms, 0);

  // Return the maximum bookable rooms
  return accomodation.no_of_rooms - totalBookedRooms;
};

// Create a method to update the accomodation capacity
const updateAccomodationCapacity = async (accomodation: Accomodation, date: Date, roomsBooked: number) => {
  // Update the accomodation capacity
  await db.accomodation.update({
    where: { id: accomodation.id },
    data: {
      available: accomodation.no_of_rooms - roomsBooked > 0,
    },
  });
};