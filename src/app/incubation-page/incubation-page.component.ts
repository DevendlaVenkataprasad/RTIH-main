import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MaterialModule } from '../shared/material.module';
import { FooterRtihComponent } from '../footer-rtih/footer-rtih.component';
import { HeaderRtihComponent } from '../header-rtih/header-rtih.component';
import { StartupToolkit, ToolkitCategory } from '../startup-toolkit/startup-toolkit';
import { IncubationContentService } from './incubation-content.service';

/* =============================================================================
 * Shared page mode contract (driven by route `data`)
 * ========================================================================== */

export type IncubationPageMode = 'main' | 'program' | 'toolkit';

/* =============================================================================
 * Program data (formerly program-data.ts) — merged into this single file.
 * ========================================================================== */

export type ProgramId =
  | 'spark'
  | 'future-founders'
  | 'catalyst'
  | 'velocity-lab'
  | 'medtech'
  | 'avgc-xr'
  | 'innotribe'
  | 'student-entrepreneurship'
  | 'climatetech'
  | 'mobility'
  | 'foodtech'
  | 'evtech';

export type ProgramFeature = {
  icon: string;
  title: string;
  description: string;
};

export type ProgramStep = {
  number: string;
  title: string;
  description: string;
};

export type ProgramFaq = {
  question: string;
  answer: string;
  open?: boolean;
};

export type ProgramContact = {
  email: string;
  phone: string;
  address: string;
};

export type ProgramData = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  fullDescription: string;
  duration: string;
  format: string;
  location: string;
  imageSrc: string;
  imageAlt: string;
  /** Program-specific "Apply Now" link, set via the admin portal.
   *  When unset, the template shows `applyStatusText` (or a default
   *  "not open yet" message) instead of an Apply Now button. */
  applyUrl?: string;
  /** Admin-portal toggle for whether this program is currently taking
   *  applications. Defaults to `true` so programs created before this
   *  field existed keep showing Apply Now once an applyUrl is set. */
  acceptingApplications?: boolean;
  /** Admin-portal override for the message shown when Apply Now isn't
   *  available (no applyUrl, or acceptingApplications is false). */
  applyStatusText?: string;
  colors: {
    primary: string;
    secondary: string;
    lightBg: string;
    dark: string;
  };
  targetAudience: string[];
  features: ProgramFeature[];
  learningOutcomes: string[];
  applicationSteps: ProgramStep[];
  faqs: ProgramFaq[];
  contacts: ProgramContact;
  partners: string[];
  programHighlights: string[];
};

