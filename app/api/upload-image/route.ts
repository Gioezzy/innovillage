/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
// import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@/lib/supabase/server";

// if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
//   console.error('Cloudinary environment variables are missing!');
// }

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true,
// });

export async function POST(request:Request) {
  try{
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error){
      console.error('Supabase upload error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const publicUrl = supabase.storage.from("uploads").getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: publicUrl.data.publicUrl,
      file_name: fileName
    });

    // const bytes = await file.arrayBuffer();
    // const buffer = Buffer.from(bytes);

    // const result = await new Promise<any>((resolve, reject) => {
    //   const uploadStream = cloudinary.uploader.upload_stream(
    //     {
    //       folder: 'nilam-bordir',
    //       resource_type: 'image',
    //       transformation: [
    //         { width: 1200, height: 1200, crop: 'limit' },
    //         { quality: 'auto:good' },
    //         { fetch_format: 'auto' }
    //       ]
    //     },
    //     (error, result) => {
    //       if (error) {
    //         console.error('Cloudinary upload error:', error);
    //         reject(error);
    //       } else {
    //         resolve(result);
    //       }
    //     }
    //   );
      
    //   uploadStream.end(buffer);
    // });

    // return NextResponse.json({
    //   success: true,
    //   url: result.secure_url,
    //   public_id: result.public_id,
    //   width: result.width,
    //   height: result.height,
    //   format: result.format,
    // });
  } catch (error: any){
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed"}, { status: 500 });
    // console.error('Upload error:', error);
    
    // const errorMessage = error instanceof Error ? error.message : 'Upload failed';
    
    // return NextResponse.json({ 
    //   error: 'Upload failed', 
    //   details: errorMessage 
    // }, { status: 500 });
  }
}