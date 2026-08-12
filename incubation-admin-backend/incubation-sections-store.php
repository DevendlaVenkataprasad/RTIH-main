<?php
declare(strict_types=1);

/**
 * incubation-sections-store.php
 *
 * NEW file (does not modify the existing landing-content-store.php).
 *
 * Adds generic support for extra landing-page section keys — hero,
 * benefits, main_faq, toolkit — reusing the SAME incubation_landing_content
 * table that incubation/landing-content-store.php already created for
 * events/testimonials. The existing incubationLoadLandingContent() /
 * incubationSaveLandingContent() functions are left completely untouched
 * and keep hardcoding ['events', 'testimonials']; the functions below are
 * additive siblings parameterized by an arbitrary set of section keys, so
 * both code paths can safely coexist against the same table.
 *
 * Section default shapes are based on what is currently hardcoded in the
 * Angular app:
 * - hero: src/app/incubation-page/incubation-page.component.html (the
 *   `.hero` section) + `heroVideoSrc` / `incubationApplyUrl` in
 *   incubation-page.component.ts
 * - benefits: `benefitPrograms` in incubation-page.component.ts ("How You
 *   Benefit" cards)
 * - main_faq: `faqs` in incubation-page.component.ts (the main incubation
 *   page FAQ, NOT the per-program faqs which live in incubation_programs)
 * - toolkit: `categories` in src/app/startup-toolkit/startup-toolkit.ts
 *   (the whole /startup-toolkit page)
 * - gallery: `summitSlides` in incubation-page.component.ts (the image
 *   carousel banner at the top of /incubation)
 */

require_once __DIR__ . '/landing-content-store.php';

