
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try{
    const supabase = await createClient()
    const { id } = await context.params;

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if(authError || !user){
      return NextResponse.json( { error: 'Unauthorized'}, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if(!profile || profile.role !== 'admin'){
      return NextResponse.json({error: 'Forbidden'}, {status: 403})
    }

    const body = await request.json()
    const { ...updateData} = body

    const { data: product, error: updateError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if(updateError){
      return NextResponse.json({ error: updateError.message}, { status: 400})
    }

    return NextResponse.json({ success: true, data: product})
  } catch ( error) {
    console.error('API error: ', error)
    return NextResponse.json({ error: 'Internal server error'}, { status: 500})
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await context.params;
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { count } = await supabase
      .from('order_items')
      .select('*', { count: 'exact', head: true})
      .eq('product_id', id)

    if (count && count > 0){
      return NextResponse.json(
        { error: 'Tidak dapat menghapus produk yang sudah dipesan'},
        { status: 400 }
      );
    }

    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
