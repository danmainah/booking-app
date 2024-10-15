import { unlink, writeFile } from "fs/promises";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.formData();
  
 const files = Array.from(data.getAll('images'));

 if (files.length === 0) {
  return NextResponse.json({ error: 'No files found' });
}

 const urls: string[] = [];

for(const file of files){
  if (file instanceof File) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const path = `./public/uploads/${file.name}`;

    await writeFile(path, buffer);

    const url = `/uploads/${file.name}`;
    urls.push(url);
  } else {
    console.error('Non-file entry found in files array');
  }
 }

 return NextResponse.json({ urls });
}


export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'No id provided' });
  }

  try {
    await unlink(`./public/uploads/${id}`);
    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete file' });
  }

}