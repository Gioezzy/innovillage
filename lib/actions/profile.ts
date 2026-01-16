'use server'

import { createClient } from "../supabase/server"
import { revalidatePath } from "next/cache"

export interface UpdateProfileInput {
  fullName: string
  phone: string
  address: string
}

export async function UpdateProfileInput(input: UpdateProfileInput){
  const supabase = await createClient()

  const { data: {user}} = await supabase.auth.getUser()

  if(!user){
    return { error: 'Unauthorized'}
  }

  const phoneRegex = /^\+?[0-9]{10,15}/
  if(!phoneRegex.test(input.phone)){
    return { error: 'Format nomot telepon tidak valid'}
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: input.fullName,
      phone: input.phone,
      address: input.address
    })
    .eq('id', user.id)

  if (error) {
    console.error('Update profile error:', error)
    return { error: 'Gagal mengupdate profil'}
  }

  revalidatePath('/profile')
  revalidatePath('/dashboard')

  return { success: true, message: 'Profil berhasil diupdate'}
}

export async function updatePasswordAction(formData: FormData){
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if(!user){
    return { error: 'Unauthorized'}
  }

  const currentPassword = formData.get('currentPassword') as string
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if(newPassword.length < 6){
    return { error: 'Password baru minimal 6 karakter'}
  }

  if(newPassword !== confirmPassword){
    return { error: 'Password konfirmasi tidak cocok'}
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword
  })

  if(signInError){
    return { error: 'Password lama tidak benar'}
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if(error){
    console.error('Update password error:', error)
    return { error: 'Gagal mengupdate password'}
  }

  return { success: true, message: 'Password berhasil diupdate'}
}

export async function getUserProfile(){
  const supabase = await createClient()

  const { data: {user}} = await supabase.auth.getUser()

  if(!user){
    return null
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if(error){
    console.error('Get profile error:', error)
    return null
  }

  return data
}