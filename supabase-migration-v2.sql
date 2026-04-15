-- ═══════════════════════════════════════════════════════════════
-- IMGAL Database Migration V2
-- Migrasi Source of Truth & Waterfall Control System
-- Jalankan SQL ini di Supabase SQL Editor SETELAH migration V1
-- ═══════════════════════════════════════════════════════════════

-- ─── 1. Tambah kolom waterfall pada gallery_items ────────────
ALTER TABLE gallery_items
  ADD COLUMN IF NOT EXISTS is_featured_waterfall BOOLEAN DEFAULT false;

-- ─── 2. Index untuk query waterfall yang performa tinggi ─────
CREATE INDEX IF NOT EXISTS idx_gallery_waterfall
  ON gallery_items(is_featured_waterfall)
  WHERE is_featured_waterfall = true AND is_published = true;

-- ─── 3. Tabel site_settings untuk konfigurasi global ─────────
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read site_settings" ON site_settings
  FOR SELECT USING (true);

-- Service role full access
CREATE POLICY "Service role full access site_settings" ON site_settings
  FOR ALL USING (auth.role() = 'service_role');

-- ─── 4. Seed default site settings ──────────────────────────
INSERT INTO site_settings (key, value, description) VALUES
  ('waterfall_limit', '8', 'Jumlah maksimum foto yang tampil di animasi waterfall homepage')
ON CONFLICT (key) DO NOTHING;

