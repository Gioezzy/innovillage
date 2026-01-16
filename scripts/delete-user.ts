import dotenv from 'dotenv'
dotenv.config({path: '.env.local'})
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function deleteUser(userId: string){
  try{
    const {error} = await supabase.auth.admin.deleteUser(userId)

    if(error){
      console.error('Gagal menghapus user:', error.message)
      return
    }

    console.log(`User dengan id ${userId} berhasil dihapus`)
  } catch (err){
    console.error('Terjadi kesalahan', err)
  }
}

deleteUser('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')
