<?php
declare(strict_types=1);

/**
 * incubation-programs-store.php
 *
 * Data layer for the incubation "program tracks" (SPARK, Future Founders,
 * Catalyst, Velocity Lab, MedTech, AVGC-XR, InnoTribe, Student
 * Entrepreneurship, ClimateTech, Mobility, FoodTech, EVTech, and any new
 * program an admin creates through incubation-programs.php).
 *
 * This file is self-contained: it only needs a live mysqli connection
 * (obtained via adminDb() / rtihDb() in the calling page) and never opens
 * its own connection or reads credentials.
 *
 * The `content_json` column holds the full flexible per-program detail that
 * currently lives hardcoded in the Angular app's
 * src/app/incubation-page/incubation-page.component.ts (the `PROGRAMS`
 * const). Its shape (kept intentionally loose / additive so nothing already
 * hardcoded on the Angular side is lost when a program is NOT yet present
 * in the database):
 *
 * {
 *   "description": "...",
 *   "fullDescription": "...",
 *   "duration": "...",
 *   "format": "...",
 *   "location": "...",
 *   "imageSrc": "...",
 *   "imageAlt": "...",
 *   "applyUrl": "...",
 *   "colors": { "primary": "#...", "secondary": "#...", "lightBg": "#...", "dark": "#..." },
 *   "targetAudience": ["...", "..."],
 *   "features": [ { "icon": "...", "title": "...", "description": "..." }, ... ],
 *   "learningOutcomes": ["...", "..."],
 *   "applicationSteps": [ { "number": "01", "title": "...", "description": "..." }, ... ],
 *   "faqs": [ { "question": "...", "answer": "..." }, ... ],
 *   "contacts": { "email": "...", "phone": "...", "address": "..." },
 *   "partners": ["...", "..."],
 *   "programHighlights": ["...", "..."]
 * }
 */

