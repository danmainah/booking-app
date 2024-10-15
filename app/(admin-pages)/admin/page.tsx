import { getAccomodations } from "./_actions/accomodation";
import AccomodationCard from "./_components/AccomodationCard";

export default async function Admin() {
    const data = await getAccomodations();
    
    if(data === undefined) return <p>loading...</p>

    if(Array.isArray(data)) {
        return (
            <div className="flex flex-col gap-4">
                {data.map((accomodation) => (
                    <AccomodationCard data={accomodation} key={accomodation.type}/>
                ))}
            </div>
        )
    } else {
        return <p>Error fetching accomodations</p>
    }
}