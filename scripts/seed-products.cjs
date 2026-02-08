const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const STORE_ID = 'bdcb5c9f-fd5a-4d72-818a-09069ee608fa';
const CATEGORY_ID = '9a370710-a4b0-4806-9b55-2ddceeb7c142'; // Assuming general category 'Songket'
const CREATED_BY = 'dca13414-f841-4f8c-9e01-01366329998c'; // Using ID from user sample

// Motif Mapping based on DB check
const MOTIFS = {
    'Rangkiang': '61205bed-d479-4100-a917-438827a2e5df',
    'Baragi': '58d9bbb3-4c8e-4237-8c17-643dc8ce0bc8',
    'Bungo Satangkai': '07b44b78-0be2-4f01-aa84-35020a63af8b',
    'Itiak Pulang Patang': '8d5578a6-a087-41bf-8395-c49ebeae01b9',
    'Bungo Taratai': '8f4e6908-6e6a-4fa8-938e-e8fc7ec6fdd6',
    'Bungo Tulip': '29e50747-a907-4173-949c-a74525bcc697'
};

const PRODUCTS_TO_SEED = [
    {
        name: "Songket Baragi",
        slug: "songket-baragi",
        motif_id: MOTIFS['Baragi'],
        image_name: "baragi.jpg",
        price: 450000,
        description: "Songket dengan motif Baragi yang elegan dan tradisional.",
        color: "Merah Bata",
        material: "Benang Katun & Emas"
    },
    {
        name: "Songket Bungo Satangkai",
        slug: "songket-bungo-satangkai",
        motif_id: MOTIFS['Bungo Satangkai'],
        image_name: "bungoStangkai.jpg",
        price: 475000,
        description: "Motif Bungo Satangkai melambangkan keindahan yang berdiri tegak.",
        color: "Hitam Silver",
        material: "Benang Sutra & Perak"
    },
    {
        name: "Songket Itiak Pulang Patang",
        slug: "songket-itiak-pulang-patang",
        motif_id: MOTIFS['Itiak Pulang Patang'],
        image_name: "itiakPulangPatang.jpg",
        price: 550000,
        description: "Filosofi keselarasan dan ketertiban dalam bermasyarakat.",
        color: "Biru Dongker",
        material: "Benang Katun Premium"
    },
    {
        name: "Songket Rangkiang",
        slug: "songket-rangkiang",
        motif_id: MOTIFS['Rangkiang'],
        image_name: "rangkiang.jpg",
        price: 600000,
        description: "Lambang kesejahteraan dan lumbung padi masyarakat Minang.",
        color: "Merah Marun",
        material: "Benang Emas Padat"
    },
    {
        name: "Songket Taratai",
        slug: "songket-taratai",
        motif_id: MOTIFS['Bungo Taratai'],
        image_name: "taratai.jpg",
        price: 425000,
        description: "Keindahan bunga Teratai yang mekar di atas air.",
        color: "Coklat Emas",
        material: "Katun Halus"
    },
    {
        name: "Songket Tulip",
        slug: "songket-tulip",
        motif_id: MOTIFS['Bungo Tulip'],
        image_name: "tulip.JPG",
        price: 400000,
        description: "Motif modern inspirasi bunga Tulip dengan sentuhan tradisional.",
        color: "Hitam Merah",
        material: "Rayon"
    }
];

async function seed() {
    console.log("Starting seed...");
    
    // Base URL for manually uploaded images in 'uploads' bucket
    // Modify this if your bucket structure is different
    const BASE_IMAGE_URL = `${supabaseUrl}/storage/v1/object/public/uploads/`;

    for (const p of PRODUCTS_TO_SEED) {
        // Check if exists
        const { data: existing } = await supabase
            .from('products')
            .select('id')
            .eq('slug', p.slug)
            .single();

        if (existing) {
            console.log(`Skipping existing: ${p.name}`);
            continue;
        }

        const { error } = await supabase.from('products').insert({
            name: p.name,
            slug: p.slug,
            description: p.description,
            price: p.price,
            stock_quantity: 10,
            category_id: CATEGORY_ID,
            motif_id: p.motif_id,
            store_id: STORE_ID,
            created_by: CREATED_BY,
            is_active: true,
            is_limited: false,
            material: p.material,
            color: p.color,
            weaving_time_days: 7,
            image_urls: [`${BASE_IMAGE_URL}${p.image_name}`]
        });

        if (error) {
            console.error(`Failed to insert ${p.name}:`, error.message);
        } else {
            console.log(`Created: ${p.name}`);
        }
    }
    console.log("Done!");
}

seed();
