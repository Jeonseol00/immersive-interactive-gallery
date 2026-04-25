-- ═══════════════════════════════════════════════════════════════
-- IMGAL Security Patch — Supabase Storage & RLS Hardening
-- ═══════════════════════════════════════════════════════════════
-- 
-- ⚠️  RUN THIS IN SUPABASE SQL EDITOR (Dashboard > SQL Editor)
-- ⚠️  This MUST be run AFTER the existing migrations (V1 & V2)
-- ⚠️  Test in staging/development first before production
--
-- This patch fixes:
--   1. Anonymous storage upload/update/delete (CRITICAL)
--   2. Missing admin-only restriction on site_settings writes
--   3. Missing audit trail for admin operations
-- ═══════════════════════════════════════════════════════════════

-- ─── 1. FIX: Storage Policies — Remove anonymous access ─────
-- Drop the dangerous policies that allow anyone to upload/modify/delete

DROP POLICY IF EXISTS "Service upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Service update gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Service delete gallery images" ON storage.objects;

-- Replace with authenticated-only policies
-- Only authenticated users (admins logged via Supabase Auth) can upload

CREATE POLICY "Authenticated upload gallery images" ON storage.objects
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'gallery' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated update gallery images" ON storage.objects
  FOR UPDATE 
  USING (
    bucket_id = 'gallery' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated delete gallery images" ON storage.objects
  FOR DELETE 
  USING (
    bucket_id = 'gallery' 
    AND auth.role() = 'authenticated'
  );

-- Public read access remains (images need to be publicly viewable)
-- The existing "Public read gallery images" policy is fine.


-- ─── 2. FIX: site_settings — Restrict write access ──────────
-- The current policy allows service_role full access, which is correct
-- for API routes using the service key. But let's also add an
-- authenticated user policy for direct Supabase client access.

-- Drop existing overly-permissive policy if it exists
DROP POLICY IF EXISTS "Service role full access site_settings" ON site_settings;

-- Recreate with explicit operations instead of FOR ALL
CREATE POLICY "Service role can read site_settings" ON site_settings
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Service role can modify site_settings" ON site_settings
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "Service role can insert site_settings" ON site_settings
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Authenticated admin can also read settings directly
CREATE POLICY "Authenticated can read site_settings" ON site_settings
  FOR SELECT USING (auth.role() = 'authenticated');


-- ─── 3. HARDEN: gallery_items — Explicit operation policies ──
-- Replace the broad "FOR ALL" service policy with explicit per-operation policies

DROP POLICY IF EXISTS "Service role full access gallery" ON gallery_items;

CREATE POLICY "Service role select gallery" ON gallery_items
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Service role insert gallery" ON gallery_items
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role update gallery" ON gallery_items
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "Service role delete gallery" ON gallery_items
  FOR DELETE USING (auth.role() = 'service_role');


-- ─── 4. HARDEN: theme_presets — Explicit operation policies ──

DROP POLICY IF EXISTS "Service role full access themes" ON theme_presets;

CREATE POLICY "Service role select themes" ON theme_presets
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Service role update themes" ON theme_presets
  FOR UPDATE USING (auth.role() = 'service_role');


-- ─── 5. ADD: Audit trail table for admin actions ─────────────
-- Records who did what and when in the admin panel

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  action TEXT NOT NULL,           -- 'create', 'update', 'delete'
  target_table TEXT NOT NULL,     -- 'gallery_items', 'theme_presets', etc.
  target_id TEXT,                 -- ID of the affected row
  details JSONB DEFAULT '{}',    -- Additional context
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Only service_role can write audit logs (from API routes)
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role write audit" ON admin_audit_log
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role read audit" ON admin_audit_log
  FOR SELECT USING (auth.role() = 'service_role');

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS idx_audit_created ON admin_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_user ON admin_audit_log(user_email);


-- ═══════════════════════════════════════════════════════════════
-- VERIFICATION QUERIES — Run these after applying the patch
-- ═══════════════════════════════════════════════════════════════

-- Check storage policies (should show authenticated-only for INSERT/UPDATE/DELETE)
-- SELECT policyname, cmd, qual, with_check FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- Check gallery_items policies (should show per-operation service_role + public read)
-- SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'gallery_items';

-- Check site_settings policies
-- SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'site_settings';

-- Verify audit table exists
-- SELECT * FROM admin_audit_log LIMIT 1;