/** Allowlist of section keys this generic API is permitted to touch. */
function incubationSectionDefaults(): array
{
    return [
        'hero' => [
            'enabled' => true,
            'headline' => 'A Launchpad for Visionary Entrepreneurs and Creators',
            'subtitle' => 'A startup incubation platform for ambitious teams, mentors, partners, and ecosystem builders.',
            'cta_label' => 'Join Incubation',
            'cta_url' => 'https://docs.google.com/forms/d/e/1FAIpQLSc4krS7ZhXY8CqZE1O84Eg0EbTc_1_1DeKSVuNtgqx3xzemxA/viewform',
            'video_src' => '/assets/hero-compressed.mp4',
        ],
        'benefits' => [
            'enabled' => true,
            'title' => 'How You Benefit',
            'subtitle' => '',
            'items' => [
                // Each item: title, text, imageSrc, imageAlt, route (optional), disableFlip (optional)
                [
                    'title' => 'Funding opportunities',
                    'text' => 'Get access to investor connects, grant pathways, startup schemes, pitch-readiness guidance, and capital-readiness support for your growth stage. Founders receive help preparing stronger funding documents, understanding suitable capital routes, and reaching the right ecosystem partners.',
                    'imageSrc' => 'program-icons/fund.jpeg',
                    'imageAlt' => 'Funding opportunities',
                    'route' => '/funding-opportunities',
                    'disableFlip' => true,
                ],
                [
                    'title' => 'Co Working space',
                    'text' => 'Work from a focused startup environment built for team discussions, product planning, mentor reviews, and daily execution. The space supports founders with a professional setting to build, collaborate, host meetings, and stay connected with other growing teams.',
                    'imageSrc' => 'program-icons/co.jpeg',
                    'imageAlt' => 'Co working space',
                ],
                [
                    'title' => 'Networking Events',
                    'text' => 'Join workshops, founder circles, partner sessions, investor interactions, and ecosystem meetups designed for useful introductions. These events help startups discover collaborators, learn from peers, meet domain experts, and build relationships that continue beyond the room.',
                    'imageSrc' => 'program-icons/net.jpeg',
                    'imageAlt' => 'Networking events',
                ],
                [
                    'title' => 'Market Access',
                    'text' => 'Connect with potential customers, corporates, departments, pilot partners, and ecosystem stakeholders who can help validate and scale your solution. We support clearer market entry, stronger use cases, early adoption pathways, and practical growth conversations.',
                    'imageSrc' => 'program-icons/market.jpeg',
                    'imageAlt' => 'Market access',
                ],
                [
                    'title' => 'Technical and Legal Resources',
                    'text' => 'Access support across product architecture, technology validation, compliance, incorporation, accounting, intellectual property, contracts, and other founder essentials. These resources help teams reduce avoidable risk, improve operations, and build a stronger business foundation.',
                    'imageSrc' => 'program-icons/legal.jpeg',
                    'imageAlt' => 'Technical and legal resources',
                ],
                [
                    'title' => 'Mentorship Support',
                    'text' => 'Work with experienced mentors across strategy, product, finance, branding, operations, legal, and go-to-market planning. Mentorship helps founders test assumptions, sharpen decisions, improve execution, and move from idea to growth with clearer direction.',
                    'imageSrc' => 'program-icons/mentor.jpeg',
                    'imageAlt' => 'Mentorship support',
                ],
            ],
        ],
        'main_faq' => [
            'enabled' => true,
            'title' => 'Frequently Asked Questions',
            'subtitle' => '',
            'items' => [
                // Each item: question, answer
                ['question' => 'What is the RTIH Incubation Program?', 'answer' => 'The RTIH Incubation Program supports early-stage startups with mentorship, workspace, funding support, and industry access so they can build, validate, and scale faster.'],
                ['question' => 'Who can apply for the incubation program?', 'answer' => 'Startups at the idea, prototype, or early revenue stage can apply, especially those working in sectors RTIH focuses on such as deep tech, sustainability, healthcare, and agritech.'],
                ['question' => 'What stage should my startup be at to apply?', 'answer' => 'We usually work with validated ideas, prototypes, and early traction-stage startups. Pre-idea concepts are better suited to a pre-incubation track.'],
                ['question' => 'How long does the incubation program run?', 'answer' => 'The program typically runs for 6 to 12 months, depending on the startup stage and milestone progress.'],
                ['question' => 'What does the program provide to incubated startups?', 'answer' => 'Startups receive mentorship, co-working access, legal and compliance support, investor connects, technical resources, and ecosystem visibility.'],
                ['question' => 'Does RTIH provide funding to incubated startups?', 'answer' => 'Selected startups may be eligible for seed support, subject to evaluation, and RTIH also connects founders to external investors and grant programs.'],
                ['question' => 'Does RTIH take equity in incubated startups?', 'answer' => 'Equity terms depend on the support model. Startups receiving direct funding support may have a defined equity arrangement, while others are not required to give equity.'],
                ['question' => 'What is the application process?', 'answer' => 'Apply through the online form on this page. Shortlisted applicants move through screening and a pitch review before onboarding.'],
                ['question' => 'How often does RTIH open applications for incubation?', 'answer' => 'Applications may open on a rolling basis or through cohort windows, depending on the track. Announcements are shared on this page and through RTIH channels.'],
                ['question' => 'Is there a fee to join the incubation program?', 'answer' => 'There is no fee to apply. If a specific cohort includes a participation fee, it is shared upfront before onboarding.'],
                ['question' => 'What kind of mentorship is provided?', 'answer' => "Startups are paired with mentors from relevant industries, along with access to RTIH's network of entrepreneurs, domain experts, and functional specialists in areas like product, marketing, fundraising, and operations."],
                ['question' => 'Is physical presence at the RTIH facility required?', 'answer' => 'Participation depends on the track. Some cohorts are in-person while others support hybrid participation, and the model is shared during selection.'],
                ['question' => 'What happens after the incubation period ends?', 'answer' => 'Startups that complete the program join the RTIH alumni network and may continue to receive introductions, follow-on guidance, and event visibility.'],
                ['question' => 'Who owns the intellectual property developed during incubation?', 'answer' => 'Startups retain full ownership of their intellectual property. RTIH supports development and growth, but does not claim IP rights unless a funding agreement says otherwise.'],
                ['question' => 'Who do I contact for more information about the incubation program?', 'answer' => 'For queries, reach out to incubation@rtih.co.in or use the contact form on this page. The team typically responds within a few business days.'],
            ],
        ],
        'toolkit' => [
            'enabled' => true,
            'title' => 'Startup Toolkit',
            'subtitle' => 'Partner support across legal, finance, technology, marketing, and HR.',
            // Toolkit "items" double as categories: title, description, keyOfferings[], logos[] ({src, alt})
            'items' => [
                [
                    'title' => 'Legal Partners',
                    'description' => 'Legal helpdesk support helps startups stay compliant, protect IP, prepare contracts, manage tax and secretarial filings, and become investment-ready for future funding rounds.',
                    'keyOfferings' => [
                        'Legal templates and toolkits',
                        'Legal consultations and paid-service discounts',
                        'Compliance, contracts, tax, IP, FEMA, valuation and funding support',
                    ],
                    'logos' => [
                        ['src' => 'assets/Startup-toolkit/Legal-partners/AS&A.png', 'alt' => 'AS&A'],
                        ['src' => 'assets/Startup-toolkit/Legal-partners/CA.png', 'alt' => 'CA legal partner'],
                        ['src' => 'assets/Startup-toolkit/Legal-partners/superna.png', 'alt' => 'Superna'],
                        ['src' => 'assets/Startup-toolkit/Legal-partners/raasta.png', 'alt' => 'Raasta'],
                        ['src' => 'assets/Startup-toolkit/Legal-partners/volks-phantom.png', 'alt' => 'Volks Phantom'],
                    ],
                ],
                [
                    'title' => 'Finance Partners',
                    'description' => 'Finance partners support payment collections, transaction management, portfolio planning, investor readiness, valuation guidance, and access to early-stage funding networks.',
                    'keyOfferings' => [
                        'Payment setup and transaction-fee benefits',
                        'Financial planning and literacy programs',
                        'Investor connects, valuation guidance and pitch readiness',
                    ],
                    'logos' => [
                        ['src' => 'assets/Startup-toolkit/Finance-partners/f2Fintechlogo.png', 'alt' => 'F2 Fintech'],
                        ['src' => 'assets/Startup-toolkit/Finance-partners/PhonePe_Logo.png', 'alt' => 'PhonePe'],
                        ['src' => 'assets/Startup-toolkit/Finance-partners/ventures.webp', 'alt' => 'Ventures finance partner'],
                    ],
                ],
                [
                    'title' => 'Technology Partners',
                    'description' => 'Technology partners provide cloud credits, infrastructure, migration, modernization, managed cloud operations, security, and advisory support so startups can scale without heavy upfront cost.',
                    'keyOfferings' => [
                        'Cloud credits and post-credit infrastructure discounts',
                        'Cloud strategy, migration and modernization',
                        'Managed operations, security monitoring and cost governance',
                    ],
                    'logos' => [
                        ['src' => 'assets/Startup-toolkit/Technology-partners/pi-data-center.png', 'alt' => 'Pi Data Center'],
                        ['src' => 'assets/Startup-toolkit/Technology-partners/rapyder.png', 'alt' => 'Rapyder'],
                    ],
                ],
                [
                    'title' => 'Marketing Partners',
                    'description' => 'Marketing partners help startups build outreach engines with CRM tools, WhatsApp automation, cloud calling, chatbots, analytics, global visibility, and access to startup networks.',
                    'keyOfferings' => [
                        'CRM, Zoho wallet credits and startup software access',
                        'WhatsApp automation, cloud calling, chatbot flows and analytics',
                        'Global startup visibility, funding programs and ecosystem exposure',
                    ],
                    'logos' => [
                        ['src' => 'assets/Startup-toolkit/Marketing-partners/avasar.png', 'alt' => 'Avasar'],
                        ['src' => 'assets/Startup-toolkit/Marketing-partners/caller-desk.png', 'alt' => 'CallerDesk'],
                        ['src' => 'assets/Startup-toolkit/Marketing-partners/mrkting.jpeg', 'alt' => 'MrkTing'],
                        ['src' => 'assets/Startup-toolkit/Marketing-partners/zoho.png', 'alt' => 'Zoho'],
                    ],
                ],
                [
                    'title' => 'HR Partners',
                    'description' => 'HR partners support people operations through mentoring, learning resources, employee insurance, health benefits, payroll automation, attendance, and workforce management tools.',
                    'keyOfferings' => [
                        'Mentor sessions, virtual classes and learning resources',
                        'Health and business insurance benefits',
                        'HRMS, payroll, attendance and workforce tracking tools',
                    ],
                    'logos' => [
                        ['src' => 'assets/Startup-toolkit/HR-partners/coreHRx.svg', 'alt' => 'CoreHRx'],
                        ['src' => 'assets/Startup-toolkit/HR-partners/plum_rebranded_logo.svg', 'alt' => 'Plum'],
                        ['src' => 'assets/Startup-toolkit/HR-partners/Wadhwani-Foundation-Logo.webp', 'alt' => 'Wadhwani Foundation'],
                    ],
                ],
            ],
        ],
        'gallery' => [
            'enabled' => true,
            'title' => '',
            'subtitle' => '',
            'items' => [
                // Each item: title, description, date, location, imageSrc, imageAlt
                [
                    'title' => 'Catalyst Incubation Program V1.0',
                    'description' => 'Bringing together founders, innovators, and startup enthusiasts for insightful sessions focused on startup growth, validation, and building scalable ventures',
                    'date' => '12th May 2025',
                    'location' => 'RTIH, Amaravati',
                    'imageSrc' => 'cohort1.JPG',
                    'imageAlt' => 'Cohort',
                ],
                [
                    'title' => 'Spark',
                    'description' => 'Bringing together startup mentors, incubation leaders, branding experts, legal advisors, and aspiring entrepreneurs from across Andhra Pradesh to strengthen innovation, business strategy, and startup ecosystem development.',
                    'date' => 'May 2026',
                    'location' => 'RTIH, Amaravati',
                    'imageSrc' => 'future founders.JPG',
                    'imageAlt' => 'Future Founders',
                ],
            ],
        ],
    ];
}

