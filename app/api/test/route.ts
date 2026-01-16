import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function GET() {
  try {
    const result = await cloudinary.api.ping();
    
    return NextResponse.json({
      success: true,
      message: 'Cloudinary connected!',
      status: result.status,
      config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME  ? '✅ Set' : '❌ Not Set',
        api_key: process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Not Set',
        api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Not Set',
      }
    });
  } catch (error) {
    console.error('Cloudinary test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Connection failed',
    }, { status: 500 });
  }
}