<?php
declare(strict_types=1);

/**
 * incubation-applications-status.php
 *
 * DEFENSIVE / BEST-EFFORT admin page. The real schema of the incubation
 * applications table is NOT known to us — incubation/applications.php is a
 * thin wrapper around the shared department-applications-template.php,
 * which we were not shown. portal-config.php lists three POSSIBLE table
 * names in $portal['table_candidates']:
 *   incubation_applications, startup_applications, incubator_applications
 *
 * This page does NOT assume which one is real. On every load it:
 *   1. Checks (via INFORMATION_SCHEMA / SHOW TABLES) which of the three
 *      candidate table names actually exist in the current database.
 *   2. For each table that exists, adds a nullable `status` ENUM column and
 *      a nullable `reviewer_notes` TEXT column ONLY IF those columns are
 *      missing (never touches any other column, never drops/alters
 *      existing data).
 *   3. Lets an admin list rows from whichever table(s) exist and update
 *      status/notes per row.
 *
 * If none of the three candidate tables exist yet, this page shows a
 * friendly message instead of erroring.
 */

require __DIR__ . '/portal-config.php';
require __DIR__ . '/../department-admin-bootstrap.php';
require __DIR__ . '/../department-admin-chrome.php';

$user = adminUser($portal);
$db = adminDb();

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}
if (empty($_SESSION['incubation_applications_status_csrf'])) {
    $_SESSION['incubation_applications_status_csrf'] = bin2hex(random_bytes(32));
}
$csrfToken = $_SESSION['incubation_applications_status_csrf'];

$candidateTables = $portal['table_candidates'] ?? ['incubation_applications', 'startup_applications', 'incubator_applications'];
$statusValues = ['new', 'under_review', 'shortlisted', 'rejected', 'accepted'];

/** Returns true if the table exists in the current database. */
function incubationTableExists(mysqli $db, string $table): bool
{
    $escaped = $db->real_escape_string($table);
    $result = $db->query("SHOW TABLES LIKE '{$escaped}'");
    return $result instanceof mysqli_result && $result->num_rows > 0;
}

/** Returns true if the given column exists on the given table. */
function incubationColumnExists(mysqli $db, string $table, string $column): bool
{
    $statement = $db->prepare(
        'SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?'
    );
    if (!$statement) {
        return false;
    }
    $statement->bind_param('ss', $table, $column);
    $statement->execute();
    $result = $statement->get_result();
    $row = $result ? $result->fetch_assoc() : null;
    $statement->close();

    return $row && (int) $row['cnt'] > 0;
}

/**
 * Best-effort: add `status` and `reviewer_notes` columns to $table if
 * missing. $table must already be confirmed to exist and must come only
 * from the fixed $candidateTables allowlist (never from user input), since
 * table names cannot be parameterized in ALTER TABLE.
 */
function incubationEnsureStatusColumns(mysqli $db, string $table): void
{
    $quotedTable = '`' . str_replace('`', '', $table) . '`';

    if (!incubationColumnExists($db, $table, 'status')) {
        $db->query("ALTER TABLE {$quotedTable} ADD COLUMN status ENUM('new','under_review','shortlisted','rejected','accepted') NULL DEFAULT 'new'");
    }

    if (!incubationColumnExists($db, $table, 'reviewer_notes')) {
        $db->query("ALTER TABLE {$quotedTable} ADD COLUMN reviewer_notes TEXT NULL");
    }
}

/** Find the primary key column name for a table (falls back to 'id'). */
function incubationPrimaryKeyColumn(mysqli $db, string $table): string
{
    $statement = $db->prepare(
        'SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_KEY = \'PRI\'
         LIMIT 1'
    );
    if (!$statement) {
        return 'id';
    }
    $statement->bind_param('s', $table);
    $statement->execute();
    $result = $statement->get_result();
    $row = $result ? $result->fetch_assoc() : null;
    $statement->close();

    return $row ? (string) $row['COLUMN_NAME'] : 'id';
}

$error = '';
$flash = '';
$existingTables = [];

