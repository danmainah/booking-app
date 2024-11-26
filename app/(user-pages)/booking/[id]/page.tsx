"use client";

import { useRouter, useParams } from "next/navigation";
import { getIndividualAccomodation } from "@/app/(admin-pages)/admin/_actions/accomodation";
import type {Accomodation, Booking } from "@/types";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { createBooking } from "../_actions/bookings";

export default function Booking() {
  const router = useRouter();
  const id = useParams().id.toString();
  const session = useSession();
  const user = session?.data?.user as any;

  const [data, setData] = useState<Accomodation>();

  useEffect(() => {
    const fetchdata = async () => {
      const result = await getIndividualAccomodation(id);
      if (result && "type" in result) {
        setData(result);
      }
    };
    fetchdata();
  }, [id]);

  const [booking, setBooking] = useState<Booking>({
    checkIn: new Date(),
    checkOut: new Date(new Date().getTime() + 86400000),
    quarters: data?.id as string,
    author: user?.id as string,
    numberOfRooms: 1
  });

  if (session === undefined || session.status === "unauthenticated")
    return alert("Please login"), router.push("/auth/signin");
  const handleSubmit = async () => {
     const booked = await createBooking({
        quarters: id,
        author: user?.id,
        checkIn: booking?.checkIn,
        checkOut: booking?.checkOut,
        numberOfRooms: booking?.numberOfRooms
     })
     console.log(booked)
     if (booked.status === 201) {
        alert(`Reservation Made Successfully`);
        router.push("/reservations");
        return
      } else {
        alert(booked.error);
        router.refresh();
      }
  }

  return (
    <div>
      <h1>Add A Booking</h1>
      <Image
        src={data?.images[0] ?? ""}
        width={400}
        height={400}
        alt="product image"
      />
      <p>{data?.type}</p>

      <form className="max-w-md mx-auto p-4 bg-white rounded shadow-md"  onSubmit={handleSubmit}>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="check-in"
        >
          Check-in:
        </label>
        <input
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          type="date"
          id="check-in"
          name="check-in"
          required
          min={ new Date().toISOString().split('T')[0] }
          onChange={(e) => setBooking({...booking, checkIn: new Date(e.target.value)})}
        />
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="check-out"
        >
          Check-out:
        </label>
        <input
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          type="date"
          id="check-out"
          name="check-out"
          required
          min={new Date(booking.checkIn.getTime() + 86400000).toISOString().split('T')[0]}
          onChange={(e) => setBooking({ ...booking, checkOut: new Date(e.target.value) })}
        />
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="number-of-rooms"
        >
          Number of Rooms:
        </label>
        <input
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          type="number"
          id="number-of-rooms"
          name="number-of-rooms"
          required
          onChange={(e) => setBooking({ ...booking, numberOfRooms: parseInt(e.target.value) })}
        />
        <button
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Book Now
        </button>
      </form>
    </div>
  );
}
