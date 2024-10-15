import { Accomodation } from "@/types";
import Image from "next/image";

export default function AccomodationCard({ data }: { data: Accomodation }) {
  console.log(data)
    return (
        <div className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 p-4">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{data?.type}</h5> 
            <div className="flex flex-wrap">
                {data && Array.from(data.images).map((image, index) => (
                  <div key={index} className="mr-4">
                    <Image
                      src={image}
                      alt="product image"
                      width={100}
                      height={100}
                      objectFit="cover"
                    />
                  </div>
                ))}
              </div>
            <p className="font-normal text-gray-700 dark:text-gray-400">{data?.no_of_rooms}</p>
            <p className="font-normal text-gray-700 dark:text-gray-400">{data?.available ? "Available" : "Not Available"}</p>  
        </div>
    )
}   