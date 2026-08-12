<?php
declare(strict_types=1);

/**
 * incubation-programs-feed.php
 *
 * Public, read-only JSON feed of active incubation program tracks.
 * No authentication. Mirrors the pattern used by the existing
 * incubation/landing-content-feed.php (public feed for events/testimonials):
 * permissive CORS, short-lived cache headers, defensive against DB errors.
 *
 * Response shape:
 * { "ok": true, "programs": [ { id, program_key, track_group, title, tagline,
 *     route_path, display_order, active, content: {...}, updated_at }, ... ] }
 * or on failure: { "ok": false, "error": "..." }
 */

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/incubation-programs-store.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Cache-Control: public, max-age=60');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$db = rtihDb('Incubation programs feed');

if (!$db) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'Programs are temporarily unavailable.'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $programs = incubationLoadPrograms($db, true);
} catch (Throwable $exception) {
    error_log('Incubation programs feed error: ' . $exception->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Unable to load programs right now.'], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(['ok' => true, 'programs' => $programs], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
