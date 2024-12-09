"use client";
import {useEffect, useState } from "react";
import { getReservations, deleteReservation } from "./_actions/reservations";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Reservations() {
    const [data, setData] = useState<{ id: string; accomodationId: { type: string }; authorId: string; checkIn: Date; checkOut: Date; numberOfRooms: number; }[] | undefined>(undefined);
    const session = useSession();

    useEffect(() => {
        const fetchdata = async () => {
            const result = await getReservations(session?.data?.user?.id as string);
            
            if (result) {
                const transformedResult = result.map((item) => ({
                    ...item,
                    accomodationId: { type: item.accomodationId },
                  }));
                  
                  setData(transformedResult);
                setData(transformedResult);
            }
        }
        fetchdata();
    }, [session?.data?.user?.id]);
    if(data === undefined || data.length === 0) return (
        <div className="flex flex-col items-center justify-center mt-10">
            <p className="text-lg font-bold text-gray-900 mt-4">You have no bookings</p>
          </div>
    )

    const removeReservation = async (id: string) => {
        const deleted = await deleteReservation(id)
        if(deleted){
          alert(`Reservation deleted successfully`)
           setData(data.filter((reservation) => reservation.id !== id))
        } else {
          alert(`Error deleting reservation`)
        }
    }
    return (
        data.map((reservation) => (
          <div key={reservation.id}>
            <h3>{reservation.quarters.type}</h3>
            {reservation.quarters.images.map((image: string) => (
               <Image key={image} src={image} alt="product image" width={200} height={200} objectFit="cover"className="md:w-1/4 m-2" />
            ))}
            <p>Check In: {reservation.checkIn.toString()}</p>
            <p>Check Out: {reservation.checkOut.toString()}</p>
            <p>No of rooms reserved: {reservation.numberOfRooms}</p>
            <button onClick={() => removeReservation(reservation.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Delete</button>
          </div>
        ))
        
    );
    
}