<?php
declare(strict_types=1);

/**
 * incubation-programs-seed.php
 *
 * ONE-TIME seed script. Run this ONCE, as a logged-in admin, via the
 * browser (e.g. https://yourdomain.com/rtih_admin/incubation/incubation-programs-seed.php)
 * right after deploying this backend, BEFORE any admin manually edits
 * program content through incubation-programs.php.
 *
 * WARNING: every time this script runs it unconditionally UPSERTS
 * (incubationSaveProgram() is an INSERT ... ON DUPLICATE KEY UPDATE by
 * program_key) the 12 program records below with the content extracted
 * from the live Angular app (`src/app/incubation-page/incubation-page.component.ts`,
 * the `PROGRAMS` const). That means running it again AFTER an admin has
 * hand-edited one of these same program keys via the Programs admin UI
 * will OVERWRITE those manual edits back to this hardcoded snapshot. Only
 * run it once, immediately after deployment, while the `incubation_programs`
 * table is still empty/stale placeholder data.
 *
 * Auth: this file requires the same portal bootstrap chain as the other
 * admin pages, so only a logged-in department admin can execute it.
 */

require __DIR__ . '/portal-config.php';
require __DIR__ . '/../department-admin-bootstrap.php';
require __DIR__ . '/../department-admin-chrome.php';
require __DIR__ . '/incubation-programs-store.php';

$user = adminUser($portal);
$db = adminDb();

/**
 * Full-fidelity snapshot of the 12 real program tracks, extracted verbatim
 * from incubation-page.component.ts's PROGRAMS const (and cross-checked
 * against incubation-page.component.html / ProgramTrack carousel data for
 * track_group / route_path).
 *
 * Each entry: [track_group, title, tagline, route_path, content[]]
 * content[] matches incubationProgramContentDefaults() shape exactly, so it
 * lines up 1:1 with what mergeProgramFromBackend() in
 * incubation-page.component.ts reads (description, fullDescription,
 * duration, format, location, imageSrc, imageAlt, colors{}, targetAudience[],
 * features[]{icon,title,description}, learningOutcomes[],
 * applicationSteps[]{number,title,description}, faqs[]{question,answer},
 * contacts{email,phone,address}, partners[], programHighlights[]).
 */
