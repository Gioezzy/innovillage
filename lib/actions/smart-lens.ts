'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import sharp from 'sharp';

export type SmartLensResult = {
  success: boolean;
  message?: string;
  data?: {
    motifName: string;
    confidence: number;
    philosophy?: string | null;
    imageUrl: string;
    history?: string | null;
    referenceImageUrl?: string | null;
    origin?: string | null;
    relatedProducts?: {
      id: string;
      name: string;
      price: number;
      slug: string;
      imageUrls: string[];
    }[];
  };
};

export async function scanSongket(formData: FormData): Promise<SmartLensResult> {
  const supabaseAdmin = await createAdminClient();
  const supabase = await createClient(); // Still need regular client for auth check later

  try {
    const file = formData.get('file') as File;

    if (!file) {
      return { success: false, message: 'No file provided' };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = `smart-lens/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('uploads')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase Upload Error:', uploadError);
      return { 
        success: false, 
        message: `Gagal mengupload gambar: ${uploadError.message}` 
      };
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('uploads')
      .getPublicUrl(fileName);

    // Continue with user check using regular client (to respect auth state)
    const { data: { user } } = await supabase.auth.getUser();
    
    let imageRecordId = null;

    if (user) {
        const { data: insertData, error: insertError } = await supabase
        .from('motif_images')
        .insert({
            file_url: publicUrl,
            uploaded_by: user.id,
            status: 'pending',
        })
        .select('id')
        .single();
        
        if (insertError) {
             console.error("DB Insert Error (motif_images):", insertError);
        } else if (insertData) {
            imageRecordId = insertData.id;
        }
    } else {
        console.log("Skipping DB insert: User not logged in.");
    }

    // --- Optimization: Resize image before sending to AI ---
    console.time('Image_Optimization_Time');
    const optimizedBuffer = await sharp(buffer)
      .resize(512, 512, { fit: 'inside' }) // 512px max dimension
      .toFormat('jpeg', { quality: 80 })
      .toBuffer();
    console.timeEnd('Image_Optimization_Time');

    const aiFormData = new FormData();
    const blob = new Blob([optimizedBuffer as any], { type: 'image/jpeg' });
    console.log(`original size: ${buffer.length} bytes -> optimized size: ${optimizedBuffer.length} bytes`);
    aiFormData.append('file', blob, 'optimized.jpg');

    const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
    console.log(`Using AI Service at: ${AI_SERVICE_URL}`);
    console.time('AI_Response_Time');

    let aiResponse;
    try {
        // Removed manual timeout to allow slow connections/cold starts to finish
        aiResponse = await fetch(`${AI_SERVICE_URL}/predict`, {
          method: 'POST',
          body: aiFormData,
        });
    } catch (fetchError: any) {
        console.error('AI Service Fetch Error:', fetchError);
        return { success: false, message: `Gagal menghubungi AI Service: ${fetchError.message}` };
    } finally {
        console.timeEnd('AI_Response_Time');
    }

    if (!aiResponse.ok) {
      console.error(`AI Service Failed: ${aiResponse.status} ${aiResponse.statusText}`);
      throw new Error(`AI Service failed with status: ${aiResponse.status}`);
    }

    const aiResult = await aiResponse.json();
    const { data: motifData } = await supabase
      .from('motifs')
      .select('*')
      .ilike('name', `%${aiResult.motif}%`)
      .single();

    let relatedProducts: any[] = [];
    if (motifData) {
        const { data: products } = await supabase
            .from('products')
            .select('id, name, price, slug, image_urls')
            .eq('motif_id', motifData.id)
            .eq('is_active', true)
            .limit(3);
        
        if (products) {
            relatedProducts = products.map(p => ({
                id: p.id,
                name: p.name,
                price: p.price,
                slug: p.slug,
                imageUrls: p.image_urls || []
            }));
        }
    }

    // Update history record if it exists
    if (imageRecordId) {
        await supabase
            .from('motif_images')
            .update({
                motif_id: motifData?.id || null,
                status: motifData ? 'verified' : 'pending',
                file_metadata: {
                    confidence: aiResult.confidence,
                    ai_prediction: aiResult.motif,
                    related_products_count: relatedProducts.length
                }
            })
            .eq('id', imageRecordId);
    }

    return {
      success: true,
      data: {
        motifName: motifData?.name || aiResult.motif,
        confidence: aiResult.confidence,
        imageUrl: publicUrl,
        philosophy: motifData?.philosophy || "Filosofi belum tersedia di database untuk motif ini.",
        history: motifData?.historical_note,
        referenceImageUrl: motifData?.image_url,
        origin: motifData?.origin_region,
        relatedProducts: relatedProducts
      },
    };

  } catch (error: any) {
    console.error('Smart Lens Global Error:', error);
    return { success: false, message: `Terjadi kesalahan sistem: ${error.message || 'Unknown error'}` };
  }
}
