"use client";
import { use, useEffect, useState } from "react";
import { getAccomodations } from "../(admin-pages)/admin/_actions/accomodation";
import Image from "next/image";
import { Accomodation } from "@/types";
import Link from "next/link";
import { signIn } from "next-auth/react";

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

  const signInUrl = signIn()
 if(Array.isArray(data)) {
  return (
    <div>
      <Link href={signInUrl} className="text-blue-500">Add new Accomodation</Link>
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