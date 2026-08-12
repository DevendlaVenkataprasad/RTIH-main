import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderRtihComponent } from '../header-rtih/header-rtih.component';
import { FooterRtihComponent } from '../footer-rtih/footer-rtih.component';

@Component({
  selector: 'app-innotribe',
  standalone: true,
  imports: [CommonModule, HeaderRtihComponent, FooterRtihComponent],
  templateUrl: './innotribe.html',
  styleUrls: ['./innotribe.scss']
})
export class Innotribe {
  readonly innotribeVideoSrc = 'assets/Innotribe.mp4';
  isVideoModalOpen = false;

  readonly heroMetrics = [
    { value: '1000+', label: 'Students Reached' },
    { value: '350+', label: 'Expression of Interest Received' }
  ];

  readonly ctas = [
    { label: 'Institutions partner with us', audience: 'Institutions', href: '#get-started', variant: 'primary' }
  ];

  readonly objectives = [
    { text: 'Develop a state-wide student innovation pipeline', icon: 'account_tree' },
    { text: 'Ensure inclusive access across institutions', icon: 'diversity_3' },
    { text: 'Identify and support high-potential student innovators', icon: 'stars' },
    { text: 'Enable validation, prototyping, and mentorship', icon: 'precision_manufacturing' },
    { text: 'Facilitate transition to incubation and venture launch', icon: 'rocket_launch' }
  ];

  readonly journeyStages: Array<{
    stage: string;
    title: string;
    activities: string;
    outcome: string;
    markerIcon?: string;
  }> = [
    {
      stage: 'Awareness & Exposure',
      title: 'Student self-selection',
      activities: 'Student Outreach, Innovation talks',
      outcome: 'Student self-selection'
    },
    {
      stage: 'Orientation',
      title: 'Opt-in for screening',
      activities: 'Innovation ambassadors from each institution',
      outcome: 'Opt-in for screening'
    },
    {
      stage: 'Capability & Screening',
      title: 'Innovation Passport',
      activities: 'Online course (vernacular-first) + assignments',
      outcome: 'Innovation Passport + screened cohort'
    },
    {
      stage: 'Idea Validation',
      title: 'Problem-solution fit',
      activities: 'Boot camps (3-7 days) followed by Ideathons, team formation, validation',
      outcome: 'Problem-solution fit'
    },
    {
      stage: ' Pre- Incubation',
      title: 'Prototype Building',
      activities: 'Micro-grants, guided experimentation',
      outcome: 'Working prototype + validation report'
    },
    {
      stage: 'Showcase & transition',
      title: 'Incubation / venture Launch',
      activities: 'Spoke Level Demo Days  and District showcases - Quarterly',
      outcome: 'Incubation / venture launch'
    },
    {
      stage: 'State Fest',
      title: 'Annual State Fest',
      activities: 'Final state showcase, ecosystem networking, and jury recognition',
      outcome: 'State visibility + incubation and venture launch opportunities',
      markerIcon: 'emoji_events'
    }
  ];

  readonly studentItems = [
    'Open to all students across Andhra Pradesh',
    'No prior experience required',
    'Eligible for Innovation Passport'
  ];

  readonly facultyItems = [
    'Serve as Faculty Coordinators',
    'Access FDPs and mentor training',
    'Co-mentor student teams'
  ];

  readonly institutionLevels = [
    { level: 'Level A', category: 'Participating', role: 'Awareness activities + coordinator nomination', icon: 'flag' },
    { level: 'Level B', category: 'Active', role: 'Conduct challenges + faculty mentoring', icon: 'bolt' },
    { level: 'Level C', category: 'Embedded', role: 'Sustained innovation ecosystem + I & E-Cell eligibility', icon: 'hub' }
  ];

  readonly axes = [
    {
      title: 'Student Journey',
      detail: 'End-to-end innovation pathway',
      icon: 'route',
      flow: [
        { label: 'Awareness', icon: 'campaign' },
        { label: 'Screening', icon: 'fact_check' },
        { label: 'Spark', icon: 'groups' },
        { label: 'Prototype', icon: 'settings' },
        { label: 'Incubation', icon: 'emoji_events' }
      ]
    },
    {
      title: 'Institutional Participation',
      detail: 'Tier-based engagement',
      icon: 'account_balance',
      flow: [
        { label: 'Participate', icon: 'how_to_reg' },
        { label: 'Active', icon: 'bolt' },
        { label: 'Embedded', icon: 'hub' }
      ]
    },
    {
      title: 'Capability & Support',
      detail: 'Campus-to-incubation support system',
      icon: 'support_agent',
      flow: [
        { label: 'I&E Cells', icon: 'emoji_objects' },
        { label: 'RTIH Outposts', icon: 'location_on' },
        { label: 'RTIH Spokes', icon: 'share' }
      ]
    },
    {
      title: 'Governance & Data',
      detail: 'Tracking, audits, and transparent progression',
      icon: 'admin_panel_settings',
      flow: [
        { label: 'Registration', icon: 'app_registration' },
        { label: 'MIS', icon: 'dashboard' },
        { label: 'Stage Tracking', icon: 'timeline' },
        { label: 'Reviews', icon: 'rate_review' },
        { label: 'Impact Metrics', icon: 'analytics' }
      ]
    }
  ];

  readonly infrastructure = [
    { title: 'I&E Cells', detail: 'Campus-level innovation anchors', icon: 'emoji_objects' },
    { title: 'Incubator Outposts', detail: 'Regional validation hubs', icon: 'location_on' },
    { title: 'RTIH Spokes', detail: 'Mentorship, evaluation, incubation', icon: 'hub' }
  ];

