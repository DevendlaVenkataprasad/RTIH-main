# Incubation admin backend — install steps

This folder is a deliverable to drop into the existing multi-department PHP
admin portal, inside its `incubation/` department folder. It was built
without direct access to that portal's repo, so a few things below need to
be double-checked once you compare against the real files — those are
flagged explicitly.

## 1. Run the SQL

Run `schema.sql` once against the portal's MySQL database (the same
database `db.php` connects to). It only creates tables `IF NOT EXISTS` — it
never drops or alters anything destructively. The commented-out `ALTER
TABLE` block at the bottom is optional; `incubation-applications-status.php`
already adds those columns itself the first time it runs, safely (it checks
`INFORMATION_SCHEMA.COLUMNS` before altering anything).

## 2. Copy files into `rtih_admin/incubation/`

Copy every `.php` file from this folder into your portal's
`rtih_admin/incubation/` directory (the same folder that already has
`portal-config.php`, `landing-content.php`, `landing-content-store.php`,
`landing-content-feed.php`, `applications.php`, `dashboard.php`):

| File | What it is |
|---|---|
| `incubation-programs-store.php` | Data layer for program tracks (SPARK, Future Founders, ... + admin-created ones). New file, safe to drop in as-is. |
| `incubation-programs.php` | Admin page to list/create/edit/delete program tracks. New file, safe to drop in as-is. |
| `incubation-programs-feed.php` | Public JSON feed of active programs, for the Angular site. New file, safe to drop in as-is. |
| `incubation-sections-store.php` | Generic data layer for the hero/benefits/main_faq/toolkit/gallery sections. **Does not modify** `landing-content-store.php` — it only `require_once`s it for `incubationEnsureLandingTable()`. Safe to drop in as-is. |
| `incubation-sections.php` | Admin page (tabbed) for hero/benefits/main_faq/toolkit/gallery. New file, safe to drop in as-is. |
| `incubation-sections-feed.php` | Public JSON feed of hero/benefits/main_faq/toolkit/gallery, for the Angular site. New file, safe to drop in as-is. |
| `incubation-applications-status.php` | Best-effort admin page that adds `status`/`reviewer_notes` columns (if missing) to whichever of the 3 candidate applications table names actually exists, and lets you review/update them. New file, safe to drop in as-is. |
| `incubation-programs-seed.php` | One-time, admin-auth-gated seed script that upserts the 12 real program tracks into `incubation_programs`. New file, safe to drop in as-is. See step 5 below — run it once via the browser after deploying. |
| `incubation-image-upload.php` | Admin-auth-gated endpoint used by `incubation-programs.php` / `incubation-sections.php`'s new "Upload" file inputs (additive alongside the existing plain URL text fields). Validates file type/size and saves into `uploads/`. New file, safe to drop in as-is. |
| `uploads/.htaccess` | Locks down the `uploads/` folder (disables PHP execution, denies script extensions, no directory listing). New file/folder — copy the whole `uploads/` folder (including this `.htaccess`) alongside the other files. |
| `schema.sql` | Run once, see step 1. |
| `portal-config.php` | **Replaces** your existing `rtih_admin/incubation/portal-config.php`. Only change: adds `'programs_enabled' => true`, `'sections_enabled' => true`, `'applications_status_enabled' => true` — everything else is identical to what you already have. |
| `department-admin-chrome.php` | **Replaces** your existing `rtih_admin/department-admin-chrome.php` (one level up, shared by every department). Only change: 3 new conditional nav entries in `adminSidebar()`, gated behind the flags above so no other department's sidebar changes. Everything else (including `adminTopbar()`/`adminMenuScript()`) is byte-for-byte what you sent. |

**Files this deliverable does NOT touch and you should NOT overwrite:**
`landing-content.php`, `landing-content-store.php`,
`landing-content-feed.php`, `applications.php`, `dashboard.php`, and the
other shared files one level up (`department-admin-bootstrap.php`,
`department-applications-template.php`, `department-dashboard-template.php`,
`db.php`).

## 3. Sidebar navigation links — resolved

You shared the real `department-admin-chrome.php`, so this is no longer a
guess. Its `adminSidebar()` already supports per-department optional nav
items gated by `$portal` flags (that's how `landing_content_enabled` /
`stories_events_enabled` / `partners_enabled` already work). The updated
`department-admin-chrome.php` in this folder adds three more, same pattern:

- `programs_enabled` → shows **Programs** → `incubation-programs.php`
- `sections_enabled` → shows **Page sections** → `incubation-sections.php`
- `applications_status_enabled` → shows **Application status** → `incubation-applications-status.php`

The updated `portal-config.php` in this folder turns all three on for the
Incubation department only. Because the gating is per-flag, no other
department's portal-config.php needs to change and their sidebars are
unaffected by replacing the shared chrome file.

**Important:** `department-admin-chrome.php` is shared across every
department's portal. Since you gave us its exact current content and we
only added the 3 gated blocks (nothing else changed — verify with a diff if
you want to be sure), replacing it should be safe for all departments. But
because it's shared infrastructure, it's worth a quick smoke-test on one
other department's dashboard after deploying, just to confirm its sidebar
still renders unchanged.

