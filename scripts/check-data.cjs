const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  console.log('--- Existing Products ---');
  const { data: products, error: pError } = await supabase.from('products').select('id, name');
  if (pError) console.error(pError);
  else console.table(products);

  console.log('\n--- Existing Motifs ---');
  const { data: motifs, error: mError } = await supabase.from('motifs').select('id, name');
  if (mError) console.error(mError);
  else console.table(motifs);
}

checkData();