/**
 * Load a set of sections generically from incubation_landing_content.
 *
 * @param array<int, string> $keys Must be a subset of array_keys(incubationSectionDefaults()).
 * @return array<string, array>
 */
function incubationLoadSections(mysqli $db, array $keys): array
{
    incubationEnsureLandingTable($db);

    $defaults = incubationSectionDefaults();
    $allowedKeys = array_values(array_intersect($keys, array_keys($defaults)));

    $content = [];
    foreach ($allowedKeys as $key) {
        $content[$key] = $defaults[$key];
    }

    if (empty($allowedKeys)) {
        return $content;
    }

    $placeholders = implode(',', array_fill(0, count($allowedKeys), '?'));
    $types = str_repeat('s', count($allowedKeys));

    $statement = $db->prepare("SELECT section_key, content_json FROM incubation_landing_content WHERE section_key IN ($placeholders)");
    if (!$statement) {
        return $content;
    }

    $statement->bind_param($types, ...$allowedKeys);
    $statement->execute();
    $result = $statement->get_result();

    foreach (($result ? $result->fetch_all(MYSQLI_ASSOC) : []) as $row) {
        $section = (string) $row['section_key'];
        $decoded = json_decode((string) $row['content_json'], true);
        if (isset($content[$section]) && is_array($decoded)) {
            $content[$section] = array_replace($content[$section], $decoded);
            if (array_key_exists('items', $decoded)) {
                $content[$section]['items'] = is_array($decoded['items']) ? array_values($decoded['items']) : [];
            }
        }
    }

    $statement->close();

    return $content;
}

