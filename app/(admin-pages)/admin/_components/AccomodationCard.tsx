'use client'
import { Accomodation } from "@/types";
import Image from "next/image";
import { deleteAccomodation } from "../_actions/accomodation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function AccomodationCard({ data, router }: { data: Accomodation, router: AppRouterInstance},) {
   
    const handleDelete = async (data) => {
        const deleted = await deleteAccomodation(data)
        if(deleted){
          alert(`Accomodation ${data?.type} deleted successfully`)
           router.refresh()
           router.push('/admin')
        } else {
          alert(`Error deleting Accomodation ${data?.type}`)
        }
    }
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
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleDelete(data)}>Delete</button>
        </div>
    )
}   