## 5. Seed real content

`incubation-sections-store.php`'s `incubationSectionDefaults()` already
contains the REAL current site copy (hero headline/subtitle/CTA/video,
all 6 "How You Benefit" cards, all 15 main FAQ entries, all 5 Startup
Toolkit categories with their logos, and both real gallery/summit carousel
slides) extracted directly from `incubation-page.component.ts` /
`startup-toolkit.ts`. So **Page sections** in the admin dashboard shows
accurate data with zero extra steps — no seed run required for that page,
including the new **Gallery** tab (unlike Programs below, it does not need
its own seed script).

**Programs**, however, needs a one-time seed because the
`incubation_programs` table starts empty. After deploying this backend,
while logged in as an admin, open this URL once in a browser:

```
https://yourdomain.com/rtih_admin/incubation/incubation-programs-seed.php
```

It upserts all 12 real program tracks (SPARK, Future Founders, Catalyst,
Velocity Lab, MedTech Challenge, AVGC-XR Incubation, InnoTribe, Student
Entrepreneurship, ClimateTech Cohort, Mobility Cohort, FoodTech Cohort,
EVTech Cohort) with their full real content (features, learning outcomes,
application steps, per-program FAQs, contacts, partners, highlights) taken
directly from the `PROGRAMS` const in `incubation-page.component.ts`, and
prints a plain-text summary of what was upserted.

**Run it only once**, right after deployment, before any admin edits a
program by hand — `incubation-programs-seed.php` is idempotent
(upsert-by-`program_key`) and safe to re-run, but re-running it after a
manual edit will overwrite that edit back to this hardcoded snapshot.

## 4. Angular side (already wired in this repo)

The Angular app now calls two new public feeds on init and merges the
response over its existing hardcoded content, so nothing breaks if the PHP
backend isn't deployed yet or a request fails:

- `incubation-programs-feed.php`
- `incubation-sections-feed.php`

See `src/app/incubation-page/incubation-content.service.ts` — it has a
clearly marked constant (`INCUBATION_API_BASE`) that must be updated to the
real Hostinger URL once this backend is deployed (e.g.
`https://yourdomain.com/rtih_admin/incubation`).

## 6. Image uploads (new)

Every image/logo URL field on `incubation-programs.php` (program hero
image) and `incubation-sections.php` (benefit card images, startup toolkit
logos) now has an "Upload" file picker next to the plain URL text field —
picking a file uploads it via `incubation-image-upload.php` and fills the
URL field in automatically. The URL text field still works exactly as
before for pasting external links, so nothing existing changes.

This needs one extra folder alongside the `.php` files:

- `uploads/` — where uploaded images are saved. Must be **writable by
  PHP**. Typical Hostinger shared hosting already makes newly created
  folders writable by the PHP user by default, but if uploads fail with a
  permissions error, `chmod 755 uploads` (and confirm the PHP process
  owns/can write to it) from the hosting file manager or SSH.
- `uploads/.htaccess` — ships with this deliverable; it disables PHP
  execution and directory listing inside `uploads/`. This is important
  defense-in-depth even though `incubation-image-upload.php` already
  validates the file extension and decodes it as a real image before
  saving — an uploads folder that can execute PHP is a classic RCE vector,
  so don't remove this file.

Drop `incubation-image-upload.php` in with the other `.php` files, and copy
the `uploads/` folder (with its `.htaccess`) into the same
`rtih_admin/incubation/` directory. No database changes are needed for
this feature.

## Things we had to guess / please double-check

`department-admin-chrome.php` is now confirmed (you shared it) — the
`adminSidebar()`/`adminTopbar()`/`adminMenuScript()` signatures our new
pages call match it exactly, and the sidebar wiring in step 3 is no longer
a guess. Still unverified, because these 3 files were never shared:
`department-admin-bootstrap.php`, `department-applications-template.php`,
`department-dashboard-template.php`. Also unverified: the exact body of
`landing-content.php` beyond what was pasted (we only saw enough of it to
match the CSRF/session/form pattern).

- Whether `adminUser($portal)` needs to be called before or after starting
  the session, and whether `department-admin-bootstrap.php` already starts
  the session for you (these new pages call `session_start()` defensively
  only `if (session_status() !== PHP_SESSION_ACTIVE)`, which is safe either
  way, but double-check there isn't a session-naming convention tied to
  `$portal['session_prefix']` that these pages should be using for the
  session itself, not just the CSRF token key).
- `adminDb()`'s exact behavior — we assumed it returns `?mysqli` similar to
  `rtihDb()` and never throws.
- The exact CSS class names used by the shared `department-portal-theme.css`
  (e.g. `.panel`, `.button`) — the new admin pages use plausible class names
  consistent with a typical admin theme, but their own `<style>` blocks are
  fully self-contained, so even if the shared theme uses different class
  names, these pages will still render correctly (just visually distinct
  from the rest of the portal) until you align the class names.
- The real applications table name/columns — `incubation-applications-status.php`
  deliberately never assumes this; it detects the table at runtime.
