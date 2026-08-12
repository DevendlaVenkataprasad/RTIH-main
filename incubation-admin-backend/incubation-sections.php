<?php
declare(strict_types=1);

/**
 * incubation-sections.php
 *
 * Admin page for the hero / benefits / main FAQ / startup toolkit landing
 * sections. Same shell/CSS/CSRF/session pattern as incubation/landing-content.php
 * (per the project owner's description) — see the note in
 * incubation-programs.php about the 5 shared portal files not being
 * available to verify against.
 */

require __DIR__ . '/portal-config.php';
require __DIR__ . '/../department-admin-bootstrap.php';
require __DIR__ . '/../department-admin-chrome.php';
require __DIR__ . '/incubation-sections-store.php';

$user = adminUser($portal);
$db = adminDb();

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}
if (empty($_SESSION['incubation_sections_csrf'])) {
    $_SESSION['incubation_sections_csrf'] = bin2hex(random_bytes(32));
}
$csrfToken = $_SESSION['incubation_sections_csrf'];

function incubationSectionsText(?string $value, int $maxLength = 500): string
{
    $value = trim((string) $value);
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', '', $value) ?? '';
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $maxLength);
    }
    return substr($value, 0, $maxLength);
}

function incubationSectionsCollectRows(string $field, array $columns, int $max = 60): array
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
            $value = incubationSectionsText((string) ($entry[$column] ?? ''), $maxLength);
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

$sectionKeys = ['hero', 'benefits', 'main_faq', 'toolkit', 'gallery'];
$activeTab = isset($_GET['tab']) && in_array($_GET['tab'], $sectionKeys, true) ? $_GET['tab'] : 'hero';

$error = '';
$flash = '';

if (!$db) {
    $error = 'The content database is temporarily unavailable. Please try again shortly.';
}

/* -----------------------------------------------------------------------
 * POST handling
 * -------------------------------------------------------------------- */

