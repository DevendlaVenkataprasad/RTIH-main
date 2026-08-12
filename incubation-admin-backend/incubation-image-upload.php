<?php
declare(strict_types=1);

/**
 * incubation-image-upload.php
 *
 * Admin-auth-gated endpoint that accepts a single uploaded image file
 * (POST field name "image") and stores it under uploads/, returning the
 * relative path so the admin pages can drop it straight into an existing
 * imageSrc/logo-src URL text field. This is purely ADDITIVE — every image
 * field on the admin pages keeps working as a plain URL text input too,
 * for pasting external links.
 *
 * Response shape:
 *   Success: { "ok": true,  "url": "uploads/<generated-filename>" }
 *   Failure: { "ok": false, "error": "..." }
 *
 * Same auth require chain as the other admin pages in this folder.
 */

require __DIR__ . '/portal-config.php';
require __DIR__ . '/../department-admin-bootstrap.php';
require __DIR__ . '/../department-admin-chrome.php';

// Auth is established by the requires above (adminUser($portal) mirrors
// the pattern used by every other page in this folder).
$user = adminUser($portal);

header('Content-Type: application/json; charset=utf-8');

/** Send a JSON response with the given HTTP status and stop execution. */
function incubationImageUploadRespond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    incubationImageUploadRespond(405, ['ok' => false, 'error' => 'Only POST requests are accepted.']);
}

if (!isset($_FILES['image']) || !is_array($_FILES['image'])) {
    incubationImageUploadRespond(400, ['ok' => false, 'error' => 'No file was uploaded (expected field name "image").']);
}

$file = $_FILES['image'];

if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    incubationImageUploadRespond(400, ['ok' => false, 'error' => 'Upload failed (error code ' . (string) ($file['error'] ?? 'unknown') . ').']);
}

$tmpPath = (string) ($file['tmp_name'] ?? '');
if ($tmpPath === '' || !is_uploaded_file($tmpPath)) {
    incubationImageUploadRespond(400, ['ok' => false, 'error' => 'Invalid upload.']);
}

$maxBytes = 5 * 1024 * 1024; // 5MB
$size = (int) ($file['size'] ?? 0);
if ($size <= 0 || $size > $maxBytes) {
    incubationImageUploadRespond(400, ['ok' => false, 'error' => 'File is empty or larger than the 5MB limit.']);
}

$originalName = (string) ($file['name'] ?? 'upload');
$ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
$allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];

if (!in_array($ext, $allowedExtensions, true)) {
    incubationImageUploadRespond(400, ['ok' => false, 'error' => 'Unsupported file type. Allowed: ' . implode(', ', $allowedExtensions) . '.']);
}

if ($ext === 'svg') {
    // getimagesize() can't validate SVGs (they're XML, not raster), so
    // instead reject anything that could carry an executable payload.
    $svgContents = file_get_contents($tmpPath);
    if ($svgContents === false) {
        incubationImageUploadRespond(400, ['ok' => false, 'error' => 'Could not read the uploaded file.']);
    }
    if (stripos($svgContents, '<script') !== false) {
        incubationImageUploadRespond(400, ['ok' => false, 'error' => 'SVG files containing <script> are not allowed.']);
    }
} else {
    // getimagesize() decodes the file as a real raster image, which also
    // blocks disguised PHP/script uploads renamed with an image extension.
    $imageInfo = @getimagesize($tmpPath);
    if ($imageInfo === false) {
        incubationImageUploadRespond(400, ['ok' => false, 'error' => 'The uploaded file is not a valid image.']);
    }
}

$uploadsDir = __DIR__ . '/uploads';
if (!is_dir($uploadsDir)) {
    if (!mkdir($uploadsDir, 0755, true) && !is_dir($uploadsDir)) {
        incubationImageUploadRespond(500, ['ok' => false, 'error' => 'Could not create the uploads directory.']);
    }
}

$safeBaseName = preg_replace('/[^a-z0-9_-]/i', '', pathinfo($originalName, PATHINFO_FILENAME)) ?? '';
$filename = bin2hex(random_bytes(8)) . '-' . $safeBaseName . '.' . $ext;
$destination = $uploadsDir . '/' . $filename;

if (!move_uploaded_file($tmpPath, $destination)) {
    incubationImageUploadRespond(500, ['ok' => false, 'error' => 'Could not save the uploaded file.']);
}

@chmod($destination, 0644);

// Must be an ABSOLUTE URL: this value gets stored as imageSrc and later
// rendered by the Angular site, which lives on a different origin than
// this PHP admin — a relative "uploads/xxx.png" resolves against the
// wrong domain there (it only "worked" when previewed inside the admin
// panel itself, since that happens to share this origin).
$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = (string) ($_SERVER['HTTP_HOST'] ?? 'admin.rtih.co.in');
$scriptDir = rtrim(str_replace('\\', '/', dirname((string) ($_SERVER['SCRIPT_NAME'] ?? '/incubation/incubation-image-upload.php'))), '/');
$absoluteUrl = $scheme . '://' . $host . $scriptDir . '/uploads/' . $filename;

incubationImageUploadRespond(200, ['ok' => true, 'url' => $absoluteUrl]);
