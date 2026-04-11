-- ═══════════════════════════════════════════
-- IMGAL Database Schema Migration
-- Jalankan SQL ini di Supabase SQL Editor
-- ═══════════════════════════════════════════

-- 1. Tabel utama karya seni
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  author TEXT DEFAULT 'Artelab',
  parallax_speed FLOAT DEFAULT 0.2,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text TEXT DEFAULT '',
  width INT NOT NULL DEFAULT 800,
  height INT NOT NULL DEFAULT 1200,
  aspect_ratio TEXT NOT NULL DEFAULT '2/3',
  is_published BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabel theme presets
CREATE TABLE IF NOT EXISTS theme_presets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  orb1_color TEXT DEFAULT 'rgba(245,158,11,0.4)',
  orb2_color TEXT DEFAULT 'rgba(6,182,212,0.25)',
  orb3_color TEXT DEFAULT 'rgba(159,18,57,0.15)',
  grain_opacity FLOAT DEFAULT 0.03,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_gallery_published ON gallery_items(is_published);
CREATE INDEX IF NOT EXISTS idx_gallery_featured ON gallery_items(is_featured);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery_items(category);
CREATE INDEX IF NOT EXISTS idx_gallery_slug ON gallery_items(slug);

-- 4. Seed default theme presets
INSERT INTO theme_presets (name, slug, orb1_color, orb2_color, orb3_color, grain_opacity, is_active) VALUES
  ('Amber Classic', 'amber-classic', 'rgba(245,158,11,0.4)', 'rgba(6,182,212,0.25)', 'rgba(159,18,57,0.15)', 0.03, true),
  ('Midnight Azure', 'midnight-azure', 'rgba(30,58,138,0.5)', 'rgba(20,184,166,0.3)', 'rgba(49,46,129,0.25)', 0.04, false),
  ('Velvet Noir', 'velvet-noir', 'rgba(88,28,135,0.45)', 'rgba(185,28,28,0.3)', 'rgba(234,179,8,0.2)', 0.05, false),
  ('Arctic Frost', 'arctic-frost', 'rgba(56,189,248,0.35)', 'rgba(148,163,184,0.25)', 'rgba(255,255,255,0.15)', 0.02, false)
ON CONFLICT (slug) DO NOTHING;

-- 5. Enable RLS (Row Level Security)
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_presets ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies - Public read
CREATE POLICY "Public can read published gallery items" ON gallery_items
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can read theme presets" ON theme_presets
  FOR SELECT USING (true);

-- 7. RLS Policies - Service role full access (for admin API routes)
CREATE POLICY "Service role full access gallery" ON gallery_items
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access themes" ON theme_presets
  FOR ALL USING (auth.role() = 'service_role');

-- 8. Storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- 9. Storage policy - public read
CREATE POLICY "Public read gallery images" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery');

-- 10. Storage policy - authenticated upload  
CREATE POLICY "Service upload gallery images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Service update gallery images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'gallery');

CREATE POLICY "Service delete gallery images" ON storage.objects
  FOR DELETE USING (bucket_id = 'gallery');
