<?php
declare(strict_types=1);

/**
 * incubation-sections-feed.php
 *
 * Public, read-only JSON feed for the hero / benefits / main_faq / toolkit
 * landing sections (managed via incubation-sections.php). Same pattern as
 * incubation/landing-content-feed.php: no auth, permissive CORS, short
 * cache, filters out disabled sections and inactive items.
 *
 * Response shape:
 * { "ok": true, "sections": { "hero": {...}, "benefits": {...}, "main_faq": {...}, "toolkit": {...}, "gallery": {...} } }
 */

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/incubation-sections-store.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Cache-Control: public, max-age=60');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$db = rtihDb('Incubation sections feed');
$sectionKeys = ['hero', 'benefits', 'main_faq', 'toolkit', 'gallery'];

if (!$db) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'Content is temporarily unavailable.'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $sections = incubationLoadSections($db, $sectionKeys);

    // Filter out items explicitly marked inactive/disabled (defensive; most
    // items won't carry this flag, but repeatable-item admin forms may add one).
    foreach ($sections as $key => $section) {
        if (!empty($section['items']) && is_array($section['items'])) {
            $sections[$key]['items'] = array_values(array_filter($section['items'], static function ($item) {
                return !is_array($item) || !array_key_exists('active', $item) || $item['active'];
            }));
        }
    }
} catch (Throwable $exception) {
    error_log('Incubation sections feed error: ' . $exception->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Unable to load content right now.'], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(['ok' => true, 'sections' => $sections], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
