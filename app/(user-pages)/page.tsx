"use client";
import { useEffect, useState } from "react";
import { getAccomodations } from "../(admin-pages)/admin/_actions/accomodation";
import Image from "next/image";
import { Accomodation } from "@/types";
import Link from "next/link";

export default function Home() {
  const [data, setData] = useState<Accomodation[] | undefined>(undefined);
  
  useEffect(() => {
    getAccomodations().then(setData);
  }, []);

  if(data === undefined || data.length === 0) return (
    <div className="flex flex-col items-center justify-center mt-10">
        <div className="animate-spin rounded-full h-32 w-32 border-b-8 border-blue-600" />
        <p className="text-lg font-bold text-gray-900 mt-4">Loading...</p>
      </div>
  )
 if(Array.isArray(data)) {
  return (
    <div>
      {data.map((accomodation) => (
        <Link href={`/booking/${accomodation.id}`} key={accomodation.type}>
        <div>
          <h3>{accomodation.type}</h3>
        </div>
        <Image
            src={accomodation.images[0]}
            alt="product image"
            width={400}
            height={400}
            objectFit="cover" 
          />
        </Link>
      ))}
    </div>
  )}
}