if (!$db) {
    $error = 'The applications database is temporarily unavailable. Please try again shortly.';
} else {
    foreach ($candidateTables as $candidate) {
        if (incubationTableExists($db, $candidate)) {
            try {
                incubationEnsureStatusColumns($db, $candidate);
                $existingTables[] = $candidate;
            } catch (Throwable $exception) {
                error_log('incubation-applications-status column ensure error for ' . $candidate . ': ' . $exception->getMessage());
            }
        }
    }
}

$activeTable = isset($_GET['table']) && in_array($_GET['table'], $existingTables, true)
    ? $_GET['table']
    : ($existingTables[0] ?? null);

/* -----------------------------------------------------------------------
 * POST: update status / notes for a single row
 * -------------------------------------------------------------------- */

if ($db && $activeTable && ($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    $postedToken = (string) ($_POST['csrf_token'] ?? '');
    $postedTable = (string) ($_POST['table'] ?? '');

    if (!hash_equals($csrfToken, $postedToken)) {
        $error = 'Your session has expired. Please try again.';
    } elseif (!in_array($postedTable, $existingTables, true)) {
        $error = 'Unknown table.';
    } else {
        $rowId = (int) ($_POST['row_id'] ?? 0);
        $status = (string) ($_POST['status'] ?? 'new');
        $notes = substr(trim((string) ($_POST['reviewer_notes'] ?? '')), 0, 4000);

        if (!in_array($status, $statusValues, true)) {
            $error = 'Invalid status value.';
        } elseif ($rowId <= 0) {
            $error = 'Invalid row.';
        } else {
            $pk = incubationPrimaryKeyColumn($db, $postedTable);
            $quotedTable = '`' . str_replace('`', '', $postedTable) . '`';
            $quotedPk = '`' . str_replace('`', '', $pk) . '`';

            $statement = $db->prepare("UPDATE {$quotedTable} SET status = ?, reviewer_notes = ? WHERE {$quotedPk} = ? LIMIT 1");
            if ($statement) {
                $statement->bind_param('ssi', $status, $notes, $rowId);
                $statement->execute();
                $statement->close();
                $flash = 'Application updated.';
                $activeTable = $postedTable;
            } else {
                $error = 'Could not update this application.';
            }
        }
    }
}

/* -----------------------------------------------------------------------
 * Load rows for the active table
 * -------------------------------------------------------------------- */

$rows = [];
$primaryKeyColumn = 'id';

if ($db && $activeTable) {
    $primaryKeyColumn = incubationPrimaryKeyColumn($db, $activeTable);
    $quotedTable = '`' . str_replace('`', '', $activeTable) . '`';
    $result = $db->query("SELECT * FROM {$quotedTable} ORDER BY {$primaryKeyColumn} DESC LIMIT 200");
    if ($result) {
        $rows = $result->fetch_all(MYSQLI_ASSOC);
    }
}

$pageTitle = 'Incubation Applications — Status';
$pageSubtitle = 'Best-effort status tracking layered on top of the existing applications table';

?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title><?= adminEscape($pageTitle) ?> · <?= adminEscape($portal['name'] ?? 'RTIH Admin') ?></title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="../department-portal-theme.css?v=<?= time() ?>">
<style>
  .panel { background: #fff; border-radius: 14px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,.08); margin-bottom: 24px; }
  .flash { background: #ecfdf5; border: 1px solid #10b981; color: #065f46; padding: 12px 16px; border-radius: 10px; margin-bottom: 16px; }
  .error-box { background: #fef2f2; border: 1px solid #f87171; color: #991b1b; padding: 12px 16px; border-radius: 10px; margin-bottom: 16px; }
  .tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
  .tab-link { padding: 8px 16px; border-radius: 8px; text-decoration: none; color: #444; background: #f3f3f3; font-size: 14px; }
  .tab-link.active { background: #7c3aed; color: #fff; }
  table.apps-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  table.apps-table th, table.apps-table td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #eee; vertical-align: top; max-width: 240px; overflow-wrap: break-word; }
  select, textarea { padding: 6px 8px; border: 1px solid #ccc; border-radius: 8px; font: inherit; }
  textarea { width: 100%; min-height: 50px; }
  .button { display: inline-block; padding: 6px 12px; border-radius: 8px; border: 1px solid #ddd; background: #f8f8f8; cursor: pointer; font-size: 13px; }
  .button.primary { background: #7c3aed; border-color: #7c3aed; color: #fff; }
  .scroll-x { overflow-x: auto; }
</style>
</head>
<body>
<?= adminSidebar($portal, $user, 'incubation-applications-status') ?>
<div class="main">
  <?= adminTopbar($user, $pageTitle, $pageSubtitle) ?>
  <main class="content">

    <?php if ($flash): ?><div class="flash"><?= adminEscape($flash) ?></div><?php endif; ?>
    <?php if ($error): ?><div class="error-box"><?= adminEscape($error) ?></div><?php endif; ?>

    <?php if (!$db): ?>
      <div class="panel"><p>Applications cannot be reviewed right now because the database connection is unavailable.</p></div>
    <?php elseif (empty($existingTables)): ?>
      <div class="panel">
        <p>None of the known applications table names were found in the database yet:</p>
        <ul>
          <?php foreach ($candidateTables as $candidate): ?><li><code><?= adminEscape($candidate) ?></code></li><?php endforeach; ?>
        </ul>
        <p>Once the public application form has been submitted at least once (which typically triggers the shared applications template to create its table), reload this page — the status and reviewer notes columns will be added automatically.</p>
      </div>
    <?php else: ?>

      <?php if (count($existingTables) > 1): ?>
        <div class="tabs">
          <?php foreach ($existingTables as $table): ?>
            <a class="tab-link <?= $activeTable === $table ? 'active' : '' ?>" href="incubation-applications-status.php?table=<?= urlencode($table) ?>"><?= adminEscape($table) ?></a>
          <?php endforeach; ?>
        </div>
      <?php endif; ?>

      <div class="panel">
        <h2>Applications (<?= adminEscape($activeTable ?? '') ?>)</h2>
        <p class="helper" style="color:#666;font-size:13px;">Showing the most recent 200 rows. Status and notes are additive columns managed only by this page.</p>

        <?php if (empty($rows)): ?>
          <p>No applications found yet.</p>
        <?php else: ?>
          <div class="scroll-x">
          <table class="apps-table">
            <thead>
              <tr>
                <?php foreach (array_keys($rows[0]) as $column): ?>
                  <?php if (in_array($column, ['status', 'reviewer_notes'], true)) continue; ?>
                  <th><?= adminEscape($column) ?></th>
                <?php endforeach; ?>
                <th>Status</th>
                <th>Reviewer notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($rows as $row): ?>
                <tr>
                  <?php foreach ($row as $column => $value): ?>
                    <?php if (in_array($column, ['status', 'reviewer_notes'], true)) continue; ?>
                    <td><?= adminEscape((string) ($value ?? '')) ?></td>
                  <?php endforeach; ?>
                  <td>
                    <form method="post" action="incubation-applications-status.php?table=<?= urlencode($activeTable) ?>">
                      <input type="hidden" name="csrf_token" value="<?= adminEscape($csrfToken) ?>">
                      <input type="hidden" name="table" value="<?= adminEscape($activeTable) ?>">
                      <input type="hidden" name="row_id" value="<?= adminEscape((string) ($row[$primaryKeyColumn] ?? '')) ?>">
                      <select name="status">
                        <?php foreach ($statusValues as $status): ?>
                          <option value="<?= adminEscape($status) ?>" <?= ($row['status'] ?? 'new') === $status ? 'selected' : '' ?>><?= adminEscape($status) ?></option>
                        <?php endforeach; ?>
                      </select>
                  </td>
                  <td>
                      <textarea name="reviewer_notes"><?= adminEscape((string) ($row['reviewer_notes'] ?? '')) ?></textarea>
                  </td>
                  <td>
                      <button type="submit" class="button primary">Save</button>
                    </form>
                  </td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
          </div>
        <?php endif; ?>
      </div>

    <?php endif; ?>

  </main>
</div>
<?= adminMenuScript() ?>
</body>
</html>