if ($db && ($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    $postedToken = (string) ($_POST['csrf_token'] ?? '');
    $section = isset($_POST['section']) && in_array($_POST['section'], $sectionKeys, true) ? $_POST['section'] : null;

    if (!hash_equals($csrfToken, $postedToken)) {
        $error = 'Your session has expired. Please try again.';
    } elseif ($section === null) {
        $error = 'Unknown section.';
    } else {
        $activeTab = $section;
        $defaults = incubationSectionDefaults();
        $sectionData = $defaults[$section];
        $sectionData['enabled'] = isset($_POST['enabled']);
        $sectionData['title'] = incubationSectionsText((string) ($_POST['title'] ?? ''), 200);
        $sectionData['subtitle'] = incubationSectionsText((string) ($_POST['subtitle'] ?? ''), 400);

        if ($section === 'hero') {
            $sectionData['headline'] = incubationSectionsText((string) ($_POST['headline'] ?? ''), 200);
            $sectionData['cta_label'] = incubationSectionsText((string) ($_POST['cta_label'] ?? ''), 60);
            $sectionData['cta_url'] = incubationSectionsText((string) ($_POST['cta_url'] ?? ''), 500);
            $sectionData['video_src'] = incubationSectionsText((string) ($_POST['video_src'] ?? ''), 300);
            unset($sectionData['items']);
        } elseif ($section === 'benefits') {
            $sectionData['items'] = incubationSectionsCollectRows('items', [
                'title' => 120, 'text' => 800, 'imageSrc' => 300, 'imageAlt' => 200, 'route' => 200,
            ]);
        } elseif ($section === 'main_faq') {
            $sectionData['items'] = incubationSectionsCollectRows('items', [
                'question' => 300, 'answer' => 1200,
            ]);
        } elseif ($section === 'toolkit') {
            // Toolkit categories: title, description, keyOfferings (newline separated), logos (newline separated "src|alt")
            $rawCategories = (array) ($_POST['items'] ?? []);
            $categories = [];
            foreach ($rawCategories as $entry) {
                if (!is_array($entry)) {
                    continue;
                }
                $title = incubationSectionsText((string) ($entry['title'] ?? ''), 120);
                if ($title === '') {
                    continue;
                }
                $offeringsRaw = (string) ($entry['keyOfferings'] ?? '');
                $offerings = array_values(array_filter(array_map(
                    static fn($line) => incubationSectionsText($line, 200),
                    preg_split('/\r\n|\r|\n/', $offeringsRaw) ?: []
                )));
                $logosRaw = (string) ($entry['logos'] ?? '');
                $logos = [];
                foreach ((preg_split('/\r\n|\r|\n/', $logosRaw) ?: []) as $logoLine) {
                    $parts = explode('|', $logoLine, 2);
                    $src = incubationSectionsText($parts[0] ?? '', 300);
                    if ($src === '') {
                        continue;
                    }
                    $logos[] = ['src' => $src, 'alt' => incubationSectionsText($parts[1] ?? '', 120)];
                }

                $categories[] = [
                    'title' => $title,
                    'description' => incubationSectionsText((string) ($entry['description'] ?? ''), 800),
                    'keyOfferings' => $offerings,
                    'logos' => $logos,
                ];

                if (count($categories) >= 20) {
                    break;
                }
            }
            $sectionData['items'] = $categories;
        } elseif ($section === 'gallery') {
            $sectionData['items'] = incubationSectionsCollectRows('items', [
                'title' => 160, 'description' => 800, 'date' => 60, 'location' => 160, 'imageSrc' => 300, 'imageAlt' => 200,
            ]);
        }

        try {
            $existing = incubationLoadSections($db, $sectionKeys);
            $existing[$section] = $sectionData;
            incubationSaveSections($db, $existing, [$section]);
            $flash = 'Saved.';
        } catch (Throwable $exception) {
            error_log('incubation-sections save error: ' . $exception->getMessage());
            $error = 'Could not save this section. Please try again.';
        }
    }
}

$sections = $db ? incubationLoadSections($db, $sectionKeys) : incubationSectionDefaults();

$pageTitle = 'Incubation Landing Sections';
$pageSubtitle = 'Manage hero, benefits, main FAQ, startup toolkit, and gallery content';

$tabLabels = [
    'hero' => 'Hero',
    'benefits' => 'Benefits',
    'main_faq' => 'Main FAQ',
    'toolkit' => 'Startup Toolkit',
    'gallery' => 'Gallery',
];

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
  .button { display: inline-block; padding: 8px 16px; border-radius: 8px; border: 1px solid #ddd; background: #f8f8f8; cursor: pointer; text-decoration: none; color: #222; font-size: 14px; }
  .button.primary { background: #7c3aed; border-color: #7c3aed; color: #fff; }
  label { display: block; font-weight: 600; margin-bottom: 6px; font-size: 13px; }
  input[type=text], input[type=url], textarea { width: 100%; padding: 8px 10px; border: 1px solid #ccc; border-radius: 8px; font: inherit; box-sizing: border-box; }
  textarea { min-height: 80px; }
  .field { margin-bottom: 14px; }
  .checkbox-field { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
  .checkbox-field label { margin: 0; }
  .repeatable-item { border: 1px dashed #ccc; border-radius: 10px; padding: 12px; margin-bottom: 10px; position: relative; }
  .repeatable-item .remove-item { position: absolute; top: 8px; right: 8px; }
  .helper { color: #666; font-size: 12px; margin-top: 4px; }
  .image-upload-row { display: flex; align-items: center; gap: 10px; margin-top: 6px; }
  .image-upload-status { font-size: 12px; color: #666; }
  .image-upload-preview { display: block; max-width: 160px; max-height: 100px; margin-top: 8px; border-radius: 8px; border: 1px solid #eee; object-fit: cover; }
</style>
</head>
<body>
<?= adminSidebar($portal, $user, 'incubation-sections') ?>
<div class="main">
  <?= adminTopbar($user, $pageTitle, $pageSubtitle) ?>
  <main class="content">

    <?php if ($flash): ?><div class="flash"><?= adminEscape($flash) ?></div><?php endif; ?>
    <?php if ($error): ?><div class="error-box"><?= adminEscape($error) ?></div><?php endif; ?>

    <div class="tabs">
      <?php foreach ($tabLabels as $key => $label): ?>
        <a class="tab-link <?= $activeTab === $key ? 'active' : '' ?>" href="incubation-sections.php?tab=<?= urlencode($key) ?>"><?= adminEscape($label) ?></a>
      <?php endforeach; ?>
    </div>

    <?php if (!$db): ?>
      <div class="panel"><p>Sections cannot be managed right now because the database connection is unavailable.</p></div>
    <?php else: ?>

      <div class="panel">
        <?php $section = $sections[$activeTab]; ?>
        <form method="post" action="incubation-sections.php?tab=<?= urlencode($activeTab) ?>">
          <input type="hidden" name="csrf_token" value="<?= adminEscape($csrfToken) ?>">
          <input type="hidden" name="section" value="<?= adminEscape($activeTab) ?>">

          <div class="checkbox-field">
            <input type="checkbox" id="enabled" name="enabled" <?= !empty($section['enabled']) ? 'checked' : '' ?>>
            <label for="enabled">Section enabled (shown on the site)</label>
          </div>

          <?php if ($activeTab === 'hero'): ?>
            <div class="field"><label for="headline">Headline</label><input type="text" id="headline" name="headline" value="<?= adminEscape($section['headline'] ?? '') ?>"></div>
            <div class="field"><label for="subtitle">Subtitle</label><textarea id="subtitle" name="subtitle"><?= adminEscape($section['subtitle'] ?? '') ?></textarea></div>
            <div class="field"><label for="cta_label">CTA button label</label><input type="text" id="cta_label" name="cta_label" value="<?= adminEscape($section['cta_label'] ?? '') ?>"></div>
            <div class="field"><label for="cta_url">CTA button URL</label><input type="text" id="cta_url" name="cta_url" value="<?= adminEscape($section['cta_url'] ?? '') ?>"></div>
            <div class="field"><label for="video_src">Hero video path/URL</label><input type="text" id="video_src" name="video_src" value="<?= adminEscape($section['video_src'] ?? '') ?>"></div>

          <?php elseif ($activeTab === 'benefits'): ?>
            <div class="field"><label for="title">Section title</label><input type="text" id="title" name="title" value="<?= adminEscape($section['title'] ?? '') ?>"></div>
            <div class="field"><label for="subtitle">Section subtitle</label><input type="text" id="subtitle" name="subtitle" value="<?= adminEscape($section['subtitle'] ?? '') ?>"></div>

            <h3>Benefit cards</h3>
            <div id="items-list">
              <?php foreach ($section['items'] as $i => $item): ?>
                <div class="repeatable-item">
                  <button type="button" class="button remove-item" onclick="removeItem(this)">Remove</button>
                  <div class="field"><label>Title</label><input type="text" name="items[<?= $i ?>][title]" value="<?= adminEscape($item['title'] ?? '') ?>"></div>
                  <div class="field"><label>Text</label><textarea name="items[<?= $i ?>][text]"><?= adminEscape($item['text'] ?? '') ?></textarea></div>
                  <div class="field image-field">
                    <label>Image path</label>
                    <input type="text" name="items[<?= $i ?>][imageSrc]" class="image-url-input" value="<?= adminEscape($item['imageSrc'] ?? '') ?>">
                    <div class="image-upload-row">
                      <input type="file" accept="image/*" data-image-upload>
                      <span class="image-upload-status"></span>
                    </div>
                    <img class="image-upload-preview" src="<?= adminEscape($item['imageSrc'] ?? '') ?>" alt="" style="<?= ($item['imageSrc'] ?? '') ? '' : 'display:none;' ?>">
                  </div>
                  <div class="field"><label>Image alt text</label><input type="text" name="items[<?= $i ?>][imageAlt]" value="<?= adminEscape($item['imageAlt'] ?? '') ?>"></div>
                  <div class="field"><label>Route (optional link, e.g. /funding-opportunities)</label><input type="text" name="items[<?= $i ?>][route]" value="<?= adminEscape($item['route'] ?? '') ?>"></div>
                </div>
              <?php endforeach; ?>
            </div>
            <template id="item-template">
              <div class="repeatable-item">
                <button type="button" class="button remove-item" onclick="removeItem(this)">Remove</button>
                <div class="field"><label>Title</label><input type="text" name="items[__i__][title]"></div>
                <div class="field"><label>Text</label><textarea name="items[__i__][text]"></textarea></div>
                <div class="field image-field">
                  <label>Image path</label>
                  <input type="text" name="items[__i__][imageSrc]" class="image-url-input">
                  <div class="image-upload-row">
                    <input type="file" accept="image/*" data-image-upload>
                    <span class="image-upload-status"></span>
                  </div>
                  <img class="image-upload-preview" src="" alt="" style="display:none;">
                </div>
                <div class="field"><label>Image alt text</label><input type="text" name="items[__i__][imageAlt]"></div>
                <div class="field"><label>Route (optional link)</label><input type="text" name="items[__i__][route]"></div>
              </div>
            </template>
            <button type="button" class="button" onclick="addItem('items-list','item-template')">Add benefit card</button>

          <?php elseif ($activeTab === 'main_faq'): ?>
            <div class="field"><label for="title">Section title</label><input type="text" id="title" name="title" value="<?= adminEscape($section['title'] ?? '') ?>"></div>
            <div class="field"><label for="subtitle">Section subtitle</label><input type="text" id="subtitle" name="subtitle" value="<?= adminEscape($section['subtitle'] ?? '') ?>"></div>

            <h3>FAQ entries</h3>
            <div id="items-list">
              <?php foreach ($section['items'] as $i => $item): ?>
                <div class="repeatable-item">
                  <button type="button" class="button remove-item" onclick="removeItem(this)">Remove</button>
                  <div class="field"><label>Question</label><input type="text" name="items[<?= $i ?>][question]" value="<?= adminEscape($item['question'] ?? '') ?>"></div>
                  <div class="field"><label>Answer</label><textarea name="items[<?= $i ?>][answer]"><?= adminEscape($item['answer'] ?? '') ?></textarea></div>
                </div>
              <?php endforeach; ?>
            </div>
            <template id="item-template">
              <div class="repeatable-item">
                <button type="button" class="button remove-item" onclick="removeItem(this)">Remove</button>
                <div class="field"><label>Question</label><input type="text" name="items[__i__][question]"></div>
                <div class="field"><label>Answer</label><textarea name="items[__i__][answer]"></textarea></div>
              </div>
            </template>
            <button type="button" class="button" onclick="addItem('items-list','item-template')">Add FAQ</button>

          <?php elseif ($activeTab === 'toolkit'): ?>
            <div class="field"><label for="title">Page title</label><input type="text" id="title" name="title" value="<?= adminEscape($section['title'] ?? '') ?>"></div>
            <div class="field"><label for="subtitle">Page subtitle</label><input type="text" id="subtitle" name="subtitle" value="<?= adminEscape($section['subtitle'] ?? '') ?>"></div>

            <h3>Partner categories (Legal, Finance, Technology, Marketing, HR, ...)</h3>
            <div id="items-list">
              <?php foreach ($section['items'] as $i => $item): ?>
                <div class="repeatable-item">
                  <button type="button" class="button remove-item" onclick="removeItem(this)">Remove</button>
                  <div class="field"><label>Title</label><input type="text" name="items[<?= $i ?>][title]" value="<?= adminEscape($item['title'] ?? '') ?>"></div>
                  <div class="field"><label>Description</label><textarea name="items[<?= $i ?>][description]"><?= adminEscape($item['description'] ?? '') ?></textarea></div>
                  <div class="field"><label>Key offerings (one per line)</label><textarea name="items[<?= $i ?>][keyOfferings]"><?= adminEscape(implode("\n", $item['keyOfferings'] ?? [])) ?></textarea></div>
                  <div class="field">
                    <label>Logos (one per line, format: image-path|alt text)</label>
                    <textarea name="items[<?= $i ?>][logos]"><?php
                      foreach (($item['logos'] ?? []) as $logo) {
                          echo adminEscape(($logo['src'] ?? '') . '|' . ($logo['alt'] ?? '')) . "\n";
                      }
                    ?></textarea>
                    <div class="image-upload-row">
                      <input type="file" accept="image/*" data-image-upload-append>
                      <span class="image-upload-status">Upload a logo to append its path below (add alt text after the |).</span>
                    </div>
                    <div class="helper">Example: assets/Startup-toolkit/Legal-partners/CA.png|CA legal partner</div>
                  </div>
                </div>
              <?php endforeach; ?>
            </div>
            <template id="item-template">
              <div class="repeatable-item">
                <button type="button" class="button remove-item" onclick="removeItem(this)">Remove</button>
                <div class="field"><label>Title</label><input type="text" name="items[__i__][title]"></div>
                <div class="field"><label>Description</label><textarea name="items[__i__][description]"></textarea></div>
                <div class="field"><label>Key offerings (one per line)</label><textarea name="items[__i__][keyOfferings]"></textarea></div>
                <div class="field">
                  <label>Logos (one per line, format: image-path|alt text)</label>
                  <textarea name="items[__i__][logos]"></textarea>
                  <div class="image-upload-row">
                    <input type="file" accept="image/*" data-image-upload-append>
                    <span class="image-upload-status">Upload a logo to append its path below (add alt text after the |).</span>
                  </div>
                  <div class="helper">Example: assets/Startup-toolkit/Legal-partners/CA.png|CA legal partner</div>
                </div>
              </div>
            </template>
            <button type="button" class="button" onclick="addItem('items-list','item-template')">Add category</button>

          <?php elseif ($activeTab === 'gallery'): ?>
            <div class="field"><label for="title">Section title (optional)</label><input type="text" id="title" name="title" value="<?= adminEscape($section['title'] ?? '') ?>"></div>
            <div class="field"><label for="subtitle">Section subtitle (optional)</label><input type="text" id="subtitle" name="subtitle" value="<?= adminEscape($section['subtitle'] ?? '') ?>"></div>

            <h3>Gallery slides</h3>
            <div id="items-list">
              <?php foreach ($section['items'] as $i => $item): ?>
                <div class="repeatable-item">
                  <button type="button" class="button remove-item" onclick="removeItem(this)">Remove</button>
                  <div class="field"><label>Title</label><input type="text" name="items[<?= $i ?>][title]" value="<?= adminEscape($item['title'] ?? '') ?>"></div>
                  <div class="field"><label>Description</label><textarea name="items[<?= $i ?>][description]"><?= adminEscape($item['description'] ?? '') ?></textarea></div>
                  <div class="field"><label>Date</label><input type="text" name="items[<?= $i ?>][date]" value="<?= adminEscape($item['date'] ?? '') ?>"></div>
                  <div class="field"><label>Location</label><input type="text" name="items[<?= $i ?>][location]" value="<?= adminEscape($item['location'] ?? '') ?>"></div>
                  <div class="field image-field">
                    <label>Image path</label>
                    <input type="text" name="items[<?= $i ?>][imageSrc]" class="image-url-input" value="<?= adminEscape($item['imageSrc'] ?? '') ?>">
                    <div class="image-upload-row">
                      <input type="file" accept="image/*" data-image-upload>
                      <span class="image-upload-status"></span>
                    </div>
                    <img class="image-upload-preview" src="<?= adminEscape($item['imageSrc'] ?? '') ?>" alt="" style="<?= ($item['imageSrc'] ?? '') ? '' : 'display:none;' ?>">
                  </div>
                  <div class="field"><label>Image alt text</label><input type="text" name="items[<?= $i ?>][imageAlt]" value="<?= adminEscape($item['imageAlt'] ?? '') ?>"></div>
                </div>
              <?php endforeach; ?>
            </div>
            <template id="item-template">
              <div class="repeatable-item">
                <button type="button" class="button remove-item" onclick="removeItem(this)">Remove</button>
                <div class="field"><label>Title</label><input type="text" name="items[__i__][title]"></div>
                <div class="field"><label>Description</label><textarea name="items[__i__][description]"></textarea></div>
                <div class="field"><label>Date</label><input type="text" name="items[__i__][date]"></div>
                <div class="field"><label>Location</label><input type="text" name="items[__i__][location]"></div>
                <div class="field image-field">
                  <label>Image path</label>
                  <input type="text" name="items[__i__][imageSrc]" class="image-url-input">
                  <div class="image-upload-row">
                    <input type="file" accept="image/*" data-image-upload>
                    <span class="image-upload-status"></span>
                  </div>
                  <img class="image-upload-preview" src="" alt="" style="display:none;">
                </div>
                <div class="field"><label>Image alt text</label><input type="text" name="items[__i__][imageAlt]"></div>
              </div>
            </template>
            <button type="button" class="button" onclick="addItem('items-list','item-template')">Add slide</button>

          <?php endif; ?>

          <div style="margin-top:24px;">
            <button type="submit" class="button primary">Save <?= adminEscape($tabLabels[$activeTab]) ?></button>
          </div>
        </form>
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

  /* Image upload wiring, additive next to the plain URL text inputs.
   * Both handlers are registered via document-level "change" delegation
   * so they also work for file inputs cloned in dynamically (new benefit
   * cards / toolkit logos added via addItem()/<template> after page
   * load), not just ones present at initial render. */

  // Case 1: a single image field paired with one URL text input + preview
  // (benefit card imageSrc, program hero imageSrc).
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

  // Case 2: toolkit logos are a single "one per line, src|alt" textarea
  // rather than discrete per-logo inputs, so uploading appends a new
  // "uploads/xyz.png|" line for the admin to add alt text after the pipe.
  document.addEventListener('change', function (event) {
    const input = event.target;
    if (!input.matches || !input.matches('[data-image-upload-append]')) return;

    const field = input.closest('.field');
    const textarea = field ? field.querySelector('textarea') : null;
    const status = field ? field.querySelector('.image-upload-status') : null;
    const file = input.files && input.files[0];
    if (!field || !textarea || !file) return;

    const formData = new FormData();
    formData.append('image', file);
    if (status) status.textContent = 'Uploading...';

    fetch('incubation-image-upload.php', { method: 'POST', body: formData })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        if (data && data.ok && data.url) {
          const needsNewline = textarea.value.length > 0 && !textarea.value.endsWith('\n');
          textarea.value += (needsNewline ? '\n' : '') + data.url + '|';
          if (status) status.textContent = 'Uploaded — add alt text after the | above.';
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