export const PROGRAMS: Record<ProgramId, ProgramData> = {
  spark: {
    id: 'spark',
    name: 'SPARK',
    tagline: 'Explore → Idea',
    description: 'A founder-first bootcamp that helps early-stage teams test ideas, sharpen problem statements, and plan the first build.',
    fullDescription:
      'SPARK is the front door to the RTIH incubation journey. The track helps aspiring founders move from rough ideas to a validated startup direction through workshops, customer discovery, mentor feedback, and practical next-step planning.',
    duration: '1-2 Days',
    format: 'Bootcamp',
    location: 'RTIH, Amaravati',
    imageSrc: '/incubation/spark.jpg',
    imageAlt: 'SPARK bootcamp participants collaborating',
    colors: {
      primary: '#7c3aed',
      secondary: '#F6A623',
      lightBg: '#f7f2ff',
      dark: '#2f1657',
    },
    targetAudience: ['Students', 'Aspiring founders', 'Idea-stage teams'],
    features: [
      { icon: 'lightbulb', title: 'Idea Validation', description: 'Frame the problem clearly and test whether the idea solves a real market need.' },
      { icon: 'groups', title: 'Peer Learning', description: 'Build alongside other founders and compare notes with mentors and facilitators.' },
      { icon: 'search', title: 'Customer Discovery', description: 'Learn how to interview users, test assumptions, and spot early signals.' },
      { icon: 'rocket_launch', title: 'Launch Path', description: 'Walk away with a practical plan for the next RTIH program or pilot step.' },
    ],
    learningOutcomes: ['Problem framing', 'Customer discovery', 'Pitch practice', 'MVP planning', 'Startup mindset'],
    applicationSteps: [
      { number: '01', title: 'Apply', description: 'Share the idea, the team, and the market problem you want to solve.' },
      { number: '02', title: 'Review', description: 'RTIH checks the clarity, relevance, and potential of the application.' },
      { number: '03', title: 'Bootcamp', description: 'Join the bootcamp and work through the idea validation exercises.' },
      { number: '04', title: 'Next Step', description: 'Move forward with a sharper concept and a stronger route into incubation.' },
    ],
    faqs: [
      { question: 'Do I need a startup already?', answer: 'No. SPARK is designed for idea-stage founders and first-time teams.' },
      { question: 'Can I apply solo?', answer: 'Yes. Individual founders are welcome and can also form teams during the bootcamp.' },
      { question: 'What happens after SPARK?', answer: 'Strong teams can move into Future Founders or other incubation tracks.' },
    ],
    contacts: {
      email: 'connect@rtih.co.in',
      phone: '+91 73968 52244',
      address: 'Mayuri Tech Park, Mangalagiri, Andhra Pradesh 522503',
    },
    partners: [],
    programHighlights: ['Problem framing', 'Customer discovery', 'Pitch practice'],
  },
  'future-founders': {
    id: 'future-founders',
    name: 'Future Founders',
    tagline: 'Ideation → Prototype',
    description: 'Structured pre-incubation for founders who are ready to build, test, and validate a first prototype.',
    fullDescription:
      'Future Founders bridges ideation and formal incubation. The program combines mentor-led sessions, customer validation, prototype support, and startup fundamentals so teams can move from concept to something tangible.',
    duration: '6 Weeks',
    format: 'Structured Pre-Incubation',
    location: 'RTIH Amaravati Hub & Regional Spokes',
    imageSrc: '/incubation/ff.jpg',
    imageAlt: 'Future Founders workshop',
    colors: {
      primary: '#6f3298',
      secondary: '#F6A623',
      lightBg: '#f7f2ff',
      dark: '#331a5c',
    },
    targetAudience: ['Student founders', 'Research teams', 'Early-stage startups'],
    features: [
      { icon: 'design_services', title: 'Structured Journey', description: 'Move through a milestone-based path from concept to prototype readiness.' },
      { icon: 'science', title: 'Prototype Support', description: 'Access feedback that improves product design, validation, and technical direction.' },
      { icon: 'handshake', title: 'Mentor Access', description: 'Work with founders, operators, and domain experts across the RTIH network.' },
      { icon: 'route', title: 'Incubation Pathway', description: 'High-potential teams can progress into Catalyst and funding support.' },
    ],
    learningOutcomes: ['MVP planning', 'Business model design', 'Customer discovery', 'Pitch deck creation', 'Fundraising basics'],
    applicationSteps: [
      { number: '01', title: 'Submit', description: 'Apply with a concise problem statement and team summary.' },
      { number: '02', title: 'Screen', description: 'RTIH reviews feasibility, innovation, and readiness for the cohort.' },
      { number: '03', title: 'Build', description: 'Work through the six-week program with mentor checkpoints.' },
      { number: '04', title: 'Showcase', description: 'Present progress and get routed into the right next opportunity.' },
    ],
    faqs: [
      { question: 'Is a prototype required?', answer: 'No. The program helps you build one if you do not have it yet.' },
      { question: 'Who can apply?', answer: 'Students, founders, and research-led teams are all welcome.' },
      { question: 'What comes next?', answer: 'Teams can move into Catalyst or other RTIH support tracks.' },
    ],
    contacts: {
      email: 'connect@rtih.co.in',
      phone: '+91 73966 03335',
      address: 'Mayuri Tech Park, Mangalagiri, Andhra Pradesh',
    },
    partners: ['Academic institutions', 'RTIH mentors', 'Innovation partners'],
    programHighlights: ['Prototype support', 'Mentor-led sprints', 'Pathway to incubation'],
  },
  catalyst: {
    id: 'catalyst',
    name: 'Catalyst Cohort',
    tagline: 'Prototype → Commercialization',
    description: 'Growth-focused incubation for startups ready to move beyond product development and into market execution.',
    fullDescription:
      'Catalyst is a four-to-six month incubation journey for startups that already have a prototype or MVP. Teams get support across commercialization, investor readiness, customer acquisition, and operational clarity.',
    duration: '4-6 Months',
    format: 'Hybrid Incubation',
    location: 'RTIH Amaravati Hub & Regional Spokes',
    imageSrc: '/incubation/catalyst.jpg',
    imageAlt: 'Catalyst incubation cohort',
    colors: {
      primary: '#5b2a86',
      secondary: '#F6A623',
      lightBg: '#f6f1fc',
      dark: '#301458',
    },
    targetAudience: ['Early-stage startups', 'Product teams', 'Deep-tech founders'],
    features: [
      { icon: 'trending_up', title: 'Commercialization', description: 'Turn product work into customer momentum and early revenue.' },
      { icon: 'account_balance_wallet', title: 'Funding Support', description: 'Prepare for grant, seed, and early-stage funding conversations.' },
      { icon: 'support_agent', title: 'Dedicated Mentorship', description: 'Get help from operators, investors, and sector specialists.' },
      { icon: 'co_present', title: 'Demo Day', description: 'Showcase progress to partners and ecosystem stakeholders.' },
    ],
    learningOutcomes: ['Product-market fit', 'Revenue model design', 'Go-to-market planning', 'Investor readiness', 'Unit economics'],
    applicationSteps: [
      { number: '01', title: 'Apply', description: 'Share the product stage, traction, and team profile.' },
      { number: '02', title: 'Interview', description: 'Present your startup to the selection panel.' },
      { number: '03', title: 'Onboard', description: 'Enter the cohort and start the growth sprint.' },
      { number: '04', title: 'Scale', description: 'Work through pilots, partners, and capital-readiness milestones.' },
    ],
    faqs: [
      { question: 'Who should apply?', answer: 'Startups with a working prototype, MVP, or proof of concept.' },
      { question: 'Is funding guaranteed?', answer: 'No. The track improves readiness for the right funding conversations.' },
      { question: 'Can the program run hybrid?', answer: 'Yes. Catalyst is designed for a hybrid learning and mentorship model.' },
    ],
    contacts: {
      email: 'connect@rtih.co.in',
      phone: '+91 73966 03335',
      address: 'Mayuri Tech Park, Mangalagiri, Andhra Pradesh',
    },
    partners: ['Investors', 'Corporate partners', 'RTIH mentors'],
    programHighlights: ['Commercialization focus', 'Investor readiness', 'Demo day visibility'],
  },
  'velocity-lab': {
    id: 'velocity-lab',
    name: 'Velocity Lab',
    tagline: 'Commercialization → Establishment',
    description: 'Acceleration support for startups that already have traction and want to grow faster.',
    fullDescription:
      'Velocity Lab is the scale-up track for proven startups. The program focuses on market expansion, operational discipline, and strategic growth decisions that help a team move from early traction to durable business performance.',
    duration: '3-4 Months',
    format: 'Acceleration Program',
    location: 'RTIH Amaravati Hub & Regional Spokes',
    imageSrc: '/incubation/vel.jpg',
    imageAlt: 'Velocity Lab startup scale-up session',
    colors: {
      primary: '#4b1e83',
      secondary: '#F6A623',
      lightBg: '#f6f1fc',
      dark: '#26103f',
    },
    targetAudience: ['Growth-stage startups', 'Revenue teams', 'Scaling founders'],
    features: [
      { icon: 'speed', title: 'Acceleration', description: 'Tighten execution around the fastest path to growth.' },
      { icon: 'public', title: 'Market Expansion', description: 'Support new customer segments, channels, and regions.' },
      { icon: 'handshake', title: 'Strategic Partners', description: 'Get closer to enterprise customers and partner ecosystems.' },
      { icon: 'analytics', title: 'Scale Planning', description: 'Review operations, metrics, and investor conversations with clarity.' },
    ],
    learningOutcomes: ['Growth strategy', 'Revenue optimization', 'Team scaling', 'Partnership development', 'Operational excellence'],
    applicationSteps: [
      { number: '01', title: 'Submit', description: 'Share traction, revenue data, and growth ambitions.' },
      { number: '02', title: 'Evaluate', description: 'RTIH reviews the startup stage and scale-up readiness.' },
      { number: '03', title: 'Accelerate', description: 'Join the cohort and work through growth milestones.' },
      { number: '04', title: 'Expand', description: 'Move into market, partner, and capital opportunities.' },
    ],
    faqs: [
      { question: 'Who is Velocity Lab for?', answer: 'Startups with market validation and a clear need to scale faster.' },
      { question: 'Does this help with investor access?', answer: 'Yes. The track prepares teams for fundraising and strategic introductions.' },
      { question: 'Is it only for RTIH startups?', answer: 'No. Strong external startups can also be considered.' },
    ],
    contacts: {
      email: 'connect@rtih.co.in',
      phone: '+91 73966 03335',
      address: 'Mayuri Tech Park, Mangalagiri, Andhra Pradesh',
    },
    partners: ['Investors', 'Enterprise partners', 'Growth mentors'],
    programHighlights: ['Scale-up support', 'Market expansion', 'Investor access'],
  },
  medtech: {
    id: 'medtech',
    name: 'MedTech Challenge',
    tagline: 'Healthcare Innovation → Deployment',
    description: 'A challenge-led track for teams building portable, affordable, and deployable healthcare technology.',
    fullDescription:
      'The MedTech Challenge supports founders who are solving real healthcare problems. The track emphasizes deployment readiness, clinical feedback, and practical product design for clinics, hospitals, and field settings.',
    duration: '6-8 Weeks',
    format: 'Challenge Track',
    location: 'RTIH Amaravati Hub & Healthcare Partner Networks',
    imageSrc: '/incubation/medtech.jpg',
    imageAlt: 'MedTech challenge participants collaborating on a healthcare solution',
    colors: {
      primary: '#059669',
      secondary: '#14b8a6',
      lightBg: '#ecfdf5',
      dark: '#064e3b',
    },
    targetAudience: ['Biomedical teams', 'Healthcare founders', 'Clinicians with product ideas'],
    features: [
      { icon: 'medical_services', title: 'Healthcare Use Cases', description: 'Work on practical problems and use cases in real medical settings.' },
      { icon: 'science', title: 'Prototype Validation', description: 'Refine the solution with mentor feedback and field context.' },
      { icon: 'monitor_heart', title: 'Pilot Readiness', description: 'Prepare for testing, regulatory awareness, and early deployment.' },
      { icon: 'hub', title: 'Ecosystem Linkages', description: 'Connect with hospitals, labs, and support partners.' },
    ],
    learningOutcomes: ['Problem discovery', 'Product design', 'Pilot planning', 'Business model design', 'Deployment awareness'],
    applicationSteps: [
      { number: '01', title: 'Concept Note', description: 'Share the healthcare problem and your proposed solution.' },
      { number: '02', title: 'Screening', description: 'RTIH checks feasibility, impact, and deployment promise.' },
      { number: '03', title: 'Sprint', description: 'Iterate the prototype with challenge mentors and partners.' },
      { number: '04', title: 'Showcase', description: 'Present the solution to ecosystem stakeholders.' },
    ],
    faqs: [
      { question: 'Do I need a finished device?', answer: 'No. Early-stage concepts and prototypes are welcome.' },
      { question: 'Can non-medical founders apply?', answer: 'Yes. Engineers, designers, and multidisciplinary teams can join.' },
      { question: 'Will there be pilot support?', answer: 'The program is designed to help with practical validation and pilot readiness.' },
    ],
    contacts: {
      email: 'medtech@rtih.co.in',
      phone: '+91 73968 52244',
      address: 'Mayuri Tech Park, Mangalagiri, Andhra Pradesh 522503',
    },
    partners: ['Hospitals', 'Clinics', 'Biomedical labs'],
    programHighlights: ['Portable healthcare', 'Pilot testing', 'Clinical mentorship'],
  },
  'avgc-xr': {
    id: 'avgc-xr',
    name: 'AVGC-XR Incubation',
    tagline: 'Creative Innovation → Industry Leadership',
    description: 'A dedicated track for animation, VFX, gaming, comics, and immersive technology ventures.',
    fullDescription:
      'The AVGC-XR track supports creators and startups building in animation, VFX, gaming, comics, AR, VR, and immersive digital experiences. It combines creative mentorship with product and market guidance.',
    duration: 'Up to 6 Months',
    format: 'Sector-Specific Incubation',
    location: 'RTIH Amaravati Hub (INNO-XR Lab)',
    imageSrc: '/incubation/ap-vaga-xr-summit-2025.jpeg',
    imageAlt: 'AVGC-XR summit stage and audience',
    colors: {
      primary: '#7c3aed',
      secondary: '#d946ef',
      lightBg: '#faf5ff',
      dark: '#6b21a8',
    },
    targetAudience: ['Animation studios', 'Game developers', 'XR innovators'],
    features: [
      { icon: 'brush', title: 'Creative Tech', description: 'Work across storytelling, design, and immersive experience development.' },
      { icon: 'vrpano', title: 'XR Lab Access', description: 'Build and test solutions in a space aligned to immersive tech work.' },
      { icon: 'group_work', title: 'Industry Mentorship', description: 'Learn from creative-tech practitioners and ecosystem leaders.' },
      { icon: 'storefront', title: 'Go-to-Market', description: 'Prepare for customer discovery, packaging, and revenue strategy.' },
    ],
    learningOutcomes: ['Creative product development', 'XR prototyping', 'Game design', 'VFX pipelines', 'Revenue strategy'],
    applicationSteps: [
      { number: '01', title: 'Submit', description: 'Share the creative concept or venture profile.' },
      { number: '02', title: 'Screen', description: 'RTIH reviews sector fit and innovation potential.' },
      { number: '03', title: 'Onboard', description: 'Receive mentorship, lab guidance, and cohort support.' },
      { number: '04', title: 'Demo', description: 'Showcase progress to creative and industry partners.' },
    ],
    faqs: [
      { question: 'Is this only for studios?', answer: 'No. Solo creators, teams, and startups can all apply.' },
      { question: 'Do I need a prototype?', answer: 'No. Early-stage concepts are welcome if they fit the sector.' },
      { question: 'Can students apply?', answer: 'Yes. Students with creative-tech ideas are encouraged.' },
    ],
    contacts: {
      email: 'connect@rtih.co.in',
      phone: '+91 73966 03335',
      address: 'Mayuri Tech Park, Mangalagiri, Andhra Pradesh',
    },
    partners: ['APVAGA', 'Creative studios', 'Technology vendors'],
    programHighlights: ['AVGC-XR specialization', 'XR lab access', 'Industry mentors'],
  },
  innotribe: {
    id: 'innotribe',
    name: 'InnoTribe',
    tagline: 'Learning → Venture Building',
    description: 'A student innovation pathway that helps colleges and universities turn campus curiosity into venture-ready teams.',
    fullDescription:
      'InnoTribe builds entrepreneurial confidence among students through idea generation, problem solving, startup basics, and practical venture-building experiences. It creates a path from campus exploration to incubation-ready teams.',
    duration: 'Ongoing student pathway',
    format: 'Campus / Hybrid / Cohort-based',
    location: 'Partner institutions across Andhra Pradesh',
    imageSrc: '/incubation/innotribe.jpg',
    imageAlt: 'InnoTribe student innovation cohort',
    colors: {
      primary: '#4338ca',
      secondary: '#6366f1',
      lightBg: '#eef2ff',
      dark: '#312e81',
    },
    targetAudience: ['University students', 'College clubs', 'Student innovators'],
    features: [
      { icon: 'school', title: 'Campus Focus', description: 'Programs are built around colleges, student groups, and faculty support.' },
      { icon: 'groups', title: 'Peer Networks', description: 'Students can build teams with people from different disciplines.' },
      { icon: 'auto_awesome', title: 'Idea Formation', description: 'Move from curiosity to a problem statement and venture direction.' },
      { icon: 'emoji_events', title: 'Progression', description: 'Outstanding teams can move toward incubation and showcase opportunities.' },
    ],
    learningOutcomes: ['Entrepreneurial mindset', 'Problem discovery', 'Idea generation', 'Prototype thinking', 'Team collaboration'],
    applicationSteps: [
      { number: '01', title: 'Campus outreach', description: 'RTIH works with institutions and student groups to start the program.' },
      { number: '02', title: 'Registration', description: 'Students join the relevant cohort or workshop series.' },
      { number: '03', title: 'Idea sessions', description: 'Teams explore problems, ideas, and possible solutions.' },
      { number: '04', title: 'Showcase', description: 'Teams present ideas and move into the next RTIH track.' },
    ],
    faqs: [
      { question: 'Who can join?', answer: 'Students from colleges and universities across Andhra Pradesh.' },
      { question: 'Do I need a startup idea?', answer: 'No. InnoTribe is designed to help you find and shape one.' },
      { question: 'What happens after?', answer: 'Students can continue into RTIH founder programs and incubation.' },
    ],
    contacts: {
      email: 'connect@rtih.co.in',
      phone: '+91 73968 52244',
      address: 'Partner campuses across Andhra Pradesh',
    },
    partners: ['Universities', 'Innovation cells', 'Faculty mentors'],
    programHighlights: ['Campus learning', 'Prototype creation', 'Mentor-led workshops'],
  },
  'student-entrepreneurship': {
    id: 'student-entrepreneurship',
    name: 'Student Entrepreneurship',
    tagline: 'Learning → Building → Launching',
    description: 'A dedicated pathway for student founders to turn ideas into sustainable businesses with institutional support.',
    fullDescription:
      'RTIH student entrepreneurship programs empower the next generation of founders across Andhra Pradesh. The pathway blends mentorship, campus outreach, and access to the wider incubation ecosystem so students can move from idea to venture-ready execution.',
    duration: 'Varied by cohort',
    format: 'Campus / Hybrid / Cohort-based',
    location: 'Partner campuses across Andhra Pradesh',
    imageSrc: '/incubation/VIP.jpg',
    imageAlt: 'Student Entrepreneurship Program cohort',
    colors: {
      primary: '#059669',
      secondary: '#10b981',
      lightBg: '#ecfdf5',
      dark: '#064e3b',
    },
    targetAudience: ['University students', 'College clubs', 'Student innovators'],
    features: [
      { icon: 'menu_book', title: 'Curriculum Integration', description: 'Blend startup milestones with academic progress and practical work.' },
      { icon: 'groups', title: 'Student Networks', description: 'Meet other students across campuses and form interdisciplinary teams.' },
      { icon: 'workspaces', title: 'Builder Mindset', description: 'Go from idea and validation to the first prototype and pitch.' },
      { icon: 'rocket_launch', title: 'Launch Support', description: 'Progress into RTIH programs that support venture growth.' },
    ],
    learningOutcomes: ['Entrepreneurial mindset', 'Problem discovery', 'Pitch presentation', 'Prototype thinking', 'Startup basics'],
    applicationSteps: [
      { number: '01', title: 'Online application', description: 'Tell us about the team, the problem, and the idea you want to build.' },
      { number: '02', title: 'Initial screening', description: 'RTIH reviews fit, clarity, and feasibility.' },
      { number: '03', title: 'Pitch day', description: 'Present the idea to mentors and advisors for cohort selection.' },
      { number: '04', title: 'Progression', description: 'Selected teams continue into the right RTIH startup pathway.' },
    ],
    faqs: [
      { question: 'Do I need a prototype?', answer: 'No. The program is designed to help you build one.' },
      { question: 'Is this only for engineering students?', answer: 'No. Students from any discipline can apply.' },
      { question: 'Does RTIH take equity?', answer: 'No. The student pathway is designed to build founders first.' },
    ],
    contacts: {
      email: 'connect@rtih.co.in',
      phone: '+91 73968 52244',
      address: 'Partner campuses across Andhra Pradesh',
    },
    partners: ['25+ universities', 'Innovation cells', 'Faculty mentors'],
    programHighlights: ['Campus-focused learning', 'Prototype creation', 'Direct pathway into RTIH'],
  },
  climatetech: {
    id: 'climatetech',
    name: 'ClimateTech Cohort',
    tagline: 'Climate Risk → Deployable Solutions',
    description: 'A sector-focused cohort for startups building climate resilience, clean energy, and sustainability solutions.',
    fullDescription:
      'The ClimateTech Cohort supports founders working on climate adaptation, renewable energy, water and waste management, and sustainability tech. Teams get sector mentorship, pilot access with public and industry partners, and support to move from concept to deployable climate solutions.',
    duration: '4-6 Months',
    format: 'Sector-Specific Incubation',
    location: 'RTIH Amaravati Hub & Regional Spokes',
    imageSrc: '/incubation/6A7EE4DF-4157-43FA-A851-78B6789B52DD.jpeg',
    imageAlt: 'ClimateTech cohort founders reviewing a sustainability solution',
    colors: {
      primary: '#5b2a86',
      secondary: '#F6A623',
      lightBg: '#f6f1fc',
      dark: '#2f1657',
    },
    targetAudience: ['Climate-tech founders', 'Clean energy teams', 'Sustainability startups'],
    features: [
      { icon: 'eco', title: 'Climate Use Cases', description: 'Work on real climate resilience, clean energy, and sustainability problems.' },
      { icon: 'science', title: 'Pilot Validation', description: 'Refine the solution with mentor feedback and real deployment context.' },
      { icon: 'solar_power', title: 'Industry Access', description: 'Connect with public agencies and industry partners working on climate action.' },
      { icon: 'hub', title: 'Ecosystem Linkages', description: 'Get introduced to climate funds, research labs, and sector specialists.' },
    ],
    learningOutcomes: ['Climate risk framing', 'Pilot design', 'Impact measurement', 'Business model design', 'Regulatory awareness'],
    applicationSteps: [
      { number: '01', title: 'Apply', description: 'Share the climate problem you are solving and your current stage.' },
      { number: '02', title: 'Review', description: 'RTIH checks feasibility, impact potential, and sector fit.' },
      { number: '03', title: 'Cohort', description: 'Join the cohort and work through sector-specific mentorship.' },
      { number: '04', title: 'Pilot', description: 'Move toward pilots with public and industry ecosystem partners.' },
    ],
    faqs: [
      { question: 'Do I need a working product?', answer: 'No. Early-stage concepts with a clear climate use case are welcome.' },
      { question: 'What sectors are covered?', answer: 'Clean energy, water, waste, agri-climate, and sustainability tech.' },
      { question: 'Is pilot access guaranteed?', answer: 'No, but the cohort is built to actively support pilot conversations.' },
    ],
    contacts: {
      email: 'connect@rtih.co.in',
      phone: '+91 73966 03335',
      address: 'Mayuri Tech Park, Mangalagiri, Andhra Pradesh',
    },
    partners: ['Government of Andhra Pradesh', 'Climate action partners', 'RTIH mentors'],
    programHighlights: ['Sector mentorship', 'Pilot access', 'Climate ecosystem linkages'],
  },
  mobility: {
    id: 'mobility',
    name: 'Mobility Cohort',
    tagline: 'Transport Innovation → Market Fit',
    description: 'A dedicated track for startups building smarter, safer, and more sustainable mobility solutions.',
    fullDescription:
      'The Mobility Cohort supports founders working on transportation, logistics, fleet technology, and sustainable mobility. The track combines sector mentorship, industry pilots, and go-to-market support to help teams move mobility solutions toward real-world adoption.',
    duration: '4-6 Months',
    format: 'Sector-Specific Incubation',
    location: 'RTIH Amaravati Hub & Regional Spokes',
    imageSrc: '/incubation/6A7EE4DF-4157-43FA-A851-78B6789B52DD.jpeg',
    imageAlt: 'Mobility cohort founders presenting a transportation solution',
    colors: {
      primary: '#6f3298',
      secondary: '#F6A623',
      lightBg: '#f7f2ff',
      dark: '#331a5c',
    },
    targetAudience: ['Mobility startups', 'Logistics teams', 'Automotive-tech founders'],
    features: [
      { icon: 'directions_car', title: 'Mobility Use Cases', description: 'Work on transportation, logistics, and fleet technology problems.' },
      { icon: 'science', title: 'Prototype Validation', description: 'Refine the solution with mentor feedback and field testing context.' },
      { icon: 'route', title: 'Industry Pilots', description: 'Get access to pilot conversations with mobility and logistics partners.' },
      { icon: 'hub', title: 'Ecosystem Linkages', description: 'Connect with fleet operators, manufacturers, and sector investors.' },
    ],
    learningOutcomes: ['Problem discovery', 'Pilot design', 'Go-to-market planning', 'Business model design', 'Regulatory awareness'],
    applicationSteps: [
      { number: '01', title: 'Apply', description: 'Share the mobility problem and the stage of your solution.' },
      { number: '02', title: 'Review', description: 'RTIH checks feasibility, innovation, and sector fit.' },
      { number: '03', title: 'Cohort', description: 'Join the cohort and work through sector mentorship sessions.' },
      { number: '04', title: 'Pilot', description: 'Move toward pilots with mobility and logistics ecosystem partners.' },
    ],
    faqs: [
      { question: 'Do I need a working prototype?', answer: 'No. Early-stage mobility concepts are welcome if the problem fit is clear.' },
      { question: 'What sub-sectors are covered?', answer: 'EV infra-adjacent mobility, logistics, fleet tech, and road safety tech.' },
      { question: 'Can hardware startups apply?', answer: 'Yes. Hardware, software, and hybrid mobility solutions can all apply.' },
    ],
    contacts: {
      email: 'connect@rtih.co.in',
      phone: '+91 73966 03335',
      address: 'Mayuri Tech Park, Mangalagiri, Andhra Pradesh',
    },
    partners: ['Automotive partners', 'Logistics operators', 'RTIH mentors'],
    programHighlights: ['Sector mentorship', 'Industry pilots', 'Mobility ecosystem access'],
  },
  foodtech: {
    id: 'foodtech',
    name: 'FoodTech Cohort',
    tagline: 'Farm & Food Innovation → Scale',
    description: 'A sector cohort for startups building food processing, agri-tech, and food safety innovations.',
    fullDescription:
      'The FoodTech Cohort supports founders working across food processing, agri-supply chains, food safety, and nutrition tech. Teams get sector-specific mentorship, access to processing and farm-partner networks, and support to move solutions from concept to market.',
    duration: '4-6 Months',
    format: 'Sector-Specific Incubation',
    location: 'RTIH Amaravati Hub & Regional Spokes',
    imageSrc: '/incubation/6A7EE4DF-4157-43FA-A851-78B6789B52DD.jpeg',
    imageAlt: 'FoodTech cohort founders reviewing a food processing innovation',
    colors: {
      primary: '#4b1e83',
      secondary: '#F6A623',
      lightBg: '#f6f1fc',
      dark: '#26103f',
    },
    targetAudience: ['Agri-tech founders', 'Food processing teams', 'Food safety innovators'],
    features: [
      { icon: 'agriculture', title: 'Farm & Food Use Cases', description: 'Work on real problems across food processing and agri-supply chains.' },
      { icon: 'science', title: 'Product Validation', description: 'Refine the solution with mentor feedback and field-level testing.' },
      { icon: 'storefront', title: 'Market Access', description: 'Get introduced to processing partners, retailers, and distribution networks.' },
      { icon: 'hub', title: 'Ecosystem Linkages', description: 'Connect with farmer groups, FPOs, and food safety specialists.' },
    ],
    learningOutcomes: ['Problem discovery', 'Product design', 'Supply chain planning', 'Business model design', 'Quality & safety awareness'],
    applicationSteps: [
      { number: '01', title: 'Apply', description: 'Share the food or agri problem you are solving and your current stage.' },
      { number: '02', title: 'Review', description: 'RTIH checks feasibility, impact, and sector fit.' },
      { number: '03', title: 'Cohort', description: 'Join the cohort and work through sector-specific mentorship.' },
      { number: '04', title: 'Market Access', description: 'Move toward pilots with processing and distribution partners.' },
    ],
    faqs: [
      { question: 'Do I need a finished product?', answer: 'No. Early-stage food and agri-tech concepts are welcome.' },
      { question: 'Can farmer-led teams apply?', answer: 'Yes. FPOs and farmer-led ventures are encouraged to apply.' },
      { question: 'Is lab or processing access provided?', answer: 'RTIH helps connect teams to partner facilities where relevant.' },
    ],
    contacts: {
      email: 'connect@rtih.co.in',
      phone: '+91 73966 03335',
      address: 'Mayuri Tech Park, Mangalagiri, Andhra Pradesh',
    },
    partners: ['Farmer producer organizations', 'Food processing partners', 'RTIH mentors'],
    programHighlights: ['Sector mentorship', 'Market access', 'Farm & food ecosystem linkages'],
  },
  evtech: {
    id: 'evtech',
    name: 'EVTech Cohort',
    tagline: 'Electric Mobility → Industry Readiness',
    description: 'A dedicated track for startups building electric vehicle, battery, and charging infrastructure innovations.',
    fullDescription:
      'The EVTech Cohort supports founders building electric vehicles, battery technology, charging infrastructure, and EV supply-chain solutions. The track combines sector mentorship, testing support, and industry linkages to help teams move toward manufacturing and market readiness.',
    duration: '4-6 Months',
    format: 'Sector-Specific Incubation',
    location: 'RTIH Amaravati Hub & Regional Spokes',
    imageSrc: '/incubation/6A7EE4DF-4157-43FA-A851-78B6789B52DD.jpeg',
    imageAlt: 'EVTech cohort founders working on an electric vehicle prototype',
    colors: {
      primary: '#9333ea',
      secondary: '#F6A623',
      lightBg: '#faf5ff',
      dark: '#4c1d75',
    },
    targetAudience: ['EV startups', 'Battery-tech teams', 'Charging infrastructure founders'],
    features: [
      { icon: 'electric_bolt', title: 'EV Use Cases', description: 'Work on electric vehicle, battery, and charging infrastructure problems.' },
      { icon: 'science', title: 'Prototype Testing', description: 'Refine the solution with mentor feedback and technical validation support.' },
      { icon: 'ev_station', title: 'Industry Linkages', description: 'Connect with EV manufacturers, fleet operators, and charging network partners.' },
      { icon: 'hub', title: 'Supply Chain Access', description: 'Get introduced to component suppliers and manufacturing partners.' },
    ],
    learningOutcomes: ['Problem discovery', 'Prototype testing', 'Supply chain planning', 'Business model design', 'Standards & safety awareness'],
    applicationSteps: [
      { number: '01', title: 'Apply', description: 'Share the EV problem you are solving and the stage of your prototype.' },
      { number: '02', title: 'Review', description: 'RTIH checks feasibility, innovation, and sector fit.' },
      { number: '03', title: 'Cohort', description: 'Join the cohort and work through sector-specific mentorship.' },
      { number: '04', title: 'Industry Readiness', description: 'Move toward manufacturing, testing, and market partnerships.' },
    ],
    faqs: [
      { question: 'Do I need a running prototype?', answer: 'No. Early-stage EV concepts with a clear technical direction are welcome.' },
      { question: 'What sub-sectors are covered?', answer: 'EVs, battery tech, charging infrastructure, and EV supply-chain solutions.' },
      { question: 'Is manufacturing support provided?', answer: 'RTIH helps connect teams to manufacturing and testing partners.' },
    ],
    contacts: {
      email: 'connect@rtih.co.in',
      phone: '+91 73966 03335',
      address: 'Mayuri Tech Park, Mangalagiri, Andhra Pradesh',
    },
    partners: ['EV manufacturers', 'Charging infrastructure partners', 'RTIH mentors'],
    programHighlights: ['Sector mentorship', 'Industry linkages', 'Manufacturing pathway'],
  },
};