function incubationSeedPrograms(): array
{
    return [
        'spark' => [
            'track_group' => 'core',
            'title' => 'SPARK',
            'tagline' => 'Explore -> Idea',
            'route_path' => '/spark',
            'content' => [
                'description' => 'A founder-first bootcamp that helps early-stage teams test ideas, sharpen problem statements, and plan the first build.',
                'fullDescription' => 'SPARK is the front door to the RTIH incubation journey. The track helps aspiring founders move from rough ideas to a validated startup direction through workshops, customer discovery, mentor feedback, and practical next-step planning.',
                'duration' => '1-2 Days',
                'format' => 'Bootcamp',
                'location' => 'RTIH, Amaravati',
                'imageSrc' => '/incubation/spark.jpg',
                'imageAlt' => 'SPARK bootcamp participants collaborating',
                'colors' => ['primary' => '#7c3aed', 'secondary' => '#F6A623', 'lightBg' => '#f7f2ff', 'dark' => '#2f1657'],
                'targetAudience' => ['Students', 'Aspiring founders', 'Idea-stage teams'],
                'features' => [
                    ['icon' => 'lightbulb', 'title' => 'Idea Validation', 'description' => 'Frame the problem clearly and test whether the idea solves a real market need.'],
                    ['icon' => 'groups', 'title' => 'Peer Learning', 'description' => 'Build alongside other founders and compare notes with mentors and facilitators.'],
                    ['icon' => 'search', 'title' => 'Customer Discovery', 'description' => 'Learn how to interview users, test assumptions, and spot early signals.'],
                    ['icon' => 'rocket_launch', 'title' => 'Launch Path', 'description' => 'Walk away with a practical plan for the next RTIH program or pilot step.'],
                ],
                'learningOutcomes' => ['Problem framing', 'Customer discovery', 'Pitch practice', 'MVP planning', 'Startup mindset'],
                'applicationSteps' => [
                    ['number' => '01', 'title' => 'Apply', 'description' => 'Share the idea, the team, and the market problem you want to solve.'],
                    ['number' => '02', 'title' => 'Review', 'description' => 'RTIH checks the clarity, relevance, and potential of the application.'],
                    ['number' => '03', 'title' => 'Bootcamp', 'description' => 'Join the bootcamp and work through the idea validation exercises.'],
                    ['number' => '04', 'title' => 'Next Step', 'description' => 'Move forward with a sharper concept and a stronger route into incubation.'],
                ],
                'faqs' => [
                    ['question' => 'Do I need a startup already?', 'answer' => 'No. SPARK is designed for idea-stage founders and first-time teams.'],
                    ['question' => 'Can I apply solo?', 'answer' => 'Yes. Individual founders are welcome and can also form teams during the bootcamp.'],
                    ['question' => 'What happens after SPARK?', 'answer' => 'Strong teams can move into Future Founders or other incubation tracks.'],
                ],
                'contacts' => ['email' => 'connect@rtih.co.in', 'phone' => '+91 73968 52244', 'address' => 'Mayuri Tech Park, Mangalagiri, Andhra Pradesh 522503'],
                'partners' => ['Government of Andhra Pradesh', 'RTIH mentors'],
                'programHighlights' => ['Problem framing', 'Customer discovery', 'Pitch practice'],
            ],
        ],
        'future-founders' => [
            'track_group' => 'core',
            'title' => 'Future Founders',
            'tagline' => 'Ideation -> Prototype',
            'route_path' => '/future-founders',
            'content' => [
                'description' => 'Structured pre-incubation for founders who are ready to build, test, and validate a first prototype.',
                'fullDescription' => 'Future Founders bridges ideation and formal incubation. The program combines mentor-led sessions, customer validation, prototype support, and startup fundamentals so teams can move from concept to something tangible.',
                'duration' => '6 Weeks',
                'format' => 'Structured Pre-Incubation',
                'location' => 'RTIH Amaravati Hub & Regional Spokes',
                'imageSrc' => '/incubation/ff.jpg',
                'imageAlt' => 'Future Founders workshop',
                'colors' => ['primary' => '#6f3298', 'secondary' => '#F6A623', 'lightBg' => '#f7f2ff', 'dark' => '#331a5c'],
                'targetAudience' => ['Student founders', 'Research teams', 'Early-stage startups'],
                'features' => [
                    ['icon' => 'design_services', 'title' => 'Structured Journey', 'description' => 'Move through a milestone-based path from concept to prototype readiness.'],
                    ['icon' => 'science', 'title' => 'Prototype Support', 'description' => 'Access feedback that improves product design, validation, and technical direction.'],
                    ['icon' => 'handshake', 'title' => 'Mentor Access', 'description' => 'Work with founders, operators, and domain experts across the RTIH network.'],
                    ['icon' => 'route', 'title' => 'Incubation Pathway', 'description' => 'High-potential teams can progress into Catalyst and funding support.'],
                ],
                'learningOutcomes' => ['MVP planning', 'Business model design', 'Customer discovery', 'Pitch deck creation', 'Fundraising basics'],
                'applicationSteps' => [
                    ['number' => '01', 'title' => 'Submit', 'description' => 'Apply with a concise problem statement and team summary.'],
                    ['number' => '02', 'title' => 'Screen', 'description' => 'RTIH reviews feasibility, innovation, and readiness for the cohort.'],
                    ['number' => '03', 'title' => 'Build', 'description' => 'Work through the six-week program with mentor checkpoints.'],
                    ['number' => '04', 'title' => 'Showcase', 'description' => 'Present progress and get routed into the right next opportunity.'],
                ],
                'faqs' => [
                    ['question' => 'Is a prototype required?', 'answer' => 'No. The program helps you build one if you do not have it yet.'],
                    ['question' => 'Who can apply?', 'answer' => 'Students, founders, and research-led teams are all welcome.'],
                    ['question' => 'What comes next?', 'answer' => 'Teams can move into Catalyst or other RTIH support tracks.'],
                ],
                'contacts' => ['email' => 'connect@rtih.co.in', 'phone' => '+91 73966 03335', 'address' => 'Mayuri Tech Park, Mangalagiri, Andhra Pradesh'],
                'partners' => ['Academic institutions', 'RTIH mentors', 'Innovation partners'],
                'programHighlights' => ['Prototype support', 'Mentor-led sprints', 'Pathway to incubation'],
            ],
        ],
        'catalyst' => [
            'track_group' => 'core',
            'title' => 'Catalyst Cohort',
            'tagline' => 'Prototype -> Commercialization',
            'route_path' => '/catalyst',
            'content' => [
                'description' => 'Growth-focused incubation for startups ready to move beyond product development and into market execution.',
                'fullDescription' => 'Catalyst is a four-to-six month incubation journey for startups that already have a prototype or MVP. Teams get support across commercialization, investor readiness, customer acquisition, and operational clarity.',
                'duration' => '4-6 Months',
                'format' => 'Hybrid Incubation',
                'location' => 'RTIH Amaravati Hub & Regional Spokes',
                'imageSrc' => '/incubation/catalyst.jpg',
                'imageAlt' => 'Catalyst incubation cohort',
                'colors' => ['primary' => '#5b2a86', 'secondary' => '#F6A623', 'lightBg' => '#f6f1fc', 'dark' => '#301458'],
                'targetAudience' => ['Early-stage startups', 'Product teams', 'Deep-tech founders'],
                'features' => [
                    ['icon' => 'trending_up', 'title' => 'Commercialization', 'description' => 'Turn product work into customer momentum and early revenue.'],
                    ['icon' => 'account_balance_wallet', 'title' => 'Funding Support', 'description' => 'Prepare for grant, seed, and early-stage funding conversations.'],
                    ['icon' => 'support_agent', 'title' => 'Dedicated Mentorship', 'description' => 'Get help from operators, investors, and sector specialists.'],
                    ['icon' => 'co_present', 'title' => 'Demo Day', 'description' => 'Showcase progress to partners and ecosystem stakeholders.'],
                ],
                'learningOutcomes' => ['Product-market fit', 'Revenue model design', 'Go-to-market planning', 'Investor readiness', 'Unit economics'],
                'applicationSteps' => [
                    ['number' => '01', 'title' => 'Apply', 'description' => 'Share the product stage, traction, and team profile.'],
                    ['number' => '02', 'title' => 'Interview', 'description' => 'Present your startup to the selection panel.'],
                    ['number' => '03', 'title' => 'Onboard', 'description' => 'Enter the cohort and start the growth sprint.'],
                    ['number' => '04', 'title' => 'Scale', 'description' => 'Work through pilots, partners, and capital-readiness milestones.'],
                ],
                'faqs' => [
                    ['question' => 'Who should apply?', 'answer' => 'Startups with a working prototype, MVP, or proof of concept.'],
                    ['question' => 'Is funding guaranteed?', 'answer' => 'No. The track improves readiness for the right funding conversations.'],
                    ['question' => 'Can the program run hybrid?', 'answer' => 'Yes. Catalyst is designed for a hybrid learning and mentorship model.'],
                ],
                'contacts' => ['email' => 'connect@rtih.co.in', 'phone' => '+91 73966 03335', 'address' => 'Mayuri Tech Park, Mangalagiri, Andhra Pradesh'],
                'partners' => ['Investors', 'Corporate partners', 'RTIH mentors'],
                'programHighlights' => ['Commercialization focus', 'Investor readiness', 'Demo day visibility'],
            ],
        ],
        'velocity-lab' => [
            'track_group' => 'core',
            'title' => 'Velocity Lab',
            'tagline' => 'Commercialization -> Establishment',
            'route_path' => '/velocity-lab',
            'content' => [
                'description' => 'Acceleration support for startups that already have traction and want to grow faster.',
                'fullDescription' => 'Velocity Lab is the scale-up track for proven startups. The program focuses on market expansion, operational discipline, and strategic growth decisions that help a team move from early traction to durable business performance.',
                'duration' => '3-4 Months',
                'format' => 'Acceleration Program',
                'location' => 'RTIH Amaravati Hub & Regional Spokes',
                'imageSrc' => '/incubation/vel.jpg',
                'imageAlt' => 'Velocity Lab startup scale-up session',
                'colors' => ['primary' => '#4b1e83', 'secondary' => '#F6A623', 'lightBg' => '#f6f1fc', 'dark' => '#26103f'],
                'targetAudience' => ['Growth-stage startups', 'Revenue teams', 'Scaling founders'],
                'features' => [
                    ['icon' => 'speed', 'title' => 'Acceleration', 'description' => 'Tighten execution around the fastest path to growth.'],
                    ['icon' => 'public', 'title' => 'Market Expansion', 'description' => 'Support new customer segments, channels, and regions.'],
                    ['icon' => 'handshake', 'title' => 'Strategic Partners', 'description' => 'Get closer to enterprise customers and partner ecosystems.'],
                    ['icon' => 'analytics', 'title' => 'Scale Planning', 'description' => 'Review operations, metrics, and investor conversations with clarity.'],
                ],
                'learningOutcomes' => ['Growth strategy', 'Revenue optimization', 'Team scaling', 'Partnership development', 'Operational excellence'],
                'applicationSteps' => [
                    ['number' => '01', 'title' => 'Submit', 'description' => 'Share traction, revenue data, and growth ambitions.'],
                    ['number' => '02', 'title' => 'Evaluate', 'description' => 'RTIH reviews the startup stage and scale-up readiness.'],
                    ['number' => '03', 'title' => 'Accelerate', 'description' => 'Join the cohort and work through growth milestones.'],
                    ['number' => '04', 'title' => 'Expand', 'description' => 'Move into market, partner, and capital opportunities.'],
                ],
                'faqs' => [
                    ['question' => 'Who is Velocity Lab for?', 'answer' => 'Startups with market validation and a clear need to scale faster.'],
                    ['question' => 'Does this help with investor access?', 'answer' => 'Yes. The track prepares teams for fundraising and strategic introductions.'],
                    ['question' => 'Is it only for RTIH startups?', 'answer' => 'No. Strong external startups can also be considered.'],
                ],
                'contacts' => ['email' => 'connect@rtih.co.in', 'phone' => '+91 73966 03335', 'address' => 'Mayuri Tech Park, Mangalagiri, Andhra Pradesh'],
                'partners' => ['Investors', 'Enterprise partners', 'Growth mentors'],
                'programHighlights' => ['Scale-up support', 'Market expansion', 'Investor access'],
            ],
        ],
        'medtech' => [
            'track_group' => 'focused',
            'title' => 'MedTech Challenge',
            'tagline' => 'Healthcare Innovation -> Deployment',
            'route_path' => '/medtech',
            'content' => [
                'description' => 'A challenge-led track for teams building portable, affordable, and deployable healthcare technology.',
                'fullDescription' => 'The MedTech Challenge supports founders who are solving real healthcare problems. The track emphasizes deployment readiness, clinical feedback, and practical product design for clinics, hospitals, and field settings.',
                'duration' => '6-8 Weeks',
                'format' => 'Challenge Track',
                'location' => 'RTIH Amaravati Hub & Healthcare Partner Networks',
                'imageSrc' => '/incubation/medtech.jpg',
                'imageAlt' => 'MedTech challenge participants collaborating on a healthcare solution',
                'colors' => ['primary' => '#059669', 'secondary' => '#14b8a6', 'lightBg' => '#ecfdf5', 'dark' => '#064e3b'],
                'targetAudience' => ['Biomedical teams', 'Healthcare founders', 'Clinicians with product ideas'],
                'features' => [
                    ['icon' => 'medical_services', 'title' => 'Healthcare Use Cases', 'description' => 'Work on practical problems and use cases in real medical settings.'],
                    ['icon' => 'science', 'title' => 'Prototype Validation', 'description' => 'Refine the solution with mentor feedback and field context.'],
                    ['icon' => 'monitor_heart', 'title' => 'Pilot Readiness', 'description' => 'Prepare for testing, regulatory awareness, and early deployment.'],
                    ['icon' => 'hub', 'title' => 'Ecosystem Linkages', 'description' => 'Connect with hospitals, labs, and support partners.'],
                ],
                'learningOutcomes' => ['Problem discovery', 'Product design', 'Pilot planning', 'Business model design', 'Deployment awareness'],
                'applicationSteps' => [
                    ['number' => '01', 'title' => 'Concept Note', 'description' => 'Share the healthcare problem and your proposed solution.'],
                    ['number' => '02', 'title' => 'Screening', 'description' => 'RTIH checks feasibility, impact, and deployment promise.'],
                    ['number' => '03', 'title' => 'Sprint', 'description' => 'Iterate the prototype with challenge mentors and partners.'],
                    ['number' => '04', 'title' => 'Showcase', 'description' => 'Present the solution to ecosystem stakeholders.'],
                ],
                'faqs' => [
                    ['question' => 'Do I need a finished device?', 'answer' => 'No. Early-stage concepts and prototypes are welcome.'],
                    ['question' => 'Can non-medical founders apply?', 'answer' => 'Yes. Engineers, designers, and multidisciplinary teams can join.'],
                    ['question' => 'Will there be pilot support?', 'answer' => 'The program is designed to help with practical validation and pilot readiness.'],
                ],
                'contacts' => ['email' => 'medtech@rtih.co.in', 'phone' => '+91 73968 52244', 'address' => 'Mayuri Tech Park, Mangalagiri, Andhra Pradesh 522503'],
                'partners' => ['Hospitals', 'Clinics', 'Biomedical labs'],
                'programHighlights' => ['Portable healthcare', 'Pilot testing', 'Clinical mentorship'],
            ],
        ],
        'avgc-xr' => [
            'track_group' => 'focused',
            'title' => 'AVGC-XR Incubation',
            'tagline' => 'Creative Innovation -> Industry Leadership',
            'route_path' => '/avgc-xr',
            'content' => [
                'description' => 'A dedicated track for animation, VFX, gaming, comics, and immersive technology ventures.',
                'fullDescription' => 'The AVGC-XR track supports creators and startups building in animation, VFX, gaming, comics, AR, VR, and immersive digital experiences. It combines creative mentorship with product and market guidance.',
                'duration' => 'Up to 6 Months',
                'format' => 'Sector-Specific Incubation',
                'location' => 'RTIH Amaravati Hub (INNO-XR Lab)',
                'imageSrc' => '/incubation/ap-vaga-xr-summit-2025.jpeg',
                'imageAlt' => 'AVGC-XR summit stage and audience',
                'colors' => ['primary' => '#7c3aed', 'secondary' => '#d946ef', 'lightBg' => '#faf5ff', 'dark' => '#6b21a8'],
                'targetAudience' => ['Animation studios', 'Game developers', 'XR innovators'],
                'features' => [
                    ['icon' => 'brush', 'title' => 'Creative Tech', 'description' => 'Work across storytelling, design, and immersive experience development.'],
                    ['icon' => 'vrpano', 'title' => 'XR Lab Access', 'description' => 'Build and test solutions in a space aligned to immersive tech work.'],
                    ['icon' => 'group_work', 'title' => 'Industry Mentorship', 'description' => 'Learn from creative-tech practitioners and ecosystem leaders.'],
                    ['icon' => 'storefront', 'title' => 'Go-to-Market', 'description' => 'Prepare for customer discovery, packaging, and revenue strategy.'],
                ],
                'learningOutcomes' => ['Creative product development', 'XR prototyping', 'Game design', 'VFX pipelines', 'Revenue strategy'],
                'applicationSteps' => [
                    ['number' => '01', 'title' => 'Submit', 'description' => 'Share the creative concept or venture profile.'],
                    ['number' => '02', 'title' => 'Screen', 'description' => 'RTIH reviews sector fit and innovation potential.'],
                    ['number' => '03', 'title' => 'Onboard', 'description' => 'Receive mentorship, lab guidance, and cohort support.'],
                    ['number' => '04', 'title' => 'Demo', 'description' => 'Showcase progress to creative and industry partners.'],
                ],
                'faqs' => [
                    ['question' => 'Is this only for studios?', 'answer' => 'No. Solo creators, teams, and startups can all apply.'],
                    ['question' => 'Do I need a prototype?', 'answer' => 'No. Early-stage concepts are welcome if they fit the sector.'],
                    ['question' => 'Can students apply?', 'answer' => 'Yes. Students with creative-tech ideas are encouraged.'],
                ],
                'contacts' => ['email' => 'connect@rtih.co.in', 'phone' => '+91 73966 03335', 'address' => 'Mayuri Tech Park, Mangalagiri, Andhra Pradesh'],
                'partners' => ['APVAGA', 'Creative studios', 'Technology vendors'],
                'programHighlights' => ['AVGC-XR specialization', 'XR lab access', 'Industry mentors'],
            ],
        ],
        'innotribe' => [
            'track_group' => 'focused',
            'title' => 'InnoTribe',
            'tagline' => 'Learning -> Venture Building',
            'route_path' => '/innotribe',
            'content' => [
                'description' => 'A student innovation pathway that helps colleges and universities turn campus curiosity into venture-ready teams.',
                'fullDescription' => 'InnoTribe builds entrepreneurial confidence among students through idea generation, problem solving, startup basics, and practical venture-building experiences. It creates a path from campus exploration to incubation-ready teams.',
                'duration' => 'Ongoing student pathway',
                'format' => 'Campus / Hybrid / Cohort-based',
                'location' => 'Partner institutions across Andhra Pradesh',
                'imageSrc' => '/incubation/innotribe.jpg',
                'imageAlt' => 'InnoTribe student innovation cohort',
                'colors' => ['primary' => '#4338ca', 'secondary' => '#6366f1', 'lightBg' => '#eef2ff', 'dark' => '#312e81'],
                'targetAudience' => ['University students', 'College clubs', 'Student innovators'],
                'features' => [
                    ['icon' => 'school', 'title' => 'Campus Focus', 'description' => 'Programs are built around colleges, student groups, and faculty support.'],
                    ['icon' => 'groups', 'title' => 'Peer Networks', 'description' => 'Students can build teams with people from different disciplines.'],
                    ['icon' => 'auto_awesome', 'title' => 'Idea Formation', 'description' => 'Move from curiosity to a problem statement and venture direction.'],
                    ['icon' => 'emoji_events', 'title' => 'Progression', 'description' => 'Outstanding teams can move toward incubation and showcase opportunities.'],
                ],
                'learningOutcomes' => ['Entrepreneurial mindset', 'Problem discovery', 'Idea generation', 'Prototype thinking', 'Team collaboration'],
                'applicationSteps' => [
                    ['number' => '01', 'title' => 'Campus outreach', 'description' => 'RTIH works with institutions and student groups to start the program.'],
                    ['number' => '02', 'title' => 'Registration', 'description' => 'Students join the relevant cohort or workshop series.'],
                    ['number' => '03', 'title' => 'Idea sessions', 'description' => 'Teams explore problems, ideas, and possible solutions.'],
                    ['number' => '04', 'title' => 'Showcase', 'description' => 'Teams present ideas and move into the next RTIH track.'],
                ],
                'faqs' => [
                    ['question' => 'Who can join?', 'answer' => 'Students from colleges and universities across Andhra Pradesh.'],
                    ['question' => 'Do I need a startup idea?', 'answer' => 'No. InnoTribe is designed to help you find and shape one.'],
                    ['question' => 'What happens after?', 'answer' => 'Students can continue into RTIH founder programs and incubation.'],
                ],
                'contacts' => ['email' => 'connect@rtih.co.in', 'phone' => '+91 73968 52244', 'address' => 'Partner campuses across Andhra Pradesh'],
                'partners' => ['Universities', 'Innovation cells', 'Faculty mentors'],
                'programHighlights' => ['Campus learning', 'Prototype creation', 'Mentor-led workshops'],
            ],
        ],
        'student-entrepreneurship' => [
            'track_group' => 'focused',
            'title' => 'Student Entrepreneurship',
            'tagline' => 'Learning -> Building -> Launching',
            'route_path' => '/student-entrepreneurship',
            'content' => [
                'description' => 'A dedicated pathway for student founders to turn ideas into sustainable businesses with institutional support.',
                'fullDescription' => 'RTIH student entrepreneurship programs empower the next generation of founders across Andhra Pradesh. The pathway blends mentorship, campus outreach, and access to the wider incubation ecosystem so students can move from idea to venture-ready execution.',
                'duration' => 'Varied by cohort',
                'format' => 'Campus / Hybrid / Cohort-based',
                'location' => 'Partner campuses across Andhra Pradesh',
                'imageSrc' => '/incubation/VIP.jpg',
                'imageAlt' => 'Student Entrepreneurship Program cohort',
                'colors' => ['primary' => '#059669', 'secondary' => '#10b981', 'lightBg' => '#ecfdf5', 'dark' => '#064e3b'],
                'targetAudience' => ['University students', 'College clubs', 'Student innovators'],
                'features' => [
                    ['icon' => 'menu_book', 'title' => 'Curriculum Integration', 'description' => 'Blend startup milestones with academic progress and practical work.'],
                    ['icon' => 'groups', 'title' => 'Student Networks', 'description' => 'Meet other students across campuses and form interdisciplinary teams.'],
                    ['icon' => 'workspaces', 'title' => 'Builder Mindset', 'description' => 'Go from idea and validation to the first prototype and pitch.'],
                    ['icon' => 'rocket_launch', 'title' => 'Launch Support', 'description' => 'Progress into RTIH programs that support venture growth.'],
                ],
                'learningOutcomes' => ['Entrepreneurial mindset', 'Problem discovery', 'Pitch presentation', 'Prototype thinking', 'Startup basics'],
                'applicationSteps' => [
                    ['number' => '01', 'title' => 'Online application', 'description' => 'Tell us about the team, the problem, and the idea you want to build.'],
                    ['number' => '02', 'title' => 'Initial screening', 'description' => 'RTIH reviews fit, clarity, and feasibility.'],
                    ['number' => '03', 'title' => 'Pitch day', 'description' => 'Present the idea to mentors and advisors for cohort selection.'],
                    ['number' => '04', 'title' => 'Progression', 'description' => 'Selected teams continue into the right RTIH startup pathway.'],
                ],
                'faqs' => [
                    ['question' => 'Do I need a prototype?', 'answer' => 'No. The program is designed to help you build one.'],
                    ['question' => 'Is this only for engineering students?', 'answer' => 'No. Students from any discipline can apply.'],
                    ['question' => 'Does RTIH take equity?', 'answer' => 'No. The student pathway is designed to build founders first.'],
                ],
                'contacts' => ['email' => 'connect@rtih.co.in', 'phone' => '+91 73968 52244', 'address' => 'Partner campuses across Andhra Pradesh'],
                'partners' => ['25+ universities', 'Innovation cells', 'Faculty mentors'],
                'programHighlights' => ['Campus-focused learning', 'Prototype creation', 'Direct pathway into RTIH'],
            ],
        ],
        'climatetech' => [
            'track_group' => 'sector-cohort',
            'title' => 'ClimateTech Cohort',
            'tagline' => 'Climate Risk -> Deployable Solutions',
            'route_path' => '/climatetech',
            'content' => [
                'description' => 'A sector-focused cohort for startups building climate resilience, clean energy, and sustainability solutions.',
                'fullDescription' => 'The ClimateTech Cohort supports founders working on climate adaptation, renewable energy, water and waste management, and sustainability tech. Teams get sector mentorship, pilot access with public and industry partners, and support to move from concept to deployable climate solutions.',
                'duration' => '4-6 Months',
                'format' => 'Sector-Specific Incubation',
                'location' => 'RTIH Amaravati Hub & Regional Spokes',
                'imageSrc' => '/incubation/6A7EE4DF-4157-43FA-A851-78B6789B52DD.jpeg',
                'imageAlt' => 'ClimateTech cohort founders reviewing a sustainability solution',
                'colors' => ['primary' => '#5b2a86', 'secondary' => '#F6A623', 'lightBg' => '#f6f1fc', 'dark' => '#2f1657'],
                'targetAudience' => ['Climate-tech founders', 'Clean energy teams', 'Sustainability startups'],
                'features' => [
                    ['icon' => 'eco', 'title' => 'Climate Use Cases', 'description' => 'Work on real climate resilience, clean energy, and sustainability problems.'],
                    ['icon' => 'science', 'title' => 'Pilot Validation', 'description' => 'Refine the solution with mentor feedback and real deployment context.'],
                    ['icon' => 'solar_power', 'title' => 'Industry Access', 'description' => 'Connect with public agencies and industry partners working on climate action.'],
                    ['icon' => 'hub', 'title' => 'Ecosystem Linkages', 'description' => 'Get introduced to climate funds, research labs, and sector specialists.'],
                ],
                'learningOutcomes' => ['Climate risk framing', 'Pilot design', 'Impact measurement', 'Business model design', 'Regulatory awareness'],
                'applicationSteps' => [
                    ['number' => '01', 'title' => 'Apply', 'description' => 'Share the climate problem you are solving and your current stage.'],
                    ['number' => '02', 'title' => 'Review', 'description' => 'RTIH checks feasibility, impact potential, and sector fit.'],
                    ['number' => '03', 'title' => 'Cohort', 'description' => 'Join the cohort and work through sector-specific mentorship.'],
                    ['number' => '04', 'title' => 'Pilot', 'description' => 'Move toward pilots with public and industry ecosystem partners.'],
                ],
                'faqs' => [
                    ['question' => 'Do I need a working product?', 'answer' => 'No. Early-stage concepts with a clear climate use case are welcome.'],
                    ['question' => 'What sectors are covered?', 'answer' => 'Clean energy, water, waste, agri-climate, and sustainability tech.'],
                    ['question' => 'Is pilot access guaranteed?', 'answer' => 'No, but the cohort is built to actively support pilot conversations.'],
                ],
                'contacts' => ['email' => 'connect@rtih.co.in', 'phone' => '+91 73966 03335', 'address' => 'Mayuri Tech Park, Mangalagiri, Andhra Pradesh'],
                'partners' => ['Government of Andhra Pradesh', 'Climate action partners', 'RTIH mentors'],
                'programHighlights' => ['Sector mentorship', 'Pilot access', 'Climate ecosystem linkages'],
            ],
        ],
        'mobility' => [
            'track_group' => 'sector-cohort',
            'title' => 'Mobility Cohort',
            'tagline' => 'Transport Innovation -> Market Fit',
            'route_path' => '/mobility',
            'content' => [
                'description' => 'A dedicated track for startups building smarter, safer, and more sustainable mobility solutions.',
                'fullDescription' => 'The Mobility Cohort supports founders working on transportation, logistics, fleet technology, and sustainable mobility. The track combines sector mentorship, industry pilots, and go-to-market support to help teams move mobility solutions toward real-world adoption.',
                'duration' => '4-6 Months',
                'format' => 'Sector-Specific Incubation',
                'location' => 'RTIH Amaravati Hub & Regional Spokes',
                'imageSrc' => '/incubation/6A7EE4DF-4157-43FA-A851-78B6789B52DD.jpeg',
                'imageAlt' => 'Mobility cohort founders presenting a transportation solution',
                'colors' => ['primary' => '#6f3298', 'secondary' => '#F6A623', 'lightBg' => '#f7f2ff', 'dark' => '#331a5c'],
                'targetAudience' => ['Mobility startups', 'Logistics teams', 'Automotive-tech founders'],
                'features' => [
                    ['icon' => 'directions_car', 'title' => 'Mobility Use Cases', 'description' => 'Work on transportation, logistics, and fleet technology problems.'],
                    ['icon' => 'science', 'title' => 'Prototype Validation', 'description' => 'Refine the solution with mentor feedback and field testing context.'],
                    ['icon' => 'route', 'title' => 'Industry Pilots', 'description' => 'Get access to pilot conversations with mobility and logistics partners.'],
                    ['icon' => 'hub', 'title' => 'Ecosystem Linkages', 'description' => 'Connect with fleet operators, manufacturers, and sector investors.'],
                ],
                'learningOutcomes' => ['Problem discovery', 'Pilot design', 'Go-to-market planning', 'Business model design', 'Regulatory awareness'],
                'applicationSteps' => [
                    ['number' => '01', 'title' => 'Apply', 'description' => 'Share the mobility problem and the stage of your solution.'],
                    ['number' => '02', 'title' => 'Review', 'description' => 'RTIH checks feasibility, innovation, and sector fit.'],
                    ['number' => '03', 'title' => 'Cohort', 'description' => 'Join the cohort and work through sector mentorship sessions.'],
                    ['number' => '04', 'title' => 'Pilot', 'description' => 'Move toward pilots with mobility and logistics ecosystem partners.'],
                ],
                'faqs' => [
                    ['question' => 'Do I need a working prototype?', 'answer' => 'No. Early-stage mobility concepts are welcome if the problem fit is clear.'],
                    ['question' => 'What sub-sectors are covered?', 'answer' => 'EV infra-adjacent mobility, logistics, fleet tech, and road safety tech.'],
                    ['question' => 'Can hardware startups apply?', 'answer' => 'Yes. Hardware, software, and hybrid mobility solutions can all apply.'],
                ],
                'contacts' => ['email' => 'connect@rtih.co.in', 'phone' => '+91 73966 03335', 'address' => 'Mayuri Tech Park, Mangalagiri, Andhra Pradesh'],
                'partners' => ['Automotive partners', 'Logistics operators', 'RTIH mentors'],
                'programHighlights' => ['Sector mentorship', 'Industry pilots', 'Mobility ecosystem access'],
            ],
        ],
        'foodtech' => [
            'track_group' => 'sector-cohort',
            'title' => 'FoodTech Cohort',
            'tagline' => 'Farm & Food Innovation -> Scale',
            'route_path' => '/foodtech',
            'content' => [
                'description' => 'A sector cohort for startups building food processing, agri-tech, and food safety innovations.',
                'fullDescription' => 'The FoodTech Cohort supports founders working across food processing, agri-supply chains, food safety, and nutrition tech. Teams get sector-specific mentorship, access to processing and farm-partner networks, and support to move solutions from concept to market.',
                'duration' => '4-6 Months',
                'format' => 'Sector-Specific Incubation',
                'location' => 'RTIH Amaravati Hub & Regional Spokes',
                'imageSrc' => '/incubation/6A7EE4DF-4157-43FA-A851-78B6789B52DD.jpeg',
                'imageAlt' => 'FoodTech cohort founders reviewing a food processing innovation',
                'colors' => ['primary' => '#4b1e83', 'secondary' => '#F6A623', 'lightBg' => '#f6f1fc', 'dark' => '#26103f'],
                'targetAudience' => ['Agri-tech founders', 'Food processing teams', 'Food safety innovators'],
                'features' => [
                    ['icon' => 'agriculture', 'title' => 'Farm & Food Use Cases', 'description' => 'Work on real problems across food processing and agri-supply chains.'],
                    ['icon' => 'science', 'title' => 'Product Validation', 'description' => 'Refine the solution with mentor feedback and field-level testing.'],
                    ['icon' => 'storefront', 'title' => 'Market Access', 'description' => 'Get introduced to processing partners, retailers, and distribution networks.'],
                    ['icon' => 'hub', 'title' => 'Ecosystem Linkages', 'description' => 'Connect with farmer groups, FPOs, and food safety specialists.'],
                ],
                'learningOutcomes' => ['Problem discovery', 'Product design', 'Supply chain planning', 'Business model design', 'Quality & safety awareness'],
                'applicationSteps' => [
                    ['number' => '01', 'title' => 'Apply', 'description' => 'Share the food or agri problem you are solving and your current stage.'],
                    ['number' => '02', 'title' => 'Review', 'description' => 'RTIH checks feasibility, impact, and sector fit.'],
                    ['number' => '03', 'title' => 'Cohort', 'description' => 'Join the cohort and work through sector-specific mentorship.'],
                    ['number' => '04', 'title' => 'Market Access', 'description' => 'Move toward pilots with processing and distribution partners.'],
                ],
                'faqs' => [
                    ['question' => 'Do I need a finished product?', 'answer' => 'No. Early-stage food and agri-tech concepts are welcome.'],
                    ['question' => 'Can farmer-led teams apply?', 'answer' => 'Yes. FPOs and farmer-led ventures are encouraged to apply.'],
                    ['question' => 'Is lab or processing access provided?', 'answer' => 'RTIH helps connect teams to partner facilities where relevant.'],
                ],
                'contacts' => ['email' => 'connect@rtih.co.in', 'phone' => '+91 73966 03335', 'address' => 'Mayuri Tech Park, Mangalagiri, Andhra Pradesh'],
                'partners' => ['Farmer producer organizations', 'Food processing partners', 'RTIH mentors'],
                'programHighlights' => ['Sector mentorship', 'Market access', 'Farm & food ecosystem linkages'],
            ],
        ],
        'evtech' => [
            'track_group' => 'sector-cohort',
            'title' => 'EVTech Cohort',
            'tagline' => 'Electric Mobility -> Industry Readiness',
            'route_path' => '/evtech',
            'content' => [
                'description' => 'A dedicated track for startups building electric vehicle, battery, and charging infrastructure innovations.',
                'fullDescription' => 'The EVTech Cohort supports founders building electric vehicles, battery technology, charging infrastructure, and EV supply-chain solutions. The track combines sector mentorship, testing support, and industry linkages to help teams move toward manufacturing and market readiness.',
                'duration' => '4-6 Months',
                'format' => 'Sector-Specific Incubation',
                'location' => 'RTIH Amaravati Hub & Regional Spokes',
                'imageSrc' => '/incubation/6A7EE4DF-4157-43FA-A851-78B6789B52DD.jpeg',
                'imageAlt' => 'EVTech cohort founders working on an electric vehicle prototype',
                'colors' => ['primary' => '#9333ea', 'secondary' => '#F6A623', 'lightBg' => '#faf5ff', 'dark' => '#4c1d75'],
                'targetAudience' => ['EV startups', 'Battery-tech teams', 'Charging infrastructure founders'],
                'features' => [
                    ['icon' => 'electric_bolt', 'title' => 'EV Use Cases', 'description' => 'Work on electric vehicle, battery, and charging infrastructure problems.'],
                    ['icon' => 'science', 'title' => 'Prototype Testing', 'description' => 'Refine the solution with mentor feedback and technical validation support.'],
                    ['icon' => 'ev_station', 'title' => 'Industry Linkages', 'description' => 'Connect with EV manufacturers, fleet operators, and charging network partners.'],
                    ['icon' => 'hub', 'title' => 'Supply Chain Access', 'description' => 'Get introduced to component suppliers and manufacturing partners.'],
                ],
                'learningOutcomes' => ['Problem discovery', 'Prototype testing', 'Supply chain planning', 'Business model design', 'Standards & safety awareness'],
                'applicationSteps' => [
                    ['number' => '01', 'title' => 'Apply', 'description' => 'Share the EV problem you are solving and the stage of your prototype.'],
                    ['number' => '02', 'title' => 'Review', 'description' => 'RTIH checks feasibility, innovation, and sector fit.'],
                    ['number' => '03', 'title' => 'Cohort', 'description' => 'Join the cohort and work through sector-specific mentorship.'],
                    ['number' => '04', 'title' => 'Industry Readiness', 'description' => 'Move toward manufacturing, testing, and market partnerships.'],
                ],
                'faqs' => [
                    ['question' => 'Do I need a running prototype?', 'answer' => 'No. Early-stage EV concepts with a clear technical direction are welcome.'],
                    ['question' => 'What sub-sectors are covered?', 'answer' => 'EVs, battery tech, charging infrastructure, and EV supply-chain solutions.'],
                    ['question' => 'Is manufacturing support provided?', 'answer' => 'RTIH helps connect teams to manufacturing and testing partners.'],
                ],
                'contacts' => ['email' => 'connect@rtih.co.in', 'phone' => '+91 73966 03335', 'address' => 'Mayuri Tech Park, Mangalagiri, Andhra Pradesh'],
                'partners' => ['EV manufacturers', 'Charging infrastructure partners', 'RTIH mentors'],
                'programHighlights' => ['Sector mentorship', 'Industry linkages', 'Manufacturing pathway'],
            ],
        ],
    ];
}

$seed = incubationSeedPrograms();
$order = 10;
$upserted = [];

foreach ($seed as $key => $program) {
    $data = [
        'track_group' => $program['track_group'],
        'title' => $program['title'],
        'tagline' => $program['tagline'],
        'route_path' => $program['route_path'],
        'display_order' => $order,
        'active' => true,
        'content' => $program['content'],
    ];

    incubationSaveProgram($db, $key, $data);
    $upserted[] = $key;
    $order += 10;
}

header('Content-Type: text/plain; charset=utf-8');
echo "Incubation programs seed complete.\n";
echo count($upserted) . " program(s) upserted (inserted if new, updated if already present):\n";
foreach ($upserted as $key) {
    echo " - {$key}\n";
}
echo "\nThis script is safe to re-run, but re-running it will OVERWRITE any manual\n";
echo "edits made to these same program keys via the Programs admin UI. Run it\n";
echo "only once, right after deployment, before anyone edits programs by hand.\n";