-- ─── 5. Seed 15 galeri foto awal (dari hardcode data.ts) ────
-- Menggunakan path lokal /images/ yang sudah ada di public/
INSERT INTO gallery_items (
  title, slug, category, description, author,
  parallax_speed, image_url, thumbnail_url, alt_text,
  width, height, aspect_ratio,
  is_published, is_featured, is_featured_waterfall, sort_order
) VALUES
  (
    'Vivid Dimensions', 'vivid-dimensions', 'Architecture',
    'Eksplorasi ruang geometris yang melengkung dan garis simetris yang membias pada sudut penglihatan ganda.',
    'Artelab', 0.2,
    '/images/adrianna-geo-1rBg5YSi00c-unsplash.jpg',
    '/images/adrianna-geo-1rBg5YSi00c-unsplash.jpg',
    'Architectural structure with dynamic lighting',
    800, 1200, '2/3',
    true, false, true, 1
  ),
  (
    'Classical Aura', 'classical-aura', 'Fine Art',
    'Sisa-sisa kemegahan era klasik dalam satu sapuan lukisan yang sarat akan guratan sejarah tak lekang oleh waktu.',
    'Artelab', 0.15,
    '/images/birmingham-museums-trust-e0wBK0xJXYQ-unsplash.jpg',
    '/images/birmingham-museums-trust-e0wBK0xJXYQ-unsplash.jpg',
    'Classical museum artifact painting',
    1200, 800, '3/2',
    true, false, true, 2
  ),
  (
    'Eternal Gaze', 'eternal-gaze', 'Portrait',
    'Sebuah tatapan masa lalu yang menembus lapisan kanvas dan kanon waktu menuju abad digital kita.',
    'Artelab', 0.25,
    '/images/birmingham-museums-trust-sJr8LDyEf7k-unsplash.jpg',
    '/images/birmingham-museums-trust-sJr8LDyEf7k-unsplash.jpg',
    'Historical expressive portrait',
    900, 1200, '3/4',
    true, false, true, 3
  ),
  (
    'Mythic Lore', 'mythic-lore', 'Fine Art',
    'Kisah mitologi dan fragmen legenda tertuang padat dalam spektrum sinambung yang dramatis.',
    'Artelab', 0.12,
    '/images/birmingham-museums-trust-zWE5pOLWkio-unsplash.jpg',
    '/images/birmingham-museums-trust-zWE5pOLWkio-unsplash.jpg',
    'Large canvas depicting a mythological event',
    1400, 900, '14/9',
    true, false, true, 4
  ),
  (
    'Knowledge Vault', 'knowledge-vault', 'Heritage',
    'Rak-rak ingatan literatur dunia berpadu dengan jejak manuskrip antik; sebuah arsip kebijaksanaan universal.',
    'Artelab', 0.22,
    '/images/boston-public-library-YoK5pBcSY8s-unsplash.jpg',
    '/images/boston-public-library-YoK5pBcSY8s-unsplash.jpg',
    'Vintage historical archive from the library',
    1000, 1400, '5/7',
    true, false, true, 5
  ),
  (
    'European Charm', 'european-charm', 'Heritage',
    'Nostalgia peradaban terekam dalam bayangan monokromatis dan distorsi fotografi dari benua biru.',
    'Artelab', 0.1,
    '/images/europeana-5TK1F5VfdIk-unsplash.jpg',
    '/images/europeana-5TK1F5VfdIk-unsplash.jpg',
    'An old European photograph or artifact',
    1200, 1200, '1/1',
    true, false, true, 6
  ),
  (
    'Serene Passage', 'serene-passage', 'Landscape',
    'Kedalaman panorama alam, menangkap interaksi bisu antara cahaya melankolis dan keheningan bumi.',
    'Artelab', 0.3,
    '/images/francesco-bianco-TVsgRyKJDc0-unsplash.jpg',
    '/images/francesco-bianco-TVsgRyKJDc0-unsplash.jpg',
    'A breathtaking landscape view',
    1600, 1000, '16/10',
    true, false, true, 7
  ),
  (
    'Winter Mirage', 'winter-mirage', 'Nature',
    'Angin dingin menyapu lapisan es, menceritakan rahasia alam di bawah langit perak.',
    'Artelab', 0.18,
    '/images/henrik-donnestad-t2Sai-AqIpI-unsplash.jpg',
    '/images/henrik-donnestad-t2Sai-AqIpI-unsplash.jpg',
    'Cold winter wilderness atmosphere',
    800, 1000, '4/5',
    true, false, true, 8
  ),
  (
    'City Echoes', 'city-echoes', 'Urban',
    'Gema dari kehidupan kota yang terekam dalam ritme cahaya senja, merefleksikan isolasi di antara keramaian.',
    'Artelab', 0.28,
    '/images/zeynep-sumer-lk3F07BN8T8-unsplash.jpg',
    '/images/zeynep-sumer-lk3F07BN8T8-unsplash.jpg',
    'Minimalist urban setting or detail',
    1200, 1600, '3/4',
    true, false, false, 9
  ),
  (
    'Urban Silhouette', 'urban-silhouette', 'Portrait',
    'Menangkap esensi manusia di tengah kerasnya struktur metropolitan. Bayangan yang bercerita lebih dari sekadar rupa.',
    'Artelab', 0.22,
    '/images/Potrait/clay-banks-mgLX9vQhxc8-unsplash.jpg',
    '/images/Potrait/clay-banks-mgLX9vQhxc8-unsplash.jpg',
    'A striking portrait against an urban backdrop',
    800, 1200, '2/3',
    true, false, false, 10
  ),
  (
    'Ethereal Gaze', 'ethereal-gaze', 'Portrait',
    'Tatapan yang menembus dimensi, membawa ketenangan melankolis yang tertuang dalam palet warna kontras.',
    'Artelab', 0.18,
    '/images/Potrait/download-1.jpg',
    '/images/Potrait/download-1.jpg',
    'A classical or artistic portrait',
    1000, 1333, '3/4',
    true, false, false, 11
  ),
  (
    'Vintage Aristocrat', 'vintage-aristocrat', 'Heritage',
    'Arsip visual kaum bangsawan masa lampau, membangkitkan pesona nostalgia zaman keemasan Eropa.',
    'Artelab', 0.15,
    '/images/Potrait/europeana-VsnDYMWollM-unsplash.jpg',
    '/images/Potrait/europeana-VsnDYMWollM-unsplash.jpg',
    'A historical vintage portrait of an aristocrat',
    900, 1200, '3/4',
    true, false, false, 12
  ),
  (
    'Neon Pulse', 'neon-pulse', 'Portrait',
    'Ketegangan cyberpunk terefleksi dalam pendaran cahaya buatan, merepresentasikan jiwa yang tersesat dalam lautan sirkuit.',
    'Artelab', 0.28,
    '/images/Potrait/simon-lee-MnnDZX4gAw4-unsplash.jpg',
    '/images/Potrait/simon-lee-MnnDZX4gAw4-unsplash.jpg',
    'A portrait illuminated by neon lights',
    853, 1280, '2/3',
    true, false, false, 13
  ),
  (
    'Silent Melody', 'silent-melody', 'Portrait',
    'Bentuk keanggunan yang tidak bersuara, setiap hembusan nafas dan ekspresi tergambar bagai alunan simfoni klasik.',
    'Artelab', 0.2,
    '/images/Potrait/tamara-menzi-n-vnWQmmVoY-unsplash.jpg',
    '/images/Potrait/tamara-menzi-n-vnWQmmVoY-unsplash.jpg',
    'A serene and musical portrait',
    1000, 1400, '5/7',
    true, false, false, 14
  ),
  (
    'Raw Monochrome', 'raw-monochrome', 'Fine Art',
    'Eksplorasi emosi ekstrem dalam absennya warna, menyorot kekosongan dan sekaligus kepadatan jiwa subjek.',
    'Artelab', 0.25,
    '/images/Potrait/vojtech-bruzek-mCjA1I8SlS8-unsplash.jpg',
    '/images/Potrait/vojtech-bruzek-mCjA1I8SlS8-unsplash.jpg',
    'A raw monochrome emotional portrait',
    1200, 1600, '3/4',
    true, false, false, 15
  )
ON CONFLICT (slug) DO NOTHING;
