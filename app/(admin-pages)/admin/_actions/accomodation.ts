'use server'

import { db } from "@/lib/db"
import { Accomodation } from "@/types"

export const createAccomodation = async (product: object) => {
    try {
        const create = await db.accomodation.create({
            data: product as Accomodation
        })

        return create
    } catch (error) {
        console.log(error)
        return error
    }
}

export const getAccomodations = async (): Promise<Accomodation[]> => {
    try {
        const accomodations = await db.accomodation.findMany({
            orderBy: {
                id: "asc"
            }
        })
        return accomodations
    } catch (error) {
        console.log(error)
        throw error
    }
}   

export const deleteImages = async (images: string[]) => {
    try {
        const accomodations = await db.accomodation.findMany();
        const usedImages = new Set(accomodations.flatMap(accommodation => accommodation.images));

        const deleted = await Promise.all(images.map(async (image) => {
            if (!usedImages.has(image)) {
                const url = new URL('/api/media', 'http://localhost:3000');
                const res = await fetch(url, {
                    method: 'DELETE',
                    body: JSON.stringify({ id: image.split('/').pop() }),
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                const data = await res.json();
                return data;
            }
        }));

        return deleted;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const deleteAccomodation = async (accomodation: Accomodation) => { 
    try {    
        const deleted = await deleteImages(accomodation.images)
        if(deleted){
            const deleteAccomodation = await db.accomodation.delete({
                where: {
                    type: accomodation.type
                }
            })
            return deleteAccomodation
        }
        return deleted

    } catch (error) {
        console.log(error)
        throw error
    }
}