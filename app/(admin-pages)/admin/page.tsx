"use client";

import { useRouter } from "next/navigation";
import { getAccomodations } from "./_actions/accomodation";
import AccomodationCard from "./_components/AccomodationCard";
import { useEffect, useState } from "react";
import { Accomodation } from "@/types";
import Link from "next/link";

export default function Admin() {
  const router = useRouter();
  const [data, setData] = useState<Accomodation[] | undefined>(undefined);

  useEffect(() => {
    getAccomodations().then(setData);
  }, []);

  if (data === undefined) return <p>loading...</p>;

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return (
        <div>
            <h3>No Accomodations</h3>
            <Link href="/admin/addNew" className="text-blue-500">Add new Accomodation</Link>
        </div>
      )
    } else {
      return (
        <div className="flex flex-col gap-4">
          <Link href="/admin/addNew" className="text-blue-500">Add new Accomodation</Link>
          {data.map((accomodation) => (
            <AccomodationCard
              data={accomodation}
              router={router}
              key={accomodation.type}
            />
          ))}
        </div>
      );
    }
  } else {
    return <h3>Error loading Accomodations</h3>;
  }
}