const PROGRAM_IDS: ProgramId[] = [
  'spark',
  'future-founders',
  'catalyst',
  'velocity-lab',
  'medtech',
  'avgc-xr',
  'innotribe',
  'student-entrepreneurship',
  'climatetech',
  'mobility',
  'foodtech',
  'evtech',
];

function isProgramId(value: string): value is ProgramId {
  return PROGRAM_IDS.includes(value as ProgramId);
}

/* =============================================================================
 * Main-mode data types (formerly incubation-page.component.ts)
 * ========================================================================== */

type ProgramBenefit = {
  title: string;
  text: string;
  imageSrc: string;
  imageAlt: string;
  route?: string;
  disableFlip?: boolean;
};

type SummitSlide = {
  title: string;
  description: string;
  date: string;
  location: string;
  imageSrc: string;
  imageAlt: string;
  imageObjectPosition?: string;
};

/* =============================================================================
 * Programs carousel data (formerly programs-section.component.ts)
 * ========================================================================== */

type ProgramTrack = {
  /** Historically a fixed union of the 12 original program slugs; widened
   *  to `string` so admin-created programs (arbitrary program_key values)
   *  can also be represented here — see mergeProgramTracksFromBackend(). */
  slug: string;
  title: string;
  duration: string;
  selection: string;
  desc: string;
  imagePath: string;
  route: string;
  external?: boolean;
};

