'use server'

import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'

export const getCategories = cache(async () => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', {ascending: true})

    if (error) {
      console.error('Error fetching categories:', error)
      return[]
    }

    return data
})

export const getCategoryBySlug = cache(async (slug: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

    if(error) {
      console.error('Error fetching category:', error)
      return null
    }

    return data
})