"use client";

import { useRouter, useParams } from "next/navigation";
import { getIndividualAccomodation } from "@/app/(admin-pages)/admin/_actions/accomodation";
import { Accomodation } from "@/types";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Booking() {
    const router = useRouter();
    const id = useParams().id.toString();

    const [accomodation, setAccomodation] = useState<Accomodation>();

    useEffect(() => {
    const fetchdata = async () => {
      
        const data = await getIndividualAccomodation(id);
        if(data && "type" in data){
            setAccomodation(data);
        }
    }
    fetchdata();
    }, [id]);
    return (
        <div>
            <h1>Add A Booking</h1>
            <Image src={accomodation?.images[0] ?? ''} width={400} height={400} alt="product image" />
            <form>
                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name" />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" id="email" />
                </div>
                <div>
                    <label htmlFor="phone">Phone</label>
                    <input type="text" name="phone" id="phone" />
                </div>
                <div>
                    <label htmlFor="checkin">Check-in</label>
                    <input type="date" name="checkin" id="checkin" />
                </div>
                <div>
                    <label htmlFor="checkout">Check-out</label>
                    <input type="date" name="checkout" id="checkout" />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

