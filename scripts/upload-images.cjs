const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Directory to look for images (relative to project root)
const IMAGES_DIR = path.join(process.cwd(), 'dtsetsample');
const BUCKET_NAME = 'uploads';

async function uploadImages() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`❌ Directory not found: ${IMAGES_DIR}`);
    console.log("Please copy the 'dtsetsample' folder to the project root first.");
    return;
  }

  console.log(`Reading images from: ${IMAGES_DIR}`);
  const files = fs.readdirSync(IMAGES_DIR);

  for (const file of files) {
    if (!file.match(/\.(jpg|jpeg|png|JPG|PNG)$/)) continue;

    const filePath = path.join(IMAGES_DIR, file);
    const fileBuffer = fs.readFileSync(filePath);
    const contentType = file.endsWith('.png') ? 'image/png' : 'image/jpeg';

    console.log(`Uploading ${file}...`);

    const { data, error } = await supabase
      .storage
      .from(BUCKET_NAME)
      .upload(file, fileBuffer, {
        contentType: contentType,
        upsert: true
      });

    if (error) {
      console.error(`❌ Failed to upload ${file}:`, error.message);
    } else {
      console.log(`✅ Uploaded: ${file}`);
    }
  }
  console.log('Done!');
}

uploadImages();
