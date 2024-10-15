"use client";

import { useRouter } from "next/navigation";
import { getAccomodations } from "./_actions/accomodation";
import AccomodationCard from "./_components/AccomodationCard";
import { useEffect, useState } from "react";
import { Accomodation } from "@/types";

export default function Admin() {
  const router = useRouter();
  const [data, setData] = useState<Accomodation[] | undefined>(undefined);

  useEffect(() => {
    getAccomodations().then(setData);
  }, []);

  if (data === undefined) return <p>loading...</p>;

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <h3>No Accomodations</h3>;
    } else {
      return (
        <div className="flex flex-col gap-4">
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
