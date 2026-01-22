import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request){
  try{
    const supabase = await createClient()

    const {data: {user}, error:authError} = await supabase.auth.getUser()

    if(authError || !user){
      return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    const { data: profile} = await supabase
      .from('profiles')
      .select('role, store_id')
      .eq('id', user.id)
      .single()

    const allowedRoles = ['admin', 'artisan', 'super_admin'];
    if(!profile || !allowedRoles.includes(profile.role || '')){
      return NextResponse.json({error: 'Forbidden - Sellers only'}, {status: 403})
    }

    let storeId = null;
    if (profile.role !== 'super_admin') {
      if (profile.store_id) {
          storeId = profile.store_id;
      } else {
        const { data: store } = await supabase.from('stores').select('id').eq('owner_id', user.id).single();
        if (!store) {
            return NextResponse.json({error: 'You need to open a shop first'}, {status: 400})
        }
        storeId = store.id;
      }
    } else {
        const bodyStoreId = (await request.clone().json()).store_id; 
    }

    const body = await request.json()
    const {
      name,
      slug,
      description,
      price,
      stock_quantity,
      category_id,
      motif_id,
      material,
      color,
      size,
      weaving_time_days,
      is_limited,
      is_active,
      image_urls,
      store_id: bodyStoreId 
    } = body
    
    if (profile.role === 'super_admin') {
        storeId = bodyStoreId || null;
    }
    
    if (profile.role !== 'super_admin' && !storeId) {
      return NextResponse.json({error: 'Store not found'}, {status: 400})
    }

    const { data: product, error: insertError} = await supabase
      .from('products')
      .insert({
        name,
        slug,
        description,
        price,
        stock_quantity,
        category_id,
        motif_id: motif_id || null,
        material,
        color,
        size,
        weaving_time_days,
        is_limited,
        is_active,
        image_urls,
        created_by: user.id,
        store_id: storeId
      })
      .select()
      .single()

    if(insertError){
      console.error('Inser error:', insertError)
      return NextResponse.json({ error: insertError.message}, {status: 400})
    }

    return NextResponse.json({success: true, data: product}, {status: 201})
  } catch (error){
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error'}, {status: 500})
  }
}