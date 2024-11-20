"use client";
import {useEffect, useState } from "react";
import { getReservations } from "./_actions/reservations";
import { useSession } from "next-auth/react";

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
    return (
        data.map((reservation) => (
          <div key={reservation.id}>
            <h3>{reservation.accomodationId.type}</h3>
            <p>{reservation.checkIn.toString()}</p>
            <p>{reservation.checkOut.toString()}</p>
            <p>{reservation.numberOfRooms}</p>
          </div>
        ))
        
    );
    
}