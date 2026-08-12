<?php
declare(strict_types=1);

/**
 * incubation-programs.php
 *
 * Admin page for creating/editing/deleting incubation program tracks
 * (SPARK, Future Founders, Catalyst, ... plus any new program an admin
 * creates). Mirrors the shell/CSS/CSRF/session pattern of the existing
 * incubation/landing-content.php as described by the project owner:
 *   - require portal-config.php then department-admin-bootstrap.php (auth)
 *   - adminUser($portal), adminDb(), adminSidebar(), adminTopbar(),
 *     adminEscape(), adminMenuScript()
 *   - per-feature CSRF session key: incubation_programs_csrf
 *   - shared theme CSS one level up + a page-specific <style> block
 *   - repeatable item lists via <template> + JS renumber()
 *
 * NOTE: department-admin-bootstrap.php / department-admin-chrome.php /
 * department-*-template.php were NOT available to verify against. The
 * exact function signatures below are inferred only from how
 * landing-content.php is described using them. Please compare this file
 * against a real existing admin page (e.g. landing-content.php itself)
 * once dropped into the portal, and adjust adminSidebar()/adminTopbar()
 * calls if their real signatures differ.
 */

require __DIR__ . '/portal-config.php';
require __DIR__ . '/../department-admin-bootstrap.php';
require __DIR__ . '/../department-admin-chrome.php';
require __DIR__ . '/incubation-programs-store.php';

$user = adminUser($portal);
$db = adminDb();

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}
if (empty($_SESSION['incubation_programs_csrf'])) {
    $_SESSION['incubation_programs_csrf'] = bin2hex(random_bytes(32));
}
$csrfToken = $_SESSION['incubation_programs_csrf'];

/** Truncate + sanitize a plain-text field. */
function incubationText(?string $value, int $maxLength = 500): string
{
    $value = trim((string) $value);
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', '', $value) ?? '';
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $maxLength);
    }
    return substr($value, 0, $maxLength);
}

/** Pull a bounded repeatable list of associative rows out of $_POST[$field]. */
function incubationCollectRows(string $field, array $columns, int $max = 40): array
{
    $raw = (array) ($_POST[$field] ?? []);
    $rows = [];
    $count = 0;

    foreach ($raw as $entry) {
        if ($count >= $max) {
            break;
        }
        if (!is_array($entry)) {
            continue;
        }

        $row = [];
        $hasContent = false;
        foreach ($columns as $column => $maxLength) {
            $value = incubationText((string) ($entry[$column] ?? ''), $maxLength);
            $row[$column] = $value;
            if ($value !== '') {
                $hasContent = true;
            }
        }

        if ($hasContent) {
            $rows[] = $row;
            $count++;
        }
    }

    return $rows;
}

/** Pull a bounded flat string list out of $_POST[$field] (one textarea line per item, or field[]=...). */
function incubationCollectStrings(string $field, int $max = 40, int $maxLength = 300): array
{
    $raw = $_POST[$field] ?? '';

    if (is_array($raw)) {
        $items = $raw;
    } else {
        $items = preg_split('/\r\n|\r|\n/', (string) $raw) ?: [];
    }

    $result = [];
    foreach ($items as $item) {
        if (count($result) >= $max) {
            break;
        }
        $value = incubationText((string) $item, $maxLength);
        if ($value !== '') {
            $result[] = $value;
        }
    }

    return $result;
}

$error = '';
$flash = '';

if (!$db) {
    $error = 'The programs database is temporarily unavailable. Please try again shortly.';
}

$view = isset($_GET['view']) && $_GET['view'] === 'edit' ? 'edit' : 'list';
$editKey = isset($_GET['key']) ? (string) $_GET['key'] : '';
$isNewProgram = $editKey === 'new';

/* -----------------------------------------------------------------------
 * POST handling (save / delete)
 * -------------------------------------------------------------------- */

