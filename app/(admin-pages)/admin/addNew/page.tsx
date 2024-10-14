"use client";

import { AccomodationCreateInput } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { db } from "@/lib/db";

const AddAccomodation = () => {
    const [data, setData] = useState<AccomodationCreateInput>({
        type: "",
        no_of_rooms: 0,
        images: [],
        available: false
    })
    const [images, setImages] = useState<FileList | null>(null)

    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData();

        if (images) {
            Array.from(images).forEach((image) => {
                formData.append(`images`, image);
            });
        }

        const res = await fetch('/api/media', {
            method: 'POST',
            body: formData
        })

        if (!res.ok) {
            alert(`Error uploading images`);
            return
        }

        const urls = await res.json()

        const accomodationData = {
            ...data,
            images: urls.urls
        }

        try {
            await db.accomodation.create({
                data: accomodationData
            })
            alert('Accomodation added successfully')
            router.push('/admin')
        } catch (error) {
            console.log(error)
            alert(error)
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="type">Type</label>
                <input
                    type="text"
                    className="form-control"
                    id="type"
                    name="type"
                    value={data.type}
                    onChange={(e) => setData({ ...data, type: e.target.value })}
                />
            </div>
            <div className="form-group">
                <label htmlFor="no_of_rooms">No. of Rooms</label>
                <input
                    type="number"
                    className="form-control"
                    id="no_of_rooms"
                    name="no_of_rooms"
                    value={data.no_of_rooms}
                    onChange={(e) => setData({ ...data, no_of_rooms: parseInt(e.target.value) })}
                />
            </div>
            <div className="form-group">
                <label htmlFor="available">Available</label>
                <input
                    type="checkbox"
                    className="form-control"
                    id="available"
                    name="available"
                    checked={data.available}
                    onChange={(e) => setData({ ...data, available: e.target.checked })}
                />
            </div>
            <div className="form-group">
                <label htmlFor="images">Images</label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="images"
                    type="file"
                    name="images"
                    multiple
                    onChange={(e) => {
                        const files = e.target.files;
                        if (files) {
                            setImages((images) => {
                                const newImages = new DataTransfer();
                                if (images) {
                                    for (let i = 0; i < images.length; i++) {
                                        newImages.items.add(images[i]);
                                    }
                                }
                                if (files) {
                                    for (let i = 0; i < files.length; i++) {
                                        newImages.items.add(files[i]);
                                    }
                                }
                                return newImages.files;
                            });
                        }
                    }}
                />
            </div>
            <div className="flex flex-wrap">
                {images && Array.from(images).map((image, index) => (
                    <div key={index} className="mr-4">
                        <Image src={URL.createObjectURL(image)} alt="product image" width={100} height={100} objectFit="cover" />
                    </div>
                ))}
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
};

export default AddAccomodation;