  readonly audienceCards = [
    {
      title: 'Students',
      subtitle: 'Enter the pathway from any discipline',
      icon: 'groups',
      items: this.studentItems
    },
    {
      title: 'Faculty',
      subtitle: 'Coordinate, mentor, and activate campus teams',
      icon: 'school',
      items: this.facultyItems
    }
  ];

  readonly dashboardFeatures = [
    'Student Innovation Passport',
    'Stage-wise progression tracking',
    'Institutional performance analytics',
    'Prototype-to-incubation tracker'
  ];

  readonly publicMetrics = [
    'Students Reached',
    'Screened Cohorts',
    'Teams Formed',
    'Prototypes Developed',
    'Incubation Transitions'
  ];

  readonly timeline = [
    { phase: 'Phase 1', date: 'April 2026', activity: 'Program Launch' },
    { phase: 'Phase 2', date: 'May - July 2026', activity: 'Institutional onboarding I & E-Cell activation' },
    { phase: 'Phase 3', date: 'July - September 2026', activity: 'Awareness & screening' },
    { phase: 'Phase 4', date: 'August - November 2026', activity: 'Boot camps & validation' },
    { phase: 'Phase 5', date: 'December 2026', activity: 'Demo days & incubation intake' },
    { phase: 'Phase 6', date: 'February 2027', activity: 'State-level InnoTribe Fest' }
  ];

  readonly faqs = [
    {
  question: 'What is InnoTribe?',
  answer: `InnoTribe is RTIH's statewide student innovation & entrepreneurship program that provides a structured pathway from awareness to venture readiness. It integrates institutions, faculty, ecosystem partners, and RTIH Spokes under one unified architecture.
  - Scouting Student Innovators
  - Transforming Ideas into Startups
  - Preparing Venture-Ready Teams`
},
    {
      question: 'Who can participate in InnoTribe?',
      answer: 'Any student enrolled in an educational institution in Andhra Pradesh can participate, regardless of discipline, year of study, or prior experience. No prior startup experience is required; you can start at Stage 0 (Awareness).'
    },
    {
      question: 'Do I need a team to join InnoTribe?',
      answer: 'No. You can register individually. Team formation is facilitated during Stage 3 (Spark - Intensive Venture Formation) through bootcamps and validation activities.'
    },
    {
      question: 'What is the Innovation Passport?',
      answer: 'The Innovation Passport is a digital credential issued after successfully completing Stage 2 (Capability & Screening). It validates your foundational innovation capability and enables access to advanced stages like Spark, Prototype & Validation, and incubation pathways.'
    },
    {
      question: 'Is there a fee to participate?',
      answer: 'No. InnoTribe is fully supported by RTIH. Milestone-linked micro-grants for prototyping are disbursed through compliant institutional channels as per RTIH guidelines.'
    },
 
    {
      question: 'How is my progress tracked?',
      answer: 'Your journey is tracked via the Student Innovation Passport in the InnoTribe MIS. It records course completion, assignments, stage progression, team formation, and prototype milestones, ensuring transparency and audit-ready reporting.'
    },
    {
      question: 'What is the role of a Faculty Coordinator?',
      answer: 'The Faculty Coordinator is the institutional single point of contact for InnoTribe. Responsibilities include:\n- Mobilising students for awareness sessions & screening courses\n- Scheduling E-Cell activities per RTIH playbooks\n- Maintaining MIS updates for participation, completions, and progression\n- Liaising with the designated RTIH Spoke for coordination & escalation'
    },
    {
      question: 'What are the three Institutional Participation Levels?',
      answer: 'Level A - Participating: Host awareness/orientation, nominate Faculty Coordinator, and enable student participation.\nLevel B - Active: Regular student participation, faculty as co-mentors, and conduct challenges using RTIH playbooks.\nLevel C - Embedded: Year-round innovation activity, operational E-Cell, Outpost eligibility, and institutional continuity.\n\nNote: Levels reflect engagement mode, not ranking.'
    },
    {
      question: 'What is an E-Cell, and how is it tiered?',
      answer: 'An InnoTribe E-Cell is the campus-level student-faculty unit for innovation awareness, challenge execution, and pipeline creation. It has three tiers:\n- Tier 3 (Participating): Faculty coordinator + awareness activities\n- Tier 2 (Active): 1-2 student leads + 2+ innovation events/year\n- Tier 1 (Embedded): Structured team of 3-5 leads + 3+ challenges/year + MIS discipline + Outpost eligibility'
    },
    {
      question: 'How are micro-grants disbursed for prototyping?',
      answer: 'Grants are milestone-linked and disbursed through the institution\'s compliant financial channel, typically a Section 8 company, as mandated by Government guidelines. RTIH Spokes support verification and monitoring, but do not replace the prescribed disbursement channel.'
    }
  ];

  readonly initialFaqCount = 3;
  showAllFaqs = false;

  get visibleFaqs() {
    return this.showAllFaqs ? this.faqs : this.faqs.slice(0, this.initialFaqCount);
  }

  toggleFaqs() {
    this.showAllFaqs = !this.showAllFaqs;
  }

  openVideoModal() {
    this.isVideoModalOpen = true;
  }

  closeVideoModal() {
    this.isVideoModalOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.isVideoModalOpen) {
      this.closeVideoModal();
    }
  }

  readonly contacts = [
    
    '4th Floor, Mayuri tech park, Mangalagiri', 
    'Guntur, Andhra Pradesh 522503',
    'B. Sai Ram - Manager, Youth Outreach'
  ];
}
