'use client';

import { Accomodation } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { getIndividualAccomodation, updateAccomodation } from "../../_actions/accomodation";
import Image from "next/image";

export default function EditAccomodation() {
  const router = useRouter();

  const id = useParams().id.toString();

  const [data, setData] = useState<Accomodation | undefined>(undefined);

  const [loading, setLoading] = useState(true);

  const [images, setImages] = useState<FileList | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const accomodation = await getIndividualAccomodation(id);
      if (accomodation && "type" in accomodation) {
        setData(accomodation);
      } else {
        return accomodation;
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-10">
        <div className="animate-spin rounded-full h-32 w-32 border-b-8 border-gray-900" />
        <p className="text-lg font-bold text-gray-900 mt-4">Loading...</p>
      </div>
    );
  } else if (!data || undefined) {
    return <p>No Accomodation found</p>;
  } else {
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
     let urls 
     const result = await res.json();
     urls = result.urls
     if(!urls) {
       urls = data.images
     }

      const updated = await updateAccomodation({
        type: data.type,
        no_of_rooms: data.no_of_rooms,
        images: urls,
        available: data.available,
      });
      if (updated) {
        alert(`Accomodation ${data.type} updated successfully`);
        router.refresh();
        router.push("/admin");
      } else {
        alert(`Error updating Accomodation ${data.type}`);
      }
    }

    return (
      <div className="flex flex-col gap-4">
        <h3>Edit Accomodation</h3>
        <form className="flex flex-col gap-4" onSubmit={(e) => handleSubmit(e)}>
          <div className="flex flex-col gap-2">
            <label htmlFor="type">Type</label>
            <input
              type="text"
              id="type"
              name="type"
              value={data?.type}
              onChange={(e) => setData({ ...data, type: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="no_of_rooms">No. of Rooms</label>
            <input
              type="number"
              id="no_of_rooms"
              name="no_of_rooms"
              value={data?.no_of_rooms}
              onChange={(e) =>
                setData({ ...data, no_of_rooms: Number(e.target.value) })
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

          <div className="w-full px-3">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="images"
            >
              Images
            </label>
            {data.images.map((image) => (
              <Image
                key={image}
                src={image}
                alt="Uploaded image"
                width={200}
                height={200}
                draggable="true"
                onDragStart={(e) => {
                  e.dataTransfer.setData("image", image);
                }}
              />
            ))}
            <p>You can drag and drop images you want to reuse below</p>
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
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                const files = e.dataTransfer.files;
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
              }}
            />
            <div className="flex flex-wrap">
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
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}