/**
 * Save a set of sections generically to incubation_landing_content.
 *
 * @param array<string, array> $content Keyed by section, must match incubationSectionDefaults() shape.
 * @param array<int, string> $keys Must be a subset of array_keys(incubationSectionDefaults()).
 */
function incubationSaveSections(mysqli $db, array $content, array $keys): void
{
    incubationEnsureLandingTable($db);

    $allowedKeys = array_values(array_intersect($keys, array_keys(incubationSectionDefaults())));
    if (empty($allowedKeys)) {
        return;
    }

    $statement = $db->prepare('INSERT INTO incubation_landing_content (section_key, content_json) VALUES (?, ?)
        ON DUPLICATE KEY UPDATE content_json = VALUES(content_json), updated_at = CURRENT_TIMESTAMP');

    if (!$statement) {
        throw new RuntimeException('Unable to prepare section save statement.');
    }

    $db->begin_transaction();
    try {
        foreach ($allowedKeys as $section) {
            $key = $section;
            if (!isset($content[$section]) || !is_array($content[$section])) {
                continue;
            }
            $json = json_encode($content[$section], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
            $statement->bind_param('ss', $key, $json);
            $statement->execute();
        }
        $db->commit();
    } catch (Throwable $exception) {
        $db->rollback();
        throw $exception;
    } finally {
        $statement->close();
    }
}
