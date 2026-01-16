
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const users = [
  {
    email: 'admin@songket.id',
    password: 'password123',
    role: 'admin',
    full_name: 'Admin Songket',
    phone: '081234567890',
  },
  {
    email: 'superadmin@songket.id',
    password: 'password123',
    role: 'super_admin',
    full_name: 'Super Admin Songket',
    phone: '081234567890',
  },
  {
    email: 'artisan@songket.id',
    password: 'password123',
    role: 'artisan',
    full_name: 'Ibu Penenun',
    phone: '081234567891',
  },
  {
    email: 'customer@songket.id',
    password: 'password123',
    role: 'customer',
    full_name: 'Budi Pembeli',
    phone: '081234567892',
  },
];

async function seedUsers() {
  console.log('Starting user seeding...');

  for (const user of users) {
    console.log(`\nProcessing ${user.role}: ${user.email}`);

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        full_name: user.full_name,
      },
    });

    let userId = authData.user?.id;

    if (authError) {
      if (authError.message.includes('already been registered')) {
        console.log(`   User already exists. Fetching ID...`);
        const { data: listUsers } = await supabase.auth.admin.listUsers();
        const existing = listUsers.users.find(u => u.email === user.email);
        if (existing) userId = existing.id;
      } else {
        console.error(`Error creating auth user: ${authError.message}`);
        continue;
      }
    } else {
      console.log(`Auth user created (ID: ${userId})`);
    }

    if (!userId) {
      console.error('Could not obtain User ID.');
      continue;
    }

    if (!authError) await new Promise(r => setTimeout(r, 1000));

    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        role: user.role,
        full_name: user.full_name,
        phone: user.phone,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (upsertError) {
      console.error(`Error upserting profile for ${user.email}: ${upsertError.message}`);
    } else {
      console.log(`Profile ensured for ${user.email} with role '${user.role}'`);
    }
  }

  console.log('\n Seeding completed!');
}

seedUsers();
