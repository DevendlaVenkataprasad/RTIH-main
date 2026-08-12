-- =============================================================================
-- incubation-admin-backend/schema.sql
--
-- Run this once against the RTIH admin portal's MySQL database before
-- dropping the PHP files into rtih_admin/incubation/.
--
-- This script is SAFE / ADDITIVE ONLY:
--   - Uses CREATE TABLE IF NOT EXISTS (never drops anything)
--   - The applications ALTER TABLE block at the bottom is commented out by
--     default and must be reviewed/uncommented manually (see instructions)
-- =============================================================================

-- -----------------------------------------------------------------------
-- 1. incubation_programs
--    Stores the incubation program tracks (SPARK, Future Founders, ...,
--    plus any new tracks created via incubation-programs.php).
--    This table is created automatically the first time
--    incubation-programs-store.php runs (incubationEnsureProgramsTable()),
--    but you can run it here up-front too — it's idempotent.
-- -----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS incubation_programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    program_key VARCHAR(60) NOT NULL,
    track_group VARCHAR(40) NOT NULL DEFAULT 'core',
    title VARCHAR(180) NOT NULL,
    tagline VARCHAR(300) NULL,
    route_path VARCHAR(160) NULL,
    content_json LONGTEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_program_key (program_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------
-- 2. incubation_landing_content
--    Already created by the EXISTING incubation/landing-content-store.php
--    (incubationEnsureLandingTable()) for the 'events'/'testimonials'
--    sections. incubation-sections-store.php (new, in this folder) reuses
--    the SAME table for the new 'hero' / 'benefits' / 'main_faq' /
--    'toolkit' section keys. Included here again only so this script is
--    self-sufficient if run against a brand-new database — it is a no-op
--    if the table already exists.
-- -----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS incubation_landing_content (
    section_key VARCHAR(40) NOT NULL PRIMARY KEY,
    content_json LONGTEXT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 3. Applications table status/notes columns (DEFENSIVE — commented out by default)
--
-- The real incubation applications table schema and name are NOT known to
-- us (the shared department-applications-template.php was not available).
-- incubation-applications-status.php already adds these columns
-- automatically and safely at runtime (checking INFORMATION_SCHEMA.COLUMNS
-- first), so you do NOT need to run anything below by hand.
--
-- This block exists only if you prefer to run the ALTER manually instead of
-- letting the PHP page do it on first load. If so:
--   1. Run: SHOW TABLES LIKE '%application%';
--   2. Run: DESCRIBE <table_name>;  -- confirm it doesn't already have
--      `status` / `reviewer_notes` columns.
--   3. Uncomment ONLY the block(s) below matching the table name(s) that
--      actually exist in your database, then run them.
-- =============================================================================

-- -- If `incubation_applications` exists:
-- ALTER TABLE incubation_applications
--   ADD COLUMN status ENUM('new','under_review','shortlisted','rejected','accepted') NULL DEFAULT 'new',
--   ADD COLUMN reviewer_notes TEXT NULL;

-- -- If `startup_applications` exists:
-- ALTER TABLE startup_applications
--   ADD COLUMN status ENUM('new','under_review','shortlisted','rejected','accepted') NULL DEFAULT 'new',
--   ADD COLUMN reviewer_notes TEXT NULL;

-- -- If `incubator_applications` exists:
-- ALTER TABLE incubator_applications
--   ADD COLUMN status ENUM('new','under_review','shortlisted','rejected','accepted') NULL DEFAULT 'new',
--   ADD COLUMN reviewer_notes TEXT NULL;