if ($db && ($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    $postedToken = (string) ($_POST['csrf_token'] ?? '');

    if (!hash_equals($csrfToken, $postedToken)) {
        $error = 'Your session has expired. Please try again.';
    } else {
        $action = (string) ($_POST['form_action'] ?? 'save');

        if ($action === 'delete') {
            $deleteKey = incubationText((string) ($_POST['program_key'] ?? ''), 60);
            if ($deleteKey !== '') {
                incubationDeleteProgram($db, $deleteKey);
                $flash = 'Program deleted.';
            }
            $view = 'list';
        } else {
            $isCreating = ((string) ($_POST['is_new'] ?? '')) === '1';
            $rawKey = incubationText((string) ($_POST['program_key'] ?? ''), 60);

            $programKey = null;
            if ($isCreating) {
                $slug = incubationSlugifyProgramKey($rawKey);
                if ($slug === null) {
                    $error = 'Please provide a valid program key using lowercase letters, numbers, and hyphens only.';
                } elseif (incubationProgramKeyExists($db, $slug)) {
                    $error = 'That program key already exists. Choose a different one.';
                } else {
                    $programKey = $slug;
                }
            } else {
                $programKey = $rawKey !== '' ? $rawKey : null;
                if ($programKey === null) {
                    $error = 'Missing program key.';
                }
            }

            if ($programKey !== null && $error === '') {
                $content = incubationProgramContentDefaults();
                $content['description'] = incubationText((string) ($_POST['description'] ?? ''), 500);
                $content['fullDescription'] = incubationText((string) ($_POST['fullDescription'] ?? ''), 4000);
                $content['duration'] = incubationText((string) ($_POST['duration'] ?? ''), 80);
                $content['format'] = incubationText((string) ($_POST['format'] ?? ''), 80);
                $content['location'] = incubationText((string) ($_POST['location'] ?? ''), 200);
                $content['imageSrc'] = incubationText((string) ($_POST['imageSrc'] ?? ''), 300);
                $content['imageAlt'] = incubationText((string) ($_POST['imageAlt'] ?? ''), 200);
                $content['applyUrl'] = incubationText((string) ($_POST['applyUrl'] ?? ''), 500);
                $content['colors'] = [
                    'primary' => incubationText((string) ($_POST['color_primary'] ?? ''), 20) ?: '#7c3aed',
                    'secondary' => incubationText((string) ($_POST['color_secondary'] ?? ''), 20) ?: '#F6A623',
                    'lightBg' => incubationText((string) ($_POST['color_lightBg'] ?? ''), 20) ?: '#f7f2ff',
                    'dark' => incubationText((string) ($_POST['color_dark'] ?? ''), 20) ?: '#2f1657',
                ];
                $content['targetAudience'] = incubationCollectStrings('targetAudience', 20, 120);
                $content['learningOutcomes'] = incubationCollectStrings('learningOutcomes', 20, 120);
                $content['partners'] = incubationCollectStrings('partners', 20, 160);
                $content['programHighlights'] = incubationCollectStrings('programHighlights', 20, 160);
                $content['features'] = incubationCollectRows('features', ['icon' => 60, 'title' => 120, 'description' => 400]);
                $content['applicationSteps'] = incubationCollectRows('steps', ['number' => 10, 'title' => 120, 'description' => 400]);
                $content['faqs'] = incubationCollectRows('faqs', ['question' => 300, 'answer' => 1200]);
                $content['contacts'] = [
                    'email' => incubationText((string) ($_POST['contact_email'] ?? ''), 160),
                    'phone' => incubationText((string) ($_POST['contact_phone'] ?? ''), 60),
                    'address' => incubationText((string) ($_POST['contact_address'] ?? ''), 300),
                ];

                $data = [
                    'track_group' => incubationText((string) ($_POST['track_group'] ?? 'core'), 40) ?: 'core',
                    'title' => incubationText((string) ($_POST['title'] ?? ''), 180),
                    'tagline' => incubationText((string) ($_POST['tagline'] ?? ''), 300),
                    'route_path' => incubationText((string) ($_POST['route_path'] ?? ''), 160),
                    'display_order' => (int) ($_POST['display_order'] ?? incubationNextDisplayOrder($db)),
                    'active' => isset($_POST['active']),
                    'content' => $content,
                ];

                if ($data['title'] === '') {
                    $error = 'Title is required.';
                } else {
                    try {
                        incubationSaveProgram($db, $programKey, $data);
                        $flash = $isCreating ? 'Program created.' : 'Program updated.';
                        $view = 'list';
                    } catch (Throwable $exception) {
                        error_log('incubation-programs save error: ' . $exception->getMessage());
                        $error = 'Could not save the program. Please try again.';
                    }
                }
            }
        }
    }
}

/* -----------------------------------------------------------------------
 * Data for current view
 * -------------------------------------------------------------------- */

$programs = [];
$editingProgram = null;

if ($db) {
    if ($view === 'edit') {
        if (!$isNewProgram) {
            $editingProgram = incubationLoadProgram($db, $editKey);
            if (!$editingProgram) {
                $error = 'Program not found.';
                $view = 'list';
            }
        }
    }

    if ($view === 'list') {
        $programs = incubationLoadPrograms($db, false);
    }
}

$pageTitle = 'Incubation Programs';
$pageSubtitle = $view === 'edit'
    ? ($isNewProgram ? 'Create a new program track' : 'Edit program track')
    : 'Manage the incubation program tracks shown on the site';

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
  .panel h2 { margin-top: 0; }
  .flash { background: #ecfdf5; border: 1px solid #10b981; color: #065f46; padding: 12px 16px; border-radius: 10px; margin-bottom: 16px; }
  .error-box { background: #fef2f2; border: 1px solid #f87171; color: #991b1b; padding: 12px 16px; border-radius: 10px; margin-bottom: 16px; }
  table.programs-table { width: 100%; border-collapse: collapse; }
  table.programs-table th, table.programs-table td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #eee; vertical-align: top; }
  .button { display: inline-block; padding: 8px 16px; border-radius: 8px; border: 1px solid #ddd; background: #f8f8f8; cursor: pointer; text-decoration: none; color: #222; font-size: 14px; }
  .button.primary { background: #7c3aed; border-color: #7c3aed; color: #fff; }
  .button.danger { background: #ef4444; border-color: #ef4444; color: #fff; }
  .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; gap: 12px; flex-wrap: wrap; }
  .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .form-grid.full { grid-template-columns: 1fr; }
  label { display: block; font-weight: 600; margin-bottom: 6px; font-size: 13px; }
  input[type=text], input[type=number], input[type=email], input[type=url], textarea, select {
    width: 100%; padding: 8px 10px; border: 1px solid #ccc; border-radius: 8px; font: inherit; box-sizing: border-box;
  }
  textarea { min-height: 80px; }
  .repeatable-item { border: 1px dashed #ccc; border-radius: 10px; padding: 12px; margin-bottom: 10px; position: relative; }
  .repeatable-item .remove-item { position: absolute; top: 8px; right: 8px; }
  .repeatable-list-actions { margin-top: 8px; }
  .field { margin-bottom: 14px; }
  .checkbox-field { display: flex; align-items: center; gap: 8px; }
  .checkbox-field label { margin: 0; }
  .helper { color: #666; font-size: 12px; margin-top: 4px; }
  .image-upload-row { display: flex; align-items: center; gap: 10px; margin-top: 6px; }
  .image-upload-status { font-size: 12px; color: #666; }
  .image-upload-preview { display: block; max-width: 160px; max-height: 100px; margin-top: 8px; border-radius: 8px; border: 1px solid #eee; object-fit: cover; }
</style>
</head>
<body>
<?= adminSidebar($portal, $user, 'incubation-programs') ?>
<div class="main">
  <?= adminTopbar($user, $pageTitle, $pageSubtitle) ?>
  <main class="content">

    <?php if ($flash): ?><div class="flash"><?= adminEscape($flash) ?></div><?php endif; ?>
    <?php if ($error): ?><div class="error-box"><?= adminEscape($error) ?></div><?php endif; ?>

    <?php if (!$db): ?>

      <div class="panel">
        <p>Programs cannot be managed right now because the database connection is unavailable. Check the DB_* environment variables and try again.</p>
      </div>

    <?php elseif ($view === 'edit'): ?>

      <?php
        $content = $editingProgram['content'] ?? incubationProgramContentDefaults();
        $formProgramKey = $editingProgram['program_key'] ?? '';
      ?>
      <div class="panel">
        <form method="post" action="incubation-programs.php">
          <input type="hidden" name="csrf_token" value="<?= adminEscape($csrfToken) ?>">
          <input type="hidden" name="form_action" value="save">
          <input type="hidden" name="is_new" value="<?= $isNewProgram ? '1' : '0' ?>">

          <div class="field">
            <label for="program_key">Program key (slug)</label>
            <?php if ($isNewProgram): ?>
              <input type="text" id="program_key" name="program_key" pattern="^[a-z0-9-]+$" placeholder="e.g. spark or a-new-track" required oninput="updateRoutePathPlaceholder(this.value)">
              <div class="helper">Lowercase letters, numbers, and hyphens only. Cannot be changed later.</div>
            <?php else: ?>
              <input type="text" id="program_key" value="<?= adminEscape($formProgramKey) ?>" readonly>
              <input type="hidden" name="program_key" value="<?= adminEscape($formProgramKey) ?>">
            <?php endif; ?>
          </div>

          <div class="form-grid">
            <div class="field">
              <label for="title">Title</label>
              <input type="text" id="title" name="title" value="<?= adminEscape($editingProgram['title'] ?? '') ?>" required>
            </div>
            <div class="field">
              <label for="tagline">Tagline</label>
              <input type="text" id="tagline" name="tagline" value="<?= adminEscape($editingProgram['tagline'] ?? '') ?>">
            </div>
            <div class="field">
              <label for="track_group">Track group</label>
              <select id="track_group" name="track_group">
                <?php foreach (['core' => 'Core', 'focused' => 'Focused', 'sector-cohort' => 'Sector Cohort'] as $value => $label): ?>
                  <option value="<?= adminEscape($value) ?>" <?= ($editingProgram['track_group'] ?? 'core') === $value ? 'selected' : '' ?>><?= adminEscape($label) ?></option>
                <?php endforeach; ?>
              </select>
            </div>
            <div class="field">
              <label for="route_path">Route path</label>
              <input type="text" id="route_path" name="route_path" placeholder="<?= $isNewProgram ? '/programs/' : '/spark' ?>" value="<?= adminEscape($editingProgram['route_path'] ?? '') ?>">
              <div class="helper">If left blank, the site falls back to /programs/{program_key}.</div>
            </div>
            <div class="field">
              <label for="display_order">Display order</label>
              <input type="number" id="display_order" name="display_order" value="<?= adminEscape((string) ($editingProgram['display_order'] ?? incubationNextDisplayOrder($db))) ?>">
            </div>
            <div class="field checkbox-field">
              <input type="checkbox" id="active" name="active" <?= ($editingProgram['active'] ?? true) ? 'checked' : '' ?>>
              <label for="active">Active (visible on the site)</label>
            </div>
          </div>

          <div class="field">
            <label for="description">Short description</label>
            <textarea id="description" name="description"><?= adminEscape($content['description']) ?></textarea>
          </div>
          <div class="field">
            <label for="fullDescription">Full description</label>
            <textarea id="fullDescription" name="fullDescription" style="min-height:140px;"><?= adminEscape($content['fullDescription']) ?></textarea>
          </div>

          <div class="form-grid">
            <div class="field"><label for="duration">Duration</label><input type="text" id="duration" name="duration" value="<?= adminEscape($content['duration']) ?>"></div>
            <div class="field"><label for="format">Format</label><input type="text" id="format" name="format" value="<?= adminEscape($content['format']) ?>"></div>
            <div class="field"><label for="location">Location</label><input type="text" id="location" name="location" value="<?= adminEscape($content['location']) ?>"></div>
            <div class="field image-field">
              <label for="imageSrc">Hero image path</label>
              <input type="text" id="imageSrc" name="imageSrc" class="image-url-input" value="<?= adminEscape($content['imageSrc']) ?>">
              <div class="image-upload-row">
                <input type="file" accept="image/*" data-image-upload>
                <span class="image-upload-status"></span>
              </div>
              <?php if ($content['imageSrc']): ?>
                <img class="image-upload-preview" src="<?= adminEscape($content['imageSrc']) ?>" alt="">
              <?php else: ?>
                <img class="image-upload-preview" src="" alt="" style="display:none;">
              <?php endif; ?>
            </div>
            <div class="field"><label for="imageAlt">Hero image alt text</label><input type="text" id="imageAlt" name="imageAlt" value="<?= adminEscape($content['imageAlt']) ?>"></div>
            <div class="field">
              <label for="applyUrl">Apply link (optional — leave blank to use the site-wide apply link)</label>
              <input type="url" id="applyUrl" name="applyUrl" placeholder="https://docs.google.com/forms/..." value="<?= adminEscape($content['applyUrl'] ?? '') ?>">
            </div>
          </div>

          <div class="form-grid">
            <div class="field"><label for="color_primary">Color: primary</label><input type="text" id="color_primary" name="color_primary" value="<?= adminEscape($content['colors']['primary'] ?? '') ?>"></div>
            <div class="field"><label for="color_secondary">Color: secondary</label><input type="text" id="color_secondary" name="color_secondary" value="<?= adminEscape($content['colors']['secondary'] ?? '') ?>"></div>
            <div class="field"><label for="color_lightBg">Color: light background</label><input type="text" id="color_lightBg" name="color_lightBg" value="<?= adminEscape($content['colors']['lightBg'] ?? '') ?>"></div>
            <div class="field"><label for="color_dark">Color: dark</label><input type="text" id="color_dark" name="color_dark" value="<?= adminEscape($content['colors']['dark'] ?? '') ?>"></div>
          </div>

          <div class="field">
            <label for="targetAudience">Target audience (one per line)</label>
            <textarea id="targetAudience" name="targetAudience"><?= adminEscape(implode("\n", $content['targetAudience'])) ?></textarea>
          </div>
          <div class="field">
            <label for="learningOutcomes">Learning outcomes (one per line)</label>
            <textarea id="learningOutcomes" name="learningOutcomes"><?= adminEscape(implode("\n", $content['learningOutcomes'])) ?></textarea>
          </div>
          <div class="field">
            <label for="partners">Partners (one per line)</label>
            <textarea id="partners" name="partners"><?= adminEscape(implode("\n", $content['partners'])) ?></textarea>
          </div>
          <div class="field">
            <label for="programHighlights">Program highlights (one per line)</label>
            <textarea id="programHighlights" name="programHighlights"><?= adminEscape(implode("\n", $content['programHighlights'])) ?></textarea>
          </div>

          <h3>Features</h3>
          <div id="features-list">
            <?php foreach ($content['features'] as $i => $feature): ?>
              <div class="repeatable-item">
                <button type="button" class="button remove-item" onclick="removeItem(this)">Remove</button>
                <div class="form-grid">
                  <div class="field"><label>Icon (Material icon name)</label><input type="text" name="features[<?= $i ?>][icon]" value="<?= adminEscape($feature['icon']) ?>"></div>
                  <div class="field"><label>Title</label><input type="text" name="features[<?= $i ?>][title]" value="<?= adminEscape($feature['title']) ?>"></div>
                </div>
                <div class="field"><label>Description</label><textarea name="features[<?= $i ?>][description]"><?= adminEscape($feature['description']) ?></textarea></div>
              </div>
            <?php endforeach; ?>
          </div>
          <template id="feature-template">
            <div class="repeatable-item">
              <button type="button" class="button remove-item" onclick="removeItem(this)">Remove</button>
              <div class="form-grid">
                <div class="field"><label>Icon (Material icon name)</label><input type="text" name="features[__i__][icon]"></div>
                <div class="field"><label>Title</label><input type="text" name="features[__i__][title]"></div>
              </div>
              <div class="field"><label>Description</label><textarea name="features[__i__][description]"></textarea></div>
            </div>
          </template>
          <div class="repeatable-list-actions"><button type="button" class="button" onclick="addItem('features-list','feature-template')">Add feature</button></div>

          <h3>Application steps</h3>
          <div id="steps-list">
            <?php foreach ($content['applicationSteps'] as $i => $step): ?>
              <div class="repeatable-item">
                <button type="button" class="button remove-item" onclick="removeItem(this)">Remove</button>
                <div class="form-grid">
                  <div class="field"><label>Number</label><input type="text" name="steps[<?= $i ?>][number]" value="<?= adminEscape($step['number']) ?>"></div>
                  <div class="field"><label>Title</label><input type="text" name="steps[<?= $i ?>][title]" value="<?= adminEscape($step['title']) ?>"></div>
                </div>
                <div class="field"><label>Description</label><textarea name="steps[<?= $i ?>][description]"><?= adminEscape($step['description']) ?></textarea></div>
              </div>
            <?php endforeach; ?>
          </div>
          <template id="step-template">
            <div class="repeatable-item">
              <button type="button" class="button remove-item" onclick="removeItem(this)">Remove</button>
              <div class="form-grid">
                <div class="field"><label>Number</label><input type="text" name="steps[__i__][number]"></div>
                <div class="field"><label>Title</label><input type="text" name="steps[__i__][title]"></div>
              </div>
              <div class="field"><label>Description</label><textarea name="steps[__i__][description]"></textarea></div>
            </div>
          </template>
          <div class="repeatable-list-actions"><button type="button" class="button" onclick="addItem('steps-list','step-template')">Add step</button></div>

          <h3>FAQs</h3>
          <div id="faqs-list">
            <?php foreach ($content['faqs'] as $i => $faq): ?>
              <div class="repeatable-item">
                <button type="button" class="button remove-item" onclick="removeItem(this)">Remove</button>
                <div class="field"><label>Question</label><input type="text" name="faqs[<?= $i ?>][question]" value="<?= adminEscape($faq['question']) ?>"></div>
                <div class="field"><label>Answer</label><textarea name="faqs[<?= $i ?>][answer]"><?= adminEscape($faq['answer']) ?></textarea></div>
              </div>
            <?php endforeach; ?>
          </div>
          <template id="faq-template">
            <div class="repeatable-item">
              <button type="button" class="button remove-item" onclick="removeItem(this)">Remove</button>
              <div class="field"><label>Question</label><input type="text" name="faqs[__i__][question]"></div>
              <div class="field"><label>Answer</label><textarea name="faqs[__i__][answer]"></textarea></div>
            </div>
          </template>
          <div class="repeatable-list-actions"><button type="button" class="button" onclick="addItem('faqs-list','faq-template')">Add FAQ</button></div>

          <h3>Contact</h3>
          <div class="form-grid">
            <div class="field"><label for="contact_email">Email</label><input type="email" id="contact_email" name="contact_email" value="<?= adminEscape($content['contacts']['email'] ?? '') ?>"></div>
            <div class="field"><label for="contact_phone">Phone</label><input type="text" id="contact_phone" name="contact_phone" value="<?= adminEscape($content['contacts']['phone'] ?? '') ?>"></div>
            <div class="field full" style="grid-column: 1 / -1;"><label for="contact_address">Address</label><input type="text" id="contact_address" name="contact_address" value="<?= adminEscape($content['contacts']['address'] ?? '') ?>"></div>
          </div>

          <div class="toolbar" style="margin-top:24px;">
            <a class="button" href="incubation-programs.php">Cancel</a>
            <button type="submit" class="button primary"><?= $isNewProgram ? 'Create program' : 'Save changes' ?></button>
          </div>
        </form>

        <?php if (!$isNewProgram): ?>
          <form method="post" action="incubation-programs.php" onsubmit="return confirm('Delete this program? This cannot be undone.');" style="margin-top:12px;">
            <input type="hidden" name="csrf_token" value="<?= adminEscape($csrfToken) ?>">
            <input type="hidden" name="form_action" value="delete">
            <input type="hidden" name="program_key" value="<?= adminEscape($formProgramKey) ?>">
            <button type="submit" class="button danger">Delete program</button>
          </form>
        <?php endif; ?>
      </div>

    <?php else: ?>

      <div class="panel">
        <div class="toolbar">
          <h2>Program tracks</h2>
          <a class="button primary" href="incubation-programs.php?view=edit&key=new">+ New Program</a>
        </div>

        <?php if (empty($programs)): ?>
          <p>No programs yet. Create the first one above.</p>
        <?php else: ?>
          <table class="programs-table">
            <thead>
              <tr><th>Title</th><th>Track group</th><th>Order</th><th>Active</th><th></th></tr>
            </thead>
            <tbody>
              <?php foreach ($programs as $program): ?>
                <tr>
                  <td><?= adminEscape($program['title']) ?><br><small style="color:#888;"><?= adminEscape($program['program_key']) ?></small></td>
                  <td><?= adminEscape($program['track_group']) ?></td>
                  <td><?= (int) $program['display_order'] ?></td>
                  <td><?= $program['active'] ? 'Yes' : 'No' ?></td>
                  <td>
                    <a class="button" href="incubation-programs.php?view=edit&key=<?= urlencode($program['program_key']) ?>">Edit</a>
                    <form method="post" action="incubation-programs.php" style="display:inline;" onsubmit="return confirm('Delete this program? This cannot be undone.');">
                      <input type="hidden" name="csrf_token" value="<?= adminEscape($csrfToken) ?>">
                      <input type="hidden" name="form_action" value="delete">
                      <input type="hidden" name="program_key" value="<?= adminEscape($program['program_key']) ?>">
                      <button type="submit" class="button danger">Delete</button>
                    </form>
                  </td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        <?php endif; ?>
      </div>

    <?php endif; ?>

  </main>
</div>
<script>
  function renumber(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const items = container.querySelectorAll('.repeatable-item');
    items.forEach((item, index) => {
      item.querySelectorAll('input, textarea, select').forEach((field) => {
        field.name = field.name.replace(/\[\d+\]/, '[' + index + ']');
      });
    });
  }

  function addItem(containerId, templateId) {
    const container = document.getElementById(containerId);
    const template = document.getElementById(templateId);
    if (!container || !template) return;
    const clone = template.content.cloneNode(true);
    const index = container.querySelectorAll('.repeatable-item').length;
    clone.querySelectorAll('input, textarea, select').forEach((field) => {
      field.name = field.name.replace('__i__', String(index));
    });
    container.appendChild(clone);
  }

  function removeItem(button) {
    const item = button.closest('.repeatable-item');
    const container = item ? item.parentElement : null;
    if (item) item.remove();
    if (container && container.id) renumber(container.id);
  }

  /* While creating a NEW program, live-update the route_path field's
   * placeholder (never its value, so we never fight the admin's own
   * typing) to hint at the /programs/{program_key} default it will get
   * if left blank. */
  function updateRoutePathPlaceholder(programKeyValue) {
    const routePathField = document.getElementById('route_path');
    if (!routePathField) return;
    const slug = String(programKeyValue || '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
    routePathField.placeholder = '/programs/' + slug;
  }

  /* Image upload wiring, additive next to the plain URL text inputs.
   * Uses a single document-level "change" listener (event delegation) so
   * it also works for [data-image-upload] file inputs that get cloned in
   * dynamically (e.g. new repeatable rows added via addItem()/<template>
   * after page load), not just ones present at initial render. */
  document.addEventListener('change', function (event) {
    const input = event.target;
    if (!input.matches || !input.matches('[data-image-upload]')) return;

    const field = input.closest('.image-field');
    const file = input.files && input.files[0];
    if (!field || !file) return;

    const urlInput = field.querySelector('.image-url-input');
    const preview = field.querySelector('.image-upload-preview');
    const status = field.querySelector('.image-upload-status');

    const formData = new FormData();
    formData.append('image', file);
    if (status) status.textContent = 'Uploading...';

    fetch('incubation-image-upload.php', { method: 'POST', body: formData })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        if (data && data.ok && data.url) {
          if (urlInput) urlInput.value = data.url;
          if (preview) {
            preview.src = data.url;
            preview.style.display = 'block';
          }
          if (status) status.textContent = 'Uploaded.';
        } else {
          if (status) status.textContent = 'Upload failed: ' + (data && data.error ? data.error : 'unknown error');
        }
      })
      .catch(function () {
        if (status) status.textContent = 'Upload failed.';
      });

    input.value = '';
  });
</script>
<?= adminMenuScript() ?>
</body>
</html>
