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

  const [booking, setBooking] = useState<Booking>({
    checkIn: new Date(),
    checkOut: new Date(new Date().getTime() + 86400000),
    accomodation: '',
    author: "",
  });
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


  if (session === undefined || session.status === "unauthenticated")
    return alert("Please login"), router.push("/auth/signin");

  const handleSubmit = async () => {
     const booked = await createBooking({
        accomodation: id,
        author: user?.id,
        checkIn: booking?.checkIn,
        checkOut: booking?.checkOut
     })
     console.log(booked)
     if (!booked) {
        alert(`Error making the Reservation`);
        return;
      } else {
        alert(`Reservation Made Successfully`);
        console.log(booked)
        router.push("/");
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
          min={new Date(new Date().getTime() + 86400000).toISOString().split('T')[0]}
          onChange={(e) => setBooking({ ...booking, checkOut: new Date(e.target.value) })}
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
