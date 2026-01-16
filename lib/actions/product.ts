'use server'

import { createClient } from "@/lib/supabase/server"
import { cache } from "react"

export interface ProductFilters {
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  sortBy?: 'name' | 'price_asc' | 'price_desc' | 'newest'
  limit?: number
  offset?: number
  storeId?: string
}

export const getProducts = cache(async (filters: ProductFilters = {}) => {
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select('*, category:categories(*), motif:motifs(*), profile:profiles(*), store:stores(id, name, slug)', {count: 'exact'})
    .eq('is_active', true)

  if (filters.categoryId){
    query = query.eq('category_id', filters.categoryId)
  }

  if(filters.minPrice){
    query = query.gte('price', filters.minPrice)
  }
  if(filters.maxPrice){
    query = query.lte('price', filters.maxPrice)
  }
  if(filters.search){
    query = query.ilike('name', `%${filters.search}`)
  }

  if(filters.storeId){
    query = query.eq('store_id', filters.storeId)
  }

  switch(filters.sortBy){
    case 'price_asc':
      query = query.order('price', {ascending:true})
      break
    case 'price_desc':
      query = query.order('price', {ascending: false})
      break
    case 'newest':
      query = query.order('created_at', {ascending: false})
      break
    default:
      query = query.order('name', {ascending: true})
  }

  if(filters.limit){
    query = query.limit(filters.limit)
  }
  if(filters.offset){
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) -1)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return { products: [], total: 0}
  }

  return { products: data, total: count || 0}
})

export const getProductBySlug = cache(async (slug: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), motif:motifs(*), profile:profiles(*), store:stores(id, name, slug)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if(error){
    console.error('Error fetching product:', error)
    return null
  }

  return data
})

export const getRelatedProducts = cache(async (productId: string, categoryId: string, limit = 4) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .neq('id', productId)
    .limit(limit)

  if(error){
    console.error('Error fetching related products:', error)
    return []
  }

  return data
})

export const getFeaturedProducts = cache(async (limit = 8) => {
  const supabase = await createClient()

  const { data, error} = await supabase
    .from('products')
    .select('*, category:categories(*), motif:motifs(*), profile:profiles(*), store:stores(id, name, slug)')
    .eq('is_active', true)
    .order('created_at', {ascending: false})
    .limit(limit)

  if(error) {
    console.error('Error fetching featured products:', error)
    return []
  }

  return data
})