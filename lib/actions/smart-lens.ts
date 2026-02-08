'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

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
  const supabase = await createClient();
  const file = formData.get('file') as File;

  if (!file) {
    return { success: false, message: 'No file provided' };
  }

  // Convert file to buffer for robust server-side upload
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const fileName = `smart-lens/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
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

  const { data: { publicUrl } } = supabase.storage
    .from('uploads')
    .getPublicUrl(fileName);

  try {
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

    const aiFormData = new FormData();
    aiFormData.append('file', file);

    const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
    
    const aiResponse = await fetch(`${AI_SERVICE_URL}/predict`, {
      method: 'POST',
      body: aiFormData,
    });

    if (!aiResponse.ok) {
      throw new Error(`AI Service failed: ${aiResponse.statusText}`);
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

  } catch (error) {
    console.error('Smart Lens Error:', error);
    return { success: false, message: 'Failed to process image with AI' };
  }
}
