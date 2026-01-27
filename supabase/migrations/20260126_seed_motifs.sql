-- Seeding Motifs Data for Minangkabau Songket
-- Based on the user's specific dataset images and table structure

INSERT INTO public.motifs (name, slug, philosophy, historical_note, origin_region, image_url, is_active, is_verified)
VALUES 
    (
        'Itiak Pulang Patang', 
        'itiak-pulang-patang', 
        'Melambangkan kesepakatan, keteraturan, seiya sekata, dan kebersamaan. Seperti itik yang selalu berjalan beriringan dan patuh pada pemimpinnya, masyarakat diharapkan hidup rukun dan taat aturan.',
        'Motif ini adalah salah satu motif tertua dan paling sakral di Minangkabau, sering digunakan pada bagian tepi kain songket atau ukiran rumah gadang.',
        'Minangkabau',
        NULL,
        true,
        true
    ),
    (
        'Pucuak Rabung', 
        'pucuak-rabung', 
        'Melambangkan kehidupan yang berguna sepanjang hayat. "Kecil berguna (rebung untuk sayur), tua berguna (bambu untuk lantai/dinding)". Mengajarkan manusia untuk selalu bermanfaat dalam setiap fase kehidupannya.',
        'Bentuknya menyerupai tunas bambu (rebung). Merupakan motif wajib yang hampir selalu ada di "kepala kain" atau tumpal songket.',
        'Minangkabau',
        NULL,
        true,
        true
    ),
    (
        'Saik Galamai', 
        'saik-galamai', 
        'Bermakna kehati-hatian, ketelitian, dan kewaspadaan. "Makan galamai indak bisa sakali makan" (Makan galamai tidak bisa sekali suap), harus hati-hati agar tidak tersedak. Mengajarkan  untuk berpikir matang sebelum bertindak.',
        'Terinspirasi dari penganan khas Minang (Galamai/Dodol) yang dipotong menyerupai jajaran genjang (belah ketupat miring).',
        'Minangkabau',
        NULL,
        true,
        true
    ),
    (
        'Rangkiang', 
        'rangkiang', 
        'Melambangkan kesejahteraan, kemakmuran, dan ketahanan pangan. Rangkiang adalah lumbung padi, simbol tabungan dan persiapan untuk masa depan yang sulit.',
        'Diambil dari bentuk arsitektur lumbung padi tradisional di halaman Rumah Gadang.',
        'Minangkabau',
        NULL,
        true,
        true
    ),
    (
        'Bungo Taratai', 
        'bungo-taratai', 
        'Melambangkan kesucian, keanggunan, dan kemampuan beradaptasi. Teratai tumbuh di air keruh namun bunganya tetap bersih dan indah. Mengajarkan manusia untuk tetap baik meski berada di lingkungan yang kurang baik.',
        'Bunga teratai (lotus) sering diasosiasikan dengan ketenangan jiwa dan spiritualitas dalam budaya timur, diadopsi ke dalam tenunan Minang sebagai simbol keindahan.',
        'Minangkabau',
        NULL,
        true,
        true
    ),
    (
        'Bungo Satangkai', 
        'bungo-satangkai', 
        'Melambangkan keteguhan hati dan fokus. Setangkai bunga yang berdiri tegak merepresentasikan kemandirian dan keindahan yang tidak perlu berlebih-lebihan.',
        'Motif ini biasanya berupa bunga tunggal yang ditebar berulang pada badan kain, memberikan kesan elegan dan minimalis.',
        'Minangkabau',
        NULL,
        true,
        true
    ),
    (
        'Baragi', 
        'baragi', 
        'Melambangkan keseimbangan antara struktur dan keindahan. "Baragi" bisa diartikan berbumbu atau berpola dasar kotak-kotak. Mengingatkan bahwa hidup harus memiliki dasar/prinsip yang kuat (struktur kotak) namun tetap luwes (hiasan motif).',
        'Sering ditemukan pada "Songket Baragi", jenis songket yang digunakan untuk kegiatan adat yang lebih ringan atau sehari-hari dibanding Songket Balapak yang berat.',
        'Minangkabau',
        NULL,
        true,
        true
    ),
    (
        'Bungo Apel', 
        'bungo-apel', 
        'Simbol hasil yang manis dan kelimpahan. Sebuah variasi motif modern atau naturalis yang menggambarkan buah dan bunga, mewakili harapan akan hasil kerja keras yang memuaskan.',
        'Merupakan pengembangan motif yang lebih modern atau variasi lokal dari motif flora, menunjukkan dinamisnya perkembangan seni tenun songket.',
        'Modern Minangkabau',
        NULL,
        true,
        true
    ),
    (
        'Bungo Tulip', 
        'bungo-tulip', 
        'Melambangkan kasih sayang, keindahan baru, dan modernitas. Tulip bukan bunga asli tropis, kehadirannya di songket menandakan keterbukaan pengrajin Minangkabau terhadap pengaruh keindahan dari luar yang diolah menjadi karya lokal.',
        'Motif kontemporer yang mulai muncul seiring pertukaran budaya dan inovasi para penenun muda, sering dipakai pada songket untuk acara pernikahan modern.',
        'Modern Minangkabau',
        NULL,
        true,
        true
    )
ON CONFLICT (slug) DO UPDATE 
SET 
    philosophy = EXCLUDED.philosophy,
    historical_note = EXCLUDED.historical_note,
    origin_region = EXCLUDED.origin_region,
    image_url = COALESCE(motifs.image_url, EXCLUDED.image_url);