function incubationEnsureProgramsTable(mysqli $db): void
{
    $db->query('CREATE TABLE IF NOT EXISTS incubation_programs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        program_key VARCHAR(60) NOT NULL,
        track_group VARCHAR(40) NOT NULL DEFAULT \'core\',
        title VARCHAR(180) NOT NULL,
        tagline VARCHAR(300) NULL,
        route_path VARCHAR(160) NULL,
        content_json LONGTEXT NOT NULL,
        display_order INT NOT NULL DEFAULT 0,
        active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_program_key (program_key)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');
}

/** Default (empty) content_json shape used when a program has no detail yet. */
function incubationProgramContentDefaults(): array
{
    return [
        'description' => '',
        'fullDescription' => '',
        'duration' => '',
        'format' => '',
        'location' => '',
        'imageSrc' => '',
        'imageAlt' => '',
        'applyUrl' => '',
        'colors' => ['primary' => '#7c3aed', 'secondary' => '#F6A623', 'lightBg' => '#f7f2ff', 'dark' => '#2f1657'],
        'targetAudience' => [],
        'features' => [],
        'learningOutcomes' => [],
        'applicationSteps' => [],
        'faqs' => [],
        'contacts' => ['email' => '', 'phone' => '', 'address' => ''],
        'partners' => [],
        'programHighlights' => [],
    ];
}

/**
 * @return array<int, array<string, mixed>> Rows with content_json decoded into 'content'.
 */
function incubationLoadPrograms(mysqli $db, bool $activeOnly = false): array
{
    incubationEnsureProgramsTable($db);

    $sql = 'SELECT id, program_key, track_group, title, tagline, route_path, content_json, display_order, active, created_at, updated_at
            FROM incubation_programs';
    if ($activeOnly) {
        $sql .= ' WHERE active = 1';
    }
    $sql .= ' ORDER BY display_order ASC, id ASC';

    $result = $db->query($sql);
    if (!$result) {
        return [];
    }

    $rows = [];
    foreach ($result->fetch_all(MYSQLI_ASSOC) as $row) {
        $decoded = json_decode((string) $row['content_json'], true);
        $row['content'] = is_array($decoded) ? array_replace(incubationProgramContentDefaults(), $decoded) : incubationProgramContentDefaults();
        unset($row['content_json']);
        $row['active'] = (int) $row['active'] === 1;
        $row['display_order'] = (int) $row['display_order'];
        $rows[] = $row;
    }

    return $rows;
}

function incubationLoadProgram(mysqli $db, string $key): ?array
{
    incubationEnsureProgramsTable($db);

    $statement = $db->prepare('SELECT id, program_key, track_group, title, tagline, route_path, content_json, display_order, active, created_at, updated_at
        FROM incubation_programs WHERE program_key = ? LIMIT 1');
    if (!$statement) {
        return null;
    }

    $statement->bind_param('s', $key);
    $statement->execute();
    $result = $statement->get_result();
    $row = $result ? $result->fetch_assoc() : null;
    $statement->close();

    if (!$row) {
        return null;
    }

    $decoded = json_decode((string) $row['content_json'], true);
    $row['content'] = is_array($decoded) ? array_replace(incubationProgramContentDefaults(), $decoded) : incubationProgramContentDefaults();
    unset($row['content_json']);
    $row['active'] = (int) $row['active'] === 1;
    $row['display_order'] = (int) $row['display_order'];

    return $row;
}

function incubationNextDisplayOrder(mysqli $db): int
{
    incubationEnsureProgramsTable($db);

    $result = $db->query('SELECT COALESCE(MAX(display_order), 0) AS max_order FROM incubation_programs');
    $row = $result ? $result->fetch_assoc() : null;

    return $row ? ((int) $row['max_order']) + 10 : 10;
}

/** Slugify + validate a program key. Returns null if the input can't produce a valid slug. */
function incubationSlugifyProgramKey(string $raw): ?string
{
    $slug = strtolower(trim($raw));
    $slug = preg_replace('/[^a-z0-9]+/', '-', $slug) ?? '';
    $slug = trim($slug, '-');

    if ($slug === '' || !preg_match('/^[a-z0-9-]+$/', $slug)) {
        return null;
    }

    return substr($slug, 0, 60);
}

function incubationProgramKeyExists(mysqli $db, string $key): bool
{
    incubationEnsureProgramsTable($db);

    $statement = $db->prepare('SELECT id FROM incubation_programs WHERE program_key = ? LIMIT 1');
    if (!$statement) {
        return false;
    }

    $statement->bind_param('s', $key);
    $statement->execute();
    $statement->store_result();
    $exists = $statement->num_rows > 0;
    $statement->close();

    return $exists;
}

/**
 * Upsert a program by program_key.
 *
 * $data expected keys: track_group, title, tagline, route_path, display_order,
 * active (bool), content (array matching incubationProgramContentDefaults()).
 */
function incubationSaveProgram(mysqli $db, string $key, array $data): void
{
    incubationEnsureProgramsTable($db);

    $trackGroup = (string) ($data['track_group'] ?? 'core');
    $title = (string) ($data['title'] ?? '');
    $tagline = $data['tagline'] !== null && $data['tagline'] !== '' ? (string) $data['tagline'] : null;
    $routePath = $data['route_path'] !== null && $data['route_path'] !== '' ? (string) $data['route_path'] : ('/programs/' . $key);
    $displayOrder = (int) ($data['display_order'] ?? 0);
    $active = !empty($data['active']) ? 1 : 0;
    $content = is_array($data['content'] ?? null) ? $data['content'] : incubationProgramContentDefaults();
    $contentJson = json_encode($content, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);

    $statement = $db->prepare('INSERT INTO incubation_programs
        (program_key, track_group, title, tagline, route_path, content_json, display_order, active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            track_group = VALUES(track_group),
            title = VALUES(title),
            tagline = VALUES(tagline),
            route_path = VALUES(route_path),
            content_json = VALUES(content_json),
            display_order = VALUES(display_order),
            active = VALUES(active),
            updated_at = CURRENT_TIMESTAMP');

    if (!$statement) {
        throw new RuntimeException('Unable to prepare program save statement.');
    }

    $statement->bind_param(
        'ssssssii',
        $key,
        $trackGroup,
        $title,
        $tagline,
        $routePath,
        $contentJson,
        $displayOrder,
        $active
    );
    $statement->execute();
    $statement->close();
}

function incubationDeleteProgram(mysqli $db, string $key): void
{
    incubationEnsureProgramsTable($db);

    $statement = $db->prepare('DELETE FROM incubation_programs WHERE program_key = ? LIMIT 1');
    if (!$statement) {
        return;
    }

    $statement->bind_param('s', $key);
    $statement->execute();
    $statement->close();
}
