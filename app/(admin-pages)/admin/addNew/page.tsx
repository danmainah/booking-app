"use client";

import { Accomodation } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { createAccomodation } from "../_actions/accomodation";

const AddAccomodation = () => {
  const [data, setData] = useState<Accomodation>({
    type: "",
    no_of_rooms: 1,
    images: [],
    available: true,
  });
  const [images, setImages] = useState<FileList | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    if (images) {
      Array.from(images).forEach((image) => {
        formData.append(`images`, image);
      });
    }

    const res = await fetch("/api/media", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      alert(`Error uploading images`);
      return;
    }
  
    const urls = await res.json();
    let loadedImages: string[] = [];
    if(urls) {
      loadedImages = urls.urls
    }
    console.log(loadedImages)
    const create = await createAccomodation({
      type: data.type,
      no_of_rooms: data.no_of_rooms,
      images: loadedImages,
      available: data.available,
    });

    if (!create) {
      alert(`Error creating accomodation`);
      return;
    } else {
      alert(`Accomodation created successfully`);
      router.push("/admin");
    }
  };
  return (
    <div className="max-w-3xl mx-auto p-4 mt-10 bg-white rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-4">Add Clothing Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="type">Type </label>
          <input
            type="text"
            className="form-control"
            id="type"
            name="type"
            value={data.type}
            required
            onChange={(e) => setData({ ...data, type: e.target.value })}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="no_of_rooms">No. of Rooms </label>
          <input
            type="number"
            className="form-control"
            id="no_of_rooms"
            name="no_of_rooms"
            required
            value={data.no_of_rooms}
            onChange={(e) =>
              setData({ ...data, no_of_rooms: parseInt(e.target.value) })
            }
          />
        </div>
        <div className="form-group mb-3">
          <div className="flex items-center">
            <span
              className={`mr-2 ${
                data.available ? "text-green-500" : "text-red-500"
              }`}
            >
              {data.available ? "Available" : "Unavailable"}
            </span>
            <button
              type="button"
              onClick={() =>
                setData({ ...data, available: !data.available })
              }
              className={`bg-${
                data.available ? "green" : "red"
              }-500 hover:bg-${
                data.available ? "green" : "red"
              }-700 text-gray-800 font-bold py-2 px-4 rounded`}
            >
              {data.available ? "Mark as Unavailable" : "Mark as Available"}
            </button>
          </div>
        </div>
        <div className="form-group mb-2">
          <label htmlFor="images">Images</label>
          <input
            className="shadow appearance-none w-auto border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="images"
            type="file"
            name="images"
            required
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
        <div className="flex flex-wrap m-4">
          {images &&
            Array.from(images).map((image, index) => (
              <div key={index} className="mr-4">
                <Image
                  src={URL.createObjectURL(image)}
                  alt="product image"
                  width={100}
                  height={100}
                  objectFit="cover"
                />
              </div>
            ))}
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddAccomodation;