/* =============================================================================
 * FAQ data (formerly incubation-faq.component.ts)
 * ========================================================================== */

type IncubationFaq = {
  question: string;
  answer: string;
};

/* =============================================================================
 * Andhra Pradesh interactive map data (formerly andhra-pradesh-interactive-map.component.ts)
 * ========================================================================== */

type LabelAnchor = 'start' | 'end' | 'middle';

type SectorItem = {
  name: string;
  icon: string;
};

type PartnerItem = {
  name: string;
  logoSrc: string;
  logoAlt: string;
};

type DistrictFeature = {
  id: string;
  name: string;
  path: string;
  isHighlighted: boolean;
  sectors: SectorItem[];
  centroid: [number, number];
};

type Annotation = {
  id: string;
  label: string;
  x: number;
  y: number;
  textAnchor: LabelAnchor;
  linePath: string;
};

type ProjectedPoint = [number, number];

type Projector = (point: [number, number]) => ProjectedPoint;

type SocialIcon = 'x' | 'linkedin' | 'facebook' | 'instagram' | 'youtube';

type SocialGlassLink = {
  label: string;
  href: string;
  icon: SocialIcon;
};

/* =============================================================================
 * Merged component
 * ========================================================================== */

@Component({
  selector: 'app-incubation-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MaterialModule, HeaderRtihComponent, FooterRtihComponent, StartupToolkit],
  templateUrl: './incubation-page.component.html',
  styleUrls: ['./incubation-page.component.scss'],
})
export class IncubationPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly hostRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly contentService = inject(IncubationContentService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly sanitizer = inject(DomSanitizer);

  /* ---- mode / program resolution ---- */
  readonly mode: IncubationPageMode = this.resolveMode();
  readonly programId: string | null = this.resolveProgramId();
  /** True while `programId` is a brand-new (admin-created, not statically
   *  known) program whose real content hasn't come back from the backend
   *  yet — used by the template to show a lightweight loading state
   *  instead of flashing empty labels. */
  programLoading = false;
  program: ProgramData | undefined = this.resolveProgram();

  get canApplyToProgram(): boolean {
    return Boolean(this.program?.applyUrl) && this.program?.acceptingApplications !== false;
  }

  get programApplyStatusText(): string {
    return this.program?.applyStatusText || 'Applications opening soon';
  }

  /* ---- Apply Now modal (shared across main + program mode) ---- */
  applyModalUrl: string | null = null;
  applyModalTitle = 'Apply for Incubation';
  private applyModalSafeUrl: SafeResourceUrl | null = null;

  get applyModalFrameUrl(): SafeResourceUrl | null {
    return this.applyModalSafeUrl;
  }

  openApplyModal(url: string, title: string = 'Apply for Incubation'): void {
    this.applyModalUrl = url;
    this.applyModalTitle = title;
    this.applyModalSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  closeApplyModal(): void {
    this.applyModalUrl = null;
    this.applyModalSafeUrl = null;
  }

  @HostListener('document:keydown.escape')
  onApplyModalEscape(): void {
    if (this.applyModalUrl) {
      this.closeApplyModal();
    }
  }

  /** Scrolls to an in-page section instead of relying on a bare `href="#id"`
   *  anchor — with the global `<base href="/">`, a fragment-only href
   *  resolves against the base and navigates to "/#id" (the home page)
   *  rather than staying on the current route. */
  scrollToSection(sectionId: string, event: Event): void {
    event.preventDefault();
    this.hostRef.nativeElement.querySelector(`#${sectionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* =============================================================================
   * MAIN MODE fields (formerly incubation-page.component.ts)
   * ========================================================================== */

  heroVideoSrc = '/assets/hero-section-video.mp4';
  incubationApplyUrl = 'https://admin.rtih.co.in/incubation/apply.php';

  /* Hero copy — hardcoded defaults, optionally overridden by the PHP
   * backend's incubation-sections-feed.php ('hero' section). See
   * mergeSectionsFromBackend() below. */
  heroHeadline = 'A Launchpad for Visionary Entrepreneurs and Creators';
  heroCopy = 'A startup incubation platform for ambitious teams, mentors, partners, and ecosystem builders.';
  heroCtaLabel = 'Join Incubation';

  /* "How You Benefit" section title — hardcoded default, optionally
   * overridden by the 'benefits' section from the backend. */
  benefitsSectionTitle = 'How You Benefit';

  /* Startup toolkit categories fetched from the 'toolkit' section, passed
   * down to <app-startup-toolkit> as an @Input override. Stays undefined
   * (and the toolkit component keeps its own hardcoded defaults) if the
   * backend is unreachable or hasn't been deployed yet. */
  toolkitCategoriesOverride?: ToolkitCategory[];

  isEventsSectionActive = false;
  isProgramsSectionActive = false;
  benefitPrograms: ProgramBenefit[] = [
    {
      title: 'Funding opportunities',
      text:
        'Get access to investor connects, grant pathways, startup schemes, pitch-readiness guidance, and capital-readiness support for your growth stage. Founders receive help preparing stronger funding documents, understanding suitable capital routes, and reaching the right ecosystem partners.',
      imageSrc: 'program-icons/fund.jpeg',
      imageAlt: 'Funding opportunities',
      route: '/funding-opportunities',
      disableFlip: true,
    },
    {
      title: 'Co Working space',
      text:
        'Work from a focused startup environment built for team discussions, product planning, mentor reviews, and daily execution. The space supports founders with a professional setting to build, collaborate, host meetings, and stay connected with other growing teams.',
      imageSrc: 'program-icons/co.jpeg',
      imageAlt: 'Co working space',
    },
    {
      title: 'Networking Events',
      text:
        'Join workshops, founder circles, partner sessions, investor interactions, and ecosystem meetups designed for useful introductions. These events help startups discover collaborators, learn from peers, meet domain experts, and build relationships that continue beyond the room.',
      imageSrc: 'program-icons/net.jpeg',
      imageAlt: 'Networking events',
    },
    {
      title: 'Market Access',
      text:
        'Connect with potential customers, corporates, departments, pilot partners, and ecosystem stakeholders who can help validate and scale your solution. We support clearer market entry, stronger use cases, early adoption pathways, and practical growth conversations.',
      imageSrc: 'program-icons/market.jpeg',
      imageAlt: 'Market access',
    },
    {
      title: 'Technical and Legal Resources',
      text:
        'Access support across product architecture, technology validation, compliance, incorporation, accounting, intellectual property, contracts, and other founder essentials. These resources help teams reduce avoidable risk, improve operations, and build a stronger business foundation.',
      imageSrc: 'program-icons/legal.jpeg',
      imageAlt: 'Technical and legal resources',
    },
    {
      title: 'Mentorship Support',
      text:
        'Work with experienced mentors across strategy, product, finance, branding, operations, legal, and go-to-market planning. Mentorship helps founders test assumptions, sharpen decisions, improve execution, and move from idea to growth with clearer direction.',
      imageSrc: 'program-icons/mentor.jpeg',
      imageAlt: 'Mentorship support',
    },
  ];

  summitSlides: SummitSlide[] = [
    {
      title: 'Catalyst Incubation Program V1.0',
      description:
        'Bringing together founders, innovators, and startup enthusiasts for insightful sessions focused on startup growth, validation, and building scalable ventures',
      date: '12th May 2025',
      location: 'RTIH, Amaravati',
      imageSrc: 'cohort1.JPG',
      imageAlt: 'Cohort',
    },
    {
      title: 'Spark',
      description:
        'Bringing together startup mentors, incubation leaders, branding experts, legal advisors, and aspiring entrepreneurs from across Andhra Pradesh to strengthen innovation, business strategy, and startup ecosystem development.',
      date: 'May 2026',
      location: 'RTIH, Amaravati',
      imageSrc: 'future founders.JPG',
      imageAlt: 'Future Founders',
    },
  ];

  currentSummitSlideIndex = 0;

  @ViewChild('eventsSection') eventsSection?: ElementRef<HTMLElement>;
  @ViewChild('programsSection') programsSection?: ElementRef<HTMLElement>;

  private eventsObserver?: IntersectionObserver;
  private programsObserver?: IntersectionObserver;
  private summitAutoplayTimer?: number;
  private summitTouchStartX?: number;
  private summitTouchStartY?: number;

  resolveAsset(path: string): string {
    if (/^(https?:)?\/\//.test(path)) {
      return path;
    }

    return `/assets/${path.replace(/^\/+/, '')}`;
  }

  openBenefitCard(program: ProgramBenefit): void {
    if (!program.route || typeof window === 'undefined') {
      return;
    }

    window.location.href = program.route;
  }

  goToSummitSlide(index: number): void {
    this.currentSummitSlideIndex = index % this.summitSlides.length;
    this.restartSummitAutoplay();
  }

  nextSummitSlide(): void {
    this.currentSummitSlideIndex = (this.currentSummitSlideIndex + 1) % this.summitSlides.length;
    this.restartSummitAutoplay();
  }

  previousSummitSlide(): void {
    this.currentSummitSlideIndex =
      (this.currentSummitSlideIndex - 1 + this.summitSlides.length) % this.summitSlides.length;
    this.restartSummitAutoplay();
  }

  onSummitTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];
    this.summitTouchStartX = touch.clientX;
    this.summitTouchStartY = touch.clientY;
  }

  onSummitTouchEnd(event: TouchEvent): void {
    if (this.summitTouchStartX == null || this.summitTouchStartY == null) {
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - this.summitTouchStartX;
    const deltaY = touch.clientY - this.summitTouchStartY;

    this.summitTouchStartX = undefined;
    this.summitTouchStartY = undefined;

    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    if (deltaX < 0) {
      this.nextSummitSlide();
      return;
    }

    this.previousSummitSlide();
  }

  private observeEventsSection(): void {
    const section = this.eventsSection?.nativeElement;

    if (!section) {
      return;
    }

    this.eventsObserver = new IntersectionObserver(
      (entries) => {
        this.isEventsSectionActive = entries.some((entry) => entry.isIntersecting);
      },
      { threshold: 0.22 },
    );

    this.eventsObserver.observe(section);
  }

  private observeProgramsSection(): void {
    const section = this.programsSection?.nativeElement;

    if (!section) {
      return;
    }

    this.programsObserver = new IntersectionObserver(
      (entries) => {
        this.isProgramsSectionActive = entries.some((entry) => entry.isIntersecting);
      },
      { threshold: 0.24 },
    );

    this.programsObserver.observe(section);
  }

  private startSummitAutoplay(): void {
    if (this.summitSlides.length <= 1 || this.summitAutoplayTimer) {
      return;
    }

    this.summitAutoplayTimer = window.setInterval(() => {
      this.currentSummitSlideIndex = (this.currentSummitSlideIndex + 1) % this.summitSlides.length;
    }, 6000);
  }

  private restartSummitAutoplay(): void {
    this.clearSummitAutoplay();
    this.startSummitAutoplay();
  }

  private clearSummitAutoplay(): void {
    if (!this.summitAutoplayTimer) {
      return;
    }

    window.clearInterval(this.summitAutoplayTimer);
    this.summitAutoplayTimer = undefined;
  }

  /* =============================================================================
   * Programs carousel (formerly programs-section.component.ts)
   * ========================================================================== */

  @ViewChild('incubationCarousel') incubationCarousel?: ElementRef<HTMLElement>;

  activeMainTab: 'core' | 'sectorCohorts' = 'core';

  private autoplayTimer?: number;
  private autoplayPaused = false;

  readonly corePrograms: ProgramTrack[] = [];

  readonly sectorCohortPrograms: ProgramTrack[] = [];

  pauseAutoplay(): void {
    this.autoplayPaused = true;
  }

  resumeAutoplay(): void {
    this.autoplayPaused = false;
  }

  get activePrograms(): ProgramTrack[] {
    if (this.activeMainTab === 'sectorCohorts') {
      return this.sectorCohortPrograms;
    }

    return this.corePrograms;
  }

  selectMainTab(tab: 'core' | 'sectorCohorts'): void {
    this.activeMainTab = tab;
    this.resetCarouselScroll();
    this.restartAutoplay();
  }

  scrollIncubationPrograms(direction: number): void {
    this.advanceCarousel(direction);
    this.restartAutoplay();
  }

  private advanceCarousel(direction: number): boolean {
    const carousel = this.incubationCarousel?.nativeElement;

    if (!carousel) {
      return false;
    }

    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;

    if (direction > 0 && maxScrollLeft - carousel.scrollLeft < 4) {
      carousel.scrollTo({ left: 0, behavior: 'smooth' });
      return false;
    }

    const viewportWidth = carousel.clientWidth;
    const firstCard = carousel.querySelector<HTMLElement>('.ptrack-card');
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 272;
    const scrollAmount = Math.max(cardWidth * 1.08, viewportWidth * 0.78);

    carousel.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth',
    });

    return true;
  }

  private startProgramsCarouselAutoplay(): void {
    if (this.autoplayTimer || typeof window === 'undefined') {
      return;
    }

    this.autoplayTimer = window.setInterval(() => {
      if (this.autoplayPaused) {
        return;
      }

      this.advanceCarousel(1);
    }, 3200);
  }

  private restartAutoplay(): void {
    this.clearAutoplay();
    this.startProgramsCarouselAutoplay();
  }

  private clearAutoplay(): void {
    if (!this.autoplayTimer) {
      return;
    }

    window.clearInterval(this.autoplayTimer);
    this.autoplayTimer = undefined;
  }

  resolveProgramAsset(path: string): string {
    if (/^(https?:)?\/\//.test(path)) {
      return path;
    }

    return `/${path.replace(/^\/+/, '')}`;
  }

  programHref(program: ProgramTrack): string {
    return program.route;
  }

  isExternal(program: ProgramTrack): boolean {
    return Boolean(program.external);
  }

  private resetCarouselScroll(): void {
    const carousel = this.incubationCarousel?.nativeElement;

    if (carousel) {
      carousel.scrollLeft = 0;
    }
  }

  /* =============================================================================
   * FAQ (formerly incubation-faq.component.ts)
   * ========================================================================== */

  readonly FAQ_PREVIEW_COUNT = 6;
  showAllFaqs = false;

  faqs: IncubationFaq[] = [
    {
      question: 'What is the RTIH Incubation Program?',
      answer:
        'The RTIH Incubation Program supports early-stage startups with mentorship, workspace, funding support, and industry access so they can build, validate, and scale faster.',
    },
    {
      question: 'Who can apply for the incubation program?',
      answer:
        'Startups at the idea, prototype, or early revenue stage can apply, especially those working in sectors RTIH focuses on such as deep tech, sustainability, healthcare, and agritech.',
    },
    {
      question: 'What stage should my startup be at to apply?',
      answer:
        'We usually work with validated ideas, prototypes, and early traction-stage startups. Pre-idea concepts are better suited to a pre-incubation track.',
    },
    {
      question: 'How long does the incubation program run?',
      answer:
        'The program typically runs for 6 to 12 months, depending on the startup stage and milestone progress.',
    },
    {
      question: 'What does the program provide to incubated startups?',
      answer:
        'Startups receive mentorship, co-working access, legal and compliance support, investor connects, technical resources, and ecosystem visibility.',
    },
    {
      question: 'Does RTIH provide funding to incubated startups?',
      answer:
        'Selected startups may be eligible for seed support, subject to evaluation, and RTIH also connects founders to external investors and grant programs.',
    },
    {
      question: 'Does RTIH take equity in incubated startups?',
      answer:
        'Equity terms depend on the support model. Startups receiving direct funding support may have a defined equity arrangement, while others are not required to give equity.',
    },
    {
      question: 'What is the application process?',
      answer:
        'Apply through the online form on this page. Shortlisted applicants move through screening and a pitch review before onboarding.',
    },
    {
      question: 'How often does RTIH open applications for incubation?',
      answer:
        'Applications may open on a rolling basis or through cohort windows, depending on the track. Announcements are shared on this page and through RTIH channels.',
    },
    {
      question: 'Is there a fee to join the incubation program?',
      answer:
        'There is no fee to apply. If a specific cohort includes a participation fee, it is shared upfront before onboarding.',
    },
    {
      question: 'What kind of mentorship is provided?',
      answer:
        "Startups are paired with mentors from relevant industries, along with access to RTIH's network of entrepreneurs, domain experts, and functional specialists in areas like product, marketing, fundraising, and operations.",
    },
    {
      question: 'Is physical presence at the RTIH facility required?',
      answer:
        'Participation depends on the track. Some cohorts are in-person while others support hybrid participation, and the model is shared during selection.',
    },
    {
      question: 'What happens after the incubation period ends?',
      answer:
        'Startups that complete the program join the RTIH alumni network and may continue to receive introductions, follow-on guidance, and event visibility.',
    },
    {
      question: 'Who owns the intellectual property developed during incubation?',
      answer:
        'Startups retain full ownership of their intellectual property. RTIH supports development and growth, but does not claim IP rights unless a funding agreement says otherwise.',
    },
    {
      question: 'Who do I contact for more information about the incubation program?',
      answer:
        'For queries, reach out to incubation@rtih.co.in or use the contact form on this page. The team typically responds within a few business days.',
    },
  ];

  activeFaqIndex: number | null = 0;

  get visibleFaqs(): IncubationFaq[] {
    return this.showAllFaqs ? this.faqs : this.faqs.slice(0, this.FAQ_PREVIEW_COUNT);
  }

  toggleFaq(index: number): void {
    this.activeFaqIndex = this.activeFaqIndex === index ? null : index;
  }

  toggleMoreFaqs(): void {
    this.showAllFaqs = !this.showAllFaqs;

    if (!this.showAllFaqs && this.activeFaqIndex !== null && this.activeFaqIndex >= this.FAQ_PREVIEW_COUNT) {
      this.activeFaqIndex = null;
    }
  }

  /* =============================================================================
   * Andhra Pradesh interactive map (formerly andhra-pradesh-interactive-map.component.ts)
   * ========================================================================== */

  @ViewChild('mapWrapper') mapWrapper?: ElementRef<HTMLDivElement>;
  @ViewChild('mapSvg') mapSvg?: ElementRef<SVGSVGElement>;

  mapLoading = true;
  svgViewBox = '0 0 900 700';
  districts: DistrictFeature[] = [];
  activeDistrict: DistrictFeature | null = null;
  hoveredDistrict: DistrictFeature | null = null;
  hubPin: { cx: number; cy: number; size: number } | null = null;

  readonly vijayawadaPartners = {
    leadPromoter: [{ name: 'MEIL', logoSrc: '/partner-logos/meil.png', logoAlt: 'MEIL' }],
    coPromoter: [
      { name: 'NSL Group', logoSrc: '/partner-logos/nsl-group.png', logoAlt: 'NSL Group' },
      { name: 'Mohan Spintex', logoSrc: '/partner-logos/mohan-spintex.png', logoAlt: 'Mohan Spintex' },
    ],
    knowledgePartners: [
      { name: 'SRM University AP', logoSrc: '/partner-logos/srm-amaravathi.png', logoAlt: 'SRM University AP' },
      { name: 'VIT-AP University', logoSrc: '/partner-logos/vit-amaravathi.png', logoAlt: 'VIT-AP University' },
    ],
  };

  readonly rajahmundryPartners = {
    leadPromoter: [{ name: 'greenk', logoSrc: '/partner-logos/greenk.svg', logoAlt: 'greenk' }],
    coPromoter: [
      { name: 'Avanti Feeds Limited', logoSrc: '/partner-logos/avanthi-feeds.png', logoAlt: 'Avanti Feeds Limited' },
      { name: 'ONGC', logoSrc: '/partner-logos/ongc.png', logoAlt: 'ONGC' },
    ],
    knowledgePartners: [
      { name: 'JNTU Kakinada', logoSrc: '/partner-logos/jntu-kakinada.png', logoAlt: 'JNTU Kakinada' },
      { name: 'Andhra University', logoSrc: '/partner-logos/andhra-university.png', logoAlt: 'Andhra University' },
    ],
  };

  readonly visakhapatnamPartners = {
    leadPromoter: [{ name: 'GMR', logoSrc: '/partner-logos/gmr.png', logoAlt: 'GMR' }],
    coPromoter: [{ name: 'AM/NS India', logoSrc: '/partner-logos/amns-india.png', logoAlt: 'AM/NS India' }],
    knowledgePartners: [
      { name: 'Andhra University', logoSrc: '/partner-logos/andhra-university.png', logoAlt: 'Andhra University' },
      {
        name: 'IIPE Vizag',
        logoSrc: '/partner-logos/iipe-vizag.png',
        logoAlt: 'Indian Institute of Petroleum and Energy, Visakhapatnam',
      },
      { name: 'GITAM', logoSrc: '/partner-logos/gitam.png', logoAlt: 'GITAM' },
    ],
  };

  readonly amaravatiHubPartners = {
    leadPromoter: [{ name: 'TATA', logoSrc: '/partner-logos/tata.png', logoAlt: 'TATA' }],
    coPromoter: [{ name: 'L&T', logoSrc: '/partner-logos/LT.png', logoAlt: 'L&T' }],
    knowledgePartners: [
      { name: 'IIT Madras', logoSrc: '/partner-logos/iit-chennai.png', logoAlt: 'IIT Madras' },
      { name: 'IIM Visakhapatnam', logoSrc: '/partner-logos/iim-vizag.png', logoAlt: 'IIM Visakhapatnam' },
      { name: 'SRM University AP', logoSrc: '/partner-logos/srm-amaravathi.png', logoAlt: 'SRM University AP' },
      { name: 'VIT-AP University', logoSrc: '/partner-logos/vit-amaravathi.png', logoAlt: 'VIT-AP University' },
      { name: 'NIT Andhra Pradesh', logoSrc: '/partner-logos/nit-tadepalli.png', logoAlt: 'NIT Andhra Pradesh' },
    ],
  };

  readonly ananthapuramuPartners = {
    leadPromoter: [{ name: 'JSW', logoSrc: '/partner-logos/jsw.png', logoAlt: 'JSW' }],
    coPromoter: [
      { name: 'KIA', logoSrc: '/partner-logos/kia.png', logoAlt: 'KIA' },
      { name: 'Raymond', logoSrc: '/partner-logos/raymond.png', logoAlt: 'Raymond' },
    ],
    knowledgePartners: [
      { name: 'IIT Tirupati', logoSrc: '/partner-logos/iit-tirupathi.png', logoAlt: 'IIT Tirupati' },
      { name: 'JNTU Anantapur', logoSrc: '/partner-logos/jntu-ananthapur.png', logoAlt: 'JNTU Anantapur' },
    ],
  };

  readonly tirupatiPartners = {
    leadPromoter: [{ name: 'Adani', logoSrc: '/partner-logos/adani.png', logoAlt: 'Adani' }],
    coPromoter: [
      { name: 'Navayuga', logoSrc: '/partner-logos/navayuga.png', logoAlt: 'Navayuga' },
      { name: 'Amara Raja', logoSrc: '/partner-logos/amaraja.png', logoAlt: 'Amara Raja' },
    ],
    knowledgePartners: [{ name: 'IIT Tirupati', logoSrc: '/partner-logos/iit-tirupathi.png', logoAlt: 'IIT Tirupati' }],
  };

  readonly hubDistrict: DistrictFeature = {
    id: 'amaravati-hub',
    name: 'Amaravati (Hub)',
    path: '',
    isHighlighted: false,
    sectors: [],
    centroid: [0, 0],
  };

  readonly sectorData: Record<string, SectorItem[]> = {};

  private readonly geoJsonUrl =
    'https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@master/geojson/states/andhra-pradesh.geojson';

  private readonly highlightedDistricts = new Set([
    'visakhapatnam',
    'east godavari',
    'krishna',
    'tirupati',
    'anantapuramu',
  ]);

  private readonly excludedDistricts = new Set(['guntur', 'chittoor', 'ntr', 'eluru', 'west godavari', 'annamayya', 'spsr nellore']);

  private readonly displayNameMap: Record<string, string> = {
    'visakhapatnam': 'Visakhapatnam',
    'east godavari': 'Rajahmundry',
    'krishna': 'Vijayawada',
    'tirupati': 'Tirupati',
    'anantapuramu': 'Ananthapuramu',
  };

  private mapGeoJson: any = null;
  private mapWidth = 900;
  private mapHeight = 700;
  private projector: Projector = (point) => point;

  constructor() {
    this.initializeSectorData();
    this.hubDistrict.sectors = this.sectorData['Amaravati (Hub)'];

    if (this.mode === 'main') {
      this.activeDistrict = this.hubDistrict;
    }
  }

  get annotations(): Annotation[] {
    const layout = this.getLabelMatrix();
    const results: Annotation[] = [];

    for (const [label, position] of Object.entries(layout)) {
      if (label === 'Amaravati (Hub)') {
        if (!this.hubPin) {
          continue;
        }

        results.push({
          id: 'amaravati-hub',
          label,
          x: position.x,
          y: position.y,
          textAnchor: position.textAnchor,
          linePath: `M ${this.hubPin.cx} ${this.hubPin.cy} L ${position.x} ${position.y}`,
        });
        continue;
      }

      const district = this.districts.find((d) => d.name === label);
      if (!district || !district.isHighlighted) {
        continue;
      }

      const [cx, cy] = district.centroid;
      if (!Number.isFinite(cx) || !Number.isFinite(cy)) {
        continue;
      }

      results.push({
        id: district.id,
        label,
        x: position.x,
        y: position.y,
        textAnchor: position.textAnchor,
        linePath: `M ${cx} ${cy} L ${position.x} ${position.y}`,
      });
    }

    return results;
  }

  getIconUrl(iconName: string): string {
    if (!iconName) {
      return '';
    }

    if (iconName.startsWith('/') || iconName.startsWith('http') || iconName.includes('.')) {
      return iconName;
    }

    return `/icons/${iconName}.svg`;
  }

  getDistrictPanelTitle(district: DistrictFeature | null): string {
    if (!district) {
      return 'Amaravati (Hub)';
    }

    if (district.id === 'amaravati-hub' || district.name === 'Amaravati (Hub)') {
      return district.name;
    }

    return `${district.name} Spoke`;
  }

  setActiveDistrict(district: DistrictFeature): void {
    if (district.isHighlighted || district.id === 'amaravati-hub') {
      this.activeDistrict = district;
    }
  }

  setHoveredDistrict(district: DistrictFeature): void {
    if (district.isHighlighted) {
      this.hoveredDistrict = district;
      this.setActiveDistrict(district);
    }
  }

  clearHoveredDistrict(district: DistrictFeature): void {
    if (this.hoveredDistrict?.id === district.id) {
      this.hoveredDistrict = null;
    }
  }

  getPartnerGroup(
    district: DistrictFeature | null,
  ):
    | {
        leadPromoter: PartnerItem[];
        coPromoter: PartnerItem[];
        knowledgePartners: PartnerItem[];
      }
    | null {
    if (!district) {
      return this.amaravatiHubPartners;
    }

    if (district.id === 'amaravati-hub' || district.name === 'Amaravati (Hub)') {
      return this.amaravatiHubPartners;
    }

    if (district.name === 'Vijayawada') {
      return this.vijayawadaPartners;
    }

    if (district.name === 'Rajahmundry') {
      return this.rajahmundryPartners;
    }

    if (district.name === 'Visakhapatnam') {
      return this.visakhapatnamPartners;
    }

    if (district.name === 'Ananthapuramu') {
      return this.ananthapuramuPartners;
    }

    if (district.name === 'Tirupati') {
      return this.tirupatiPartners;
    }

    return null;
  }

  hasPartnerGroup(district: DistrictFeature | null): boolean {
    return !!this.getPartnerGroup(district);
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.mode === 'main') {
      this.updateMapSize();
    }
  }

  private async loadMapData(): Promise<void> {
    try {
      const response = await fetch(this.geoJsonUrl);
      this.mapGeoJson = await response.json();
      this.updateMapSize();
      this.activeDistrict = this.activeDistrict ?? this.hubDistrict;
    } catch (error) {
      console.error('Unable to load Andhra Pradesh GeoJSON:', error);
    } finally {
      this.mapLoading = false;
    }
  }

  private updateMapSize(): void {
    if (!this.mapWrapper || !this.mapGeoJson) {
      return;
    }

    const wrapperRect = this.mapWrapper.nativeElement.getBoundingClientRect();
    this.mapWidth = Math.max(640, Math.min(1120, Math.round(wrapperRect.width || 900)));
    this.mapHeight = Math.min(420, Math.max(380, Math.round(this.mapWidth * 0.44)));
    this.svgViewBox = `0 0 ${this.mapWidth} ${this.mapHeight}`;

    const baseProjection = this.createMercatorProjection();
    const projectedFeatures = this.mapGeoJson.features
      .map((feature: any, index: number) => {
        const rawName = this.getFeatureName(feature) || `District ${index + 1}`;
        const name = rawName.trim().toLowerCase();
        const displayName = this.displayNameMap[name] ?? rawName.trim();
        const isExcluded = this.excludedDistricts.has(name);
        const projectedGeometry = this.projectGeometry(feature.geometry, baseProjection);
        const centroid = this.calculateCentroid(projectedGeometry.points);

        return {
          id: `${name}-${index}`,
          name: displayName,
          geometry: projectedGeometry,
          isHighlighted: !isExcluded && this.highlightedDistricts.has(name),
          sectors: this.sectorData[displayName] ?? [],
          centroid,
        };
      })
      .filter(Boolean);

    const bounds = this.calculateBounds(projectedFeatures.flatMap((feature: any) => feature.geometry.points));
    this.projector = this.fitProjection(bounds);

    this.districts = projectedFeatures.map((feature: any) => {
      const path = this.geometryToPath(feature.geometry, this.projector);
      const centroid = this.projectPoint(feature.centroid);

      return {
        id: feature.id,
        name: feature.name,
        path,
        isHighlighted: feature.isHighlighted,
        sectors: feature.sectors,
        centroid,
      };
    });

    this.hubPin = this.getHubPin();
  }

  private getFeatureName(feature: any): string {
    const properties = feature.properties || {};
    return String(properties.district ?? properties.district_name ?? properties.name ?? '').trim();
  }

  private initializeSectorData(): void {
    this.sectorData['Amaravati (Hub)'] = [
      { name: 'Climate', icon: '/climate.svg' },
      { name: 'Blockchain', icon: '/blockchain.svg' },
      { name: 'Health Care', icon: '/healthcare.svg' },
      { name: 'Urban Systems', icon: '/urban.svg' },
    ];

    this.sectorData['Visakhapatnam'] = [
      { name: 'Smart Infra', icon: '/amt-urban-systems.svg' },
      { name: 'Blue Economy', icon: '/vskp-blue.svg' },
      { name: 'Biotech', icon: '/vskp-biotech.svg' },
      { name: 'FinTech', icon: '/vskp-fintech.svg' },
    ];

    this.sectorData['Ananthapuramu'] = [
      { name: 'Automotive & EV sys', icon: '/atp-automotive.svg' },
      { name: 'Hybrid RE', icon: '/atp-hybrid-re.svg' },
      { name: 'Agri & Food Processing', icon: '/atp-agri-food-processing.svg' },
      { name: 'Defence & Aerospace', icon: '/atp-defence.svg' },
    ];

    this.sectorData['Tirupati'] = [
      { name: 'Battery & Adv. Manufacturing', icon: '/tpty-battery.svg' },
      { name: 'Electronics Cluster', icon: '/tpty-electronics.svg' },
      { name: 'Horti Tech & Dairy', icon: '/tpty-horti.svg' },
      { name: 'Space Tech', icon: '/tpty-space-tech.svg' },
    ];

    this.sectorData['Vijayawada'] = [
      { name: 'Industrial IoT', icon: '/bza-iot.svg' },
      { name: 'Agri Technology', icon: '/bza-agri.svg' },
      { name: 'Auto-Body Building/Light Engineering', icon: '/bza-auto.svg' },
      { name: 'Construction Technology', icon: '/bza-construction.svg' },
    ];

    this.sectorData['Rajahmundry'] = [
      { name: 'Food Processing', icon: '/rjy-food-processing.svg' },
      { name: 'Marine Tech', icon: '/rjy-marine-tech.svg' },
      { name: 'Aquaculture', icon: '/rjy-aquaculture.svg' },
      { name: 'Energy Transition', icon: '/rjy-energy.svg' },
    ];
  }

  private createMercatorProjection(): Projector {
    const radius = 6378137;
    return ([lon, lat]) => {
      const clampedLat = Math.max(Math.min(lat, 89.5), -89.5);
      const x = (lon * Math.PI * radius) / 180;
      const y = radius * Math.log(Math.tan(Math.PI / 4 + (clampedLat * Math.PI) / 360));
      return [x, -y];
    };
  }

  private projectGeometry(geometry: any, projection: Projector): { type: string; rings: ProjectedPoint[][]; points: ProjectedPoint[] } {
    const rings: ProjectedPoint[][] = [];
    const points: ProjectedPoint[] = [];

    if (!geometry) {
      return { type: '', rings, points };
    }

    if (geometry.type === 'Polygon') {
      for (const ring of geometry.coordinates ?? []) {
        const projectedRing = ring.map((point: [number, number]) => projection(point));
        rings.push(projectedRing);
        points.push(...projectedRing);
      }
    }

    if (geometry.type === 'MultiPolygon') {
      for (const polygon of geometry.coordinates ?? []) {
        for (const ring of polygon) {
          const projectedRing = ring.map((point: [number, number]) => projection(point));
          rings.push(projectedRing);
          points.push(...projectedRing);
        }
      }
    }

    return { type: geometry.type, rings, points };
  }

  private calculateBounds(points: ProjectedPoint[]): { minX: number; minY: number; maxX: number; maxY: number } {
    if (!points.length) {
      return { minX: 0, minY: 0, maxX: 1, maxY: 1 };
    }

    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    for (const [x, y] of points) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }

    return { minX, minY, maxX, maxY };
  }

  private fitProjection(bounds: { minX: number; minY: number; maxX: number; maxY: number }): Projector {
    const padding = 14;
    const width = Math.max(1, this.mapWidth - padding * 2);
    const height = Math.max(1, this.mapHeight - padding * 2);
    const boundsWidth = Math.max(bounds.maxX - bounds.minX, 1);
    const boundsHeight = Math.max(bounds.maxY - bounds.minY, 1);
    const scale = Math.min(width / boundsWidth, height / boundsHeight);
    const contentWidth = boundsWidth * scale;
    const contentHeight = boundsHeight * scale;
    const offsetX = padding + (width - contentWidth) / 2 - bounds.minX * scale;
    const offsetY = padding + (height - contentHeight) / 2 - bounds.minY * scale;

    return ([x, y]) => [x * scale + offsetX, y * scale + offsetY];
  }

  private projectPoint(point: ProjectedPoint): ProjectedPoint {
    return this.projector(point);
  }

  private geometryToPath(
    geometry: { type: string; rings: ProjectedPoint[][] },
    projector: Projector,
  ): string {
    if (!geometry?.rings.length) {
      return '';
    }

    return geometry.rings
      .map((ring) =>
        ring
          .map((point, index) => {
            const [x, y] = projector(point);
            const prefix = index === 0 ? 'M' : 'L';
            return `${prefix} ${x.toFixed(2)} ${y.toFixed(2)}`;
          })
          .join(' ') + ' Z',
      )
      .join(' ');
  }

  private calculateCentroid(points: ProjectedPoint[]): ProjectedPoint {
    if (!points.length) {
      return [0, 0];
    }

    const totals = points.reduce(
      (acc, [x, y]) => {
        acc.x += x;
        acc.y += y;
        return acc;
      },
      { x: 0, y: 0 },
    );

    return [totals.x / points.length, totals.y / points.length];
  }

  private getHubPin(): { cx: number; cy: number; size: number } | null {
    const guntur = this.districts.find((district) => district.name.toLowerCase() === 'guntur');

    if (!guntur) {
      return null;
    }

    const [cx, cy] = guntur.centroid;
    if (!Number.isFinite(cx) || !Number.isFinite(cy)) {
      return null;
    }

    return {
      cx: cx + Math.max(16, this.mapWidth * 0.014),
      cy: cy - Math.max(12, this.mapHeight * 0.02),
      size: Math.max(24, this.mapWidth * 0.03),
    };
  }

  private getLabelMatrix(): Record<string, { x: number; y: number; textAnchor: LabelAnchor }> {
    return {
      'Ananthapuramu': { x: this.mapWidth * 0.22, y: this.mapHeight * 0.82, textAnchor: 'end' },
      'Amaravati (Hub)': { x: this.mapWidth * 0.4, y: this.mapHeight * 0.28, textAnchor: 'end' },
      'Vijayawada': { x: this.mapWidth * 0.72, y: this.mapHeight * 0.7, textAnchor: 'start' },
      'Rajahmundry': { x: this.mapWidth * 0.82, y: this.mapHeight * 0.46, textAnchor: 'start' },
      'Visakhapatnam': { x: this.mapWidth * 0.8, y: this.mapHeight * 0.18, textAnchor: 'start' },
      'Tirupati': { x: this.mapWidth * 0.78, y: this.mapHeight * 0.84, textAnchor: 'start' },
    };
  }

  /* =============================================================================
   * Social glass bar (formerly social-glass-bar.component.ts)
   * ========================================================================== */

  readonly socialLinks: SocialGlassLink[] = [
    { label: 'X', href: 'https://x.com/RTIH_AP', icon: 'x' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/rtih-ap/posts/?feedView=all', icon: 'linkedin' },
    { label: 'Facebook', href: 'https://www.facebook.com/people/Rtih-Vijayawada/61581654933681/', icon: 'facebook' },
    { label: 'Instagram', href: 'https://www.instagram.com/rtih_ap/', icon: 'instagram' },
    { label: 'YouTube', href: 'https://www.youtube.com/@RTIH-AP', icon: 'youtube' },
  ];

  trackBySocialHref = (_: number, link: SocialGlassLink) => link.href + link.label;

  /* =============================================================================
   * Program mode (formerly program-page.component.ts)
   * ========================================================================== */

  private revealObserver: IntersectionObserver | null = null;

  /**
   * Meta-info facts shown in the hero (Duration / Format / Location /
   * Ideal for), filtered down to only the ones with an actual value so a
   * sparse/new program doesn't render empty labeled boxes. The facts grid
   * in the template reflows (auto-fit) to stay balanced whether 1 or 4
   * facts are present.
   */
  get programFacts(): { label: string; value: string }[] {
    if (!this.program) {
      return [];
    }

    const candidates = [
      { label: 'Duration', value: this.program.duration },
      { label: 'Format', value: this.program.format },
      { label: 'Location', value: this.program.location },
      { label: 'Ideal for', value: this.program.targetAudience[0] },
    ];

    return candidates.filter((fact) => !!fact.value);
  }

  toggleProgramFaq(index: number): void {
    if (!this.program) {
      return;
    }

    this.program.faqs = this.program.faqs.map((faq, faqIndex) => ({
      ...faq,
      open: faqIndex === index ? !faq.open : false,
    }));
  }

  mailtoLink(email: string): string {
    return `mailto:${email}`;
  }

  telLink(phone: string): string {
    return `tel:${phone.replace(/[^\d+]/g, '')}`;
  }

  programMapLink(address: string): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }

  trackByIndex(index: number): number {
    return index;
  }

  /* =============================================================================
   * Route mode / program resolution helpers
   * ========================================================================== */

  private resolveMode(): IncubationPageMode {
    const routeMode = String(this.route.snapshot.data['mode'] ?? '').trim();

    if (routeMode === 'program' || routeMode === 'toolkit' || routeMode === 'main') {
      return routeMode;
    }

    return 'main';
  }

  /**
   * Accepts ANY non-empty, trimmed route param/data value as a valid
   * program id — including program_key values an admin creates fresh in
   * the backend that were never part of the original static `ProgramId`
   * union. The `avgc` -> `avgc-xr` alias is preserved for the one legacy
   * route that doesn't match its program_key.
   */
  private resolveProgramId(): string | null {
    const routeProgramId = String(
      this.route.snapshot.paramMap.get('programId') ?? this.route.snapshot.data['programId'] ?? '',
    ).trim();
    if (!routeProgramId) {
      return null;
    }

    return routeProgramId === 'avgc' ? 'avgc-xr' : routeProgramId;
  }

  private resolveProgram(): ProgramData | undefined {
    if (!this.programId) {
      return undefined;
    }

    if (isProgramId(this.programId)) {
      const program = PROGRAMS[this.programId];
      return {
        ...program,
        colors: { ...program.colors },
        targetAudience: [...program.targetAudience],
        features: program.features.map((feature) => ({ ...feature })),
        learningOutcomes: [...program.learningOutcomes],
        applicationSteps: program.applicationSteps.map((step) => ({ ...step })),
        faqs: program.faqs.map((faq) => ({ ...faq, open: false })),
        contacts: { ...program.contacts },
        partners: [...program.partners],
        programHighlights: [...program.programHighlights],
      };
    }

    // Brand-new, admin-created program_key that isn't in the static
    // PROGRAMS map yet. Return an empty-but-valid scaffold so template
    // bindings never crash, and flag it as loading until the backend
    // fetch (mergeProgramFromBackend) resolves real content.
    this.programLoading = true;
    return {
      id: this.programId,
      name: this.programId,
      tagline: '',
      description: '',
      fullDescription: '',
      duration: '',
      format: '',
      location: '',
      imageSrc: '',
      imageAlt: '',
      colors: {
        primary: '#7c3aed',
        secondary: '#F6A623',
        lightBg: '#f7f2ff',
        dark: '#2f1657',
      },
      targetAudience: [],
      features: [],
      learningOutcomes: [],
      applicationSteps: [],
      faqs: [],
      contacts: { email: '', phone: '', address: '' },
      partners: [],
      programHighlights: [],
    };
  }

  /* =============================================================================
   * Lifecycle
   * ========================================================================== */

  ngOnInit(): void {
    if (this.mode === 'main') {
      this.startProgramsCarouselAutoplay();
      this.mergeSectionsFromBackend();
      this.mergeProgramTracksFromBackend();
    }

    if (this.mode === 'toolkit') {
      this.mergeToolkitFromBackend();
    }

    if (this.mode === 'program') {
      this.mergeProgramFromBackend();
    }
  }

  /* =============================================================================
   * PHP + MySQL admin backend wiring
   *
   * Every call below degrades gracefully: IncubationContentService already
   * swallows HTTP errors and resolves to `null` (see catchError there), so
   * a missing/undeployed/unreachable backend never throws here and the
   * hardcoded defaults defined above simply stay in place. Only fields the
   * backend actually returned (and marked enabled / non-empty) override the
   * defaults — nothing is ever blanked out by a partial response.
   * ========================================================================== */

  private mergeSectionsFromBackend(): void {
    this.contentService.fetchSections().subscribe((sections) => {
      if (!sections) {
        return;
      }

      const hero = sections.hero;
      if (hero && hero.enabled !== false) {
        if (hero.headline) this.heroHeadline = hero.headline;
        if (hero.subtitle) this.heroCopy = hero.subtitle;
        if (hero.cta_label) this.heroCtaLabel = hero.cta_label;
        // cta_url / video_src intentionally NOT applied here: the CMS still
        // has a stale Google Form link and a since-removed video file
        // stored from before, which would otherwise silently override the
        // current incubationApplyUrl / heroVideoSrc defaults on every load.
      }

      const benefits = sections.benefits;
      if (benefits && benefits.enabled !== false) {
        if (benefits.title) this.benefitsSectionTitle = benefits.title;
        if (Array.isArray(benefits.items) && benefits.items.length > 0) {
          this.benefitPrograms = benefits.items.map((item) => ({
            title: item.title ?? '',
            text: item.text ?? '',
            imageSrc: item.imageSrc ?? '',
            imageAlt: item.imageAlt ?? '',
            route: item.route || undefined,
          }));
        }
      }

      const mainFaq = sections.main_faq;
      if (mainFaq && mainFaq.enabled !== false && Array.isArray(mainFaq.items) && mainFaq.items.length > 0) {
        this.faqs = mainFaq.items
          .filter((item) => item.question && item.answer)
          .map((item) => ({ question: item.question as string, answer: item.answer as string }));
      }

      const gallery = sections.gallery;
      if (gallery && gallery.enabled !== false && Array.isArray(gallery.items) && gallery.items.length > 0) {
        this.summitSlides = gallery.items.map((item) => ({
          title: item.title ?? '',
          description: item.description ?? '',
          date: item.date ?? '',
          location: item.location ?? '',
          imageSrc: item.imageSrc ?? '',
          imageAlt: item.imageAlt ?? '',
        }));
        // The carousel's autoplay/interval reads this.summitSlides.length
        // fresh on every tick (see startSummitAutoplay()), so no separate
        // fix is needed there — only the current index needs clamping in
        // case the backend returned fewer slides than the hardcoded default.
        if (this.currentSummitSlideIndex >= this.summitSlides.length) {
          this.currentSummitSlideIndex = 0;
        }
      }

      this.cdr.markForCheck();
    });
  }

  /**
   * Merges the backend's `incubation_programs` rows into the main-page
   * program tracks (corePrograms / sectorCohortPrograms) so the
   * tabs/carousel on `/incubation` reflect admin edits, and — most
   * importantly — so a brand-new admin-created program (one with no
   * matching static `ProgramTrack` entry) actually becomes visible there
   * instead of only existing in the static PROGRAMS map / on its own
   * `/programs/:programId` page.
   */
  private mergeProgramTracksFromBackend(): void {
    this.contentService.fetchPrograms().subscribe((programs) => {
      if (!programs || !programs.length) {
        return;
      }

      const targetArrayByTrackGroup: Record<string, ProgramTrack[] | undefined> = {
        core: this.corePrograms,
        'sector-cohort': this.sectorCohortPrograms,
      };

      const allTracks: ProgramTrack[] = [
        ...this.corePrograms,
        ...this.sectorCohortPrograms,
      ];

      const displayOrderByTrack = new Map<ProgramTrack, number>();
      let changed = false;

      for (const match of programs) {
        if (match.active === false) {
          continue;
        }

        const matchRoute = match.route_path || `/${match.program_key}`;
        const existing = allTracks.find(
          (track) => track.slug === match.program_key || track.route === matchRoute,
        );

        if (existing) {
          existing.title = match.title || existing.title;
          existing.desc = match.content?.description || existing.desc;
          displayOrderByTrack.set(existing, match.display_order);
          changed = true;
          continue;
        }

        const targetArray = targetArrayByTrackGroup[match.track_group];
        if (!targetArray) {
          // No main-page array represents this track_group (shouldn't
          // happen with the current admin form's options) — skip rather
          // than guess where it belongs.
          continue;
        }

        const newTrack: ProgramTrack = {
          slug: match.program_key,
          title: match.title || match.program_key,
          duration: match.content?.duration || '',
          selection: '',
          desc: match.content?.description || '',
          imagePath: match.content?.imageSrc || '',
          route: matchRoute,
        };

        targetArray.push(newTrack);
        allTracks.push(newTrack);
        displayOrderByTrack.set(newTrack, match.display_order);
        changed = true;
      }

      if (!changed) {
        return;
      }

      // Respect display_order where the backend provided it; entries with
      // no backend match keep their original relative order.
      const byDisplayOrder = (a: ProgramTrack, b: ProgramTrack) => {
        const orderA = displayOrderByTrack.get(a);
        const orderB = displayOrderByTrack.get(b);
        if (orderA == null && orderB == null) return 0;
        if (orderA == null) return -1;
        if (orderB == null) return 1;
        return orderA - orderB;
      };

      this.corePrograms.sort(byDisplayOrder);
      this.sectorCohortPrograms.sort(byDisplayOrder);

      this.cdr.markForCheck();
    });
  }

  private mergeToolkitFromBackend(): void {
    this.contentService.fetchSections().subscribe((sections) => {
      const toolkit = sections?.toolkit;
      if (!toolkit || toolkit.enabled === false || !Array.isArray(toolkit.items) || toolkit.items.length === 0) {
        return;
      }

      this.toolkitCategoriesOverride = toolkit.items
        .filter((item) => item.title)
        .map((item) => ({
          title: item.title ?? '',
          description: item.description ?? '',
          keyOfferings: Array.isArray(item.keyOfferings) ? item.keyOfferings : [],
          logos: Array.isArray(item.logos)
            ? item.logos.map((logo) => ({ src: logo.src ?? '', alt: logo.alt ?? '' }))
            : [],
        }));

      this.cdr.markForCheck();
    });
  }

  private mergeProgramFromBackend(): void {
    if (!this.programId) {
      return;
    }

    this.contentService.fetchPrograms().subscribe((programs) => {
      const match = programs?.find((program) => program.program_key === this.programId);
      if (!match) {
        // Nothing came back for this programId (backend unreachable, or a
        // genuinely missing program) — stop showing a loading state so we
        // don't spin forever; the scaffold's empty fields / "not found"
        // template stay in place.
        this.programLoading = false;
        this.cdr.markForCheck();
        return;
      }

      // `this.program` is always defined once `this.programId` is truthy
      // (see resolveProgram()) — either the cloned static entry or the
      // empty scaffold for a brand-new admin-created program.
      const base = this.program!;
      const content = match.content ?? {};
      this.program = {
        ...base,
        name: match.title || base.name,
        tagline: match.tagline || base.tagline,
        description: content.description || base.description,
        fullDescription: content.fullDescription || base.fullDescription,
        duration: content.duration || base.duration,
        format: content.format || base.format,
        location: content.location || base.location,
        imageSrc: content.imageSrc || base.imageSrc,
        imageAlt: content.imageAlt || base.imageAlt,
        applyUrl: match.apply_url || base.applyUrl,
        acceptingApplications: match.accepting_applications ?? base.acceptingApplications ?? true,
        applyStatusText: match.apply_status_text || base.applyStatusText,
        colors: content.colors
          ? {
              primary: content.colors.primary || base.colors.primary,
              secondary: content.colors.secondary || base.colors.secondary,
              lightBg: content.colors.lightBg || base.colors.lightBg,
              dark: content.colors.dark || base.colors.dark,
            }
          : base.colors,
        targetAudience: content.targetAudience?.length ? content.targetAudience : base.targetAudience,
        features: content.features?.length ? content.features : base.features,
        learningOutcomes: content.learningOutcomes?.length ? content.learningOutcomes : base.learningOutcomes,
        applicationSteps: content.applicationSteps?.length ? content.applicationSteps : base.applicationSteps,
        faqs: content.faqs?.length ? content.faqs.map((faq) => ({ ...faq, open: false })) : base.faqs,
        contacts: content.contacts
          ? {
              email: content.contacts.email || base.contacts.email,
              phone: content.contacts.phone || base.contacts.phone,
              address: content.contacts.address || base.contacts.address,
            }
          : base.contacts,
        partners: content.partners?.length ? content.partners : base.partners,
        programHighlights: content.programHighlights?.length ? content.programHighlights : base.programHighlights,
      };

      this.programLoading = false;
      this.cdr.markForCheck();

      // Merging fresh content replaces `this.program` with a new object, so
      // *ngFor (no trackBy) tears down and recreates the `.reveal` feature/
      // step cards. The IntersectionObserver set up in ngAfterViewInit was
      // only watching the OLD (now-destroyed) elements, so the new ones
      // would otherwise stay permanently hidden. Re-run it once the DOM has
      // actually updated (next macrotask, after change detection flushes).
      setTimeout(() => this.setupProgramRevealObserver(), 0);
    });
  }

  ngAfterViewInit(): void {
    if (this.mode === 'main') {
      this.observeEventsSection();
      this.observeProgramsSection();
      this.startSummitAutoplay();
      void this.loadMapData();
    }

    if (this.mode === 'program') {
      this.setupProgramRevealObserver();
    }
  }

  private setupProgramRevealObserver(): void {
    // Safe to call again after content is merged in from the backend: drop
    // any stale observer (it may be watching DOM nodes *ngFor already
    // destroyed) before observing the current elements.
    this.revealObserver?.disconnect();

    const revealables = this.hostRef.nativeElement.querySelectorAll<HTMLElement>('.reveal');
    if (!revealables.length) {
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      revealables.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this.revealObserver?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
    );

    revealables.forEach((el) => this.revealObserver?.observe(el));
  }

  ngOnDestroy(): void {
    this.eventsObserver?.disconnect();
    this.programsObserver?.disconnect();
    this.revealObserver?.disconnect();

    this.clearSummitAutoplay();
    this.clearAutoplay();
  }
}
