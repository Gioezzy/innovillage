import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUser() {
  const email = 'superadmin@songket.id';
  const { data: users, error: userError } = await supabase.auth.admin.listUsers();
  
  if (userError) {
    console.error("User list error:", userError.message);
    return;
  }

  const user = users.users.find(u => u.email === email);
  if (!user) {
    console.error(`User ${email} not found in Auth`);
    return;
  }

  console.log(`Auth User Found: ${user.id}`);

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error("Profile error:", profileError.message);
  } else {
    console.log("Profile Found:", profile);
  }
}

checkUser();
