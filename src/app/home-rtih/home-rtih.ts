import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';
import { FooterRtihComponent } from '../footer-rtih/footer-rtih.component';
import { HeaderRtihComponent } from '../header-rtih/header-rtih.component';
import { BannerRtihComponent } from '../banner-rtih/banner-rtih.component';
import { FocusSegmentsComponent} from '../focus-segments/focus-segments.component';
import { PartnerWithUsComponent } from '../partner-with-us/partner-with-us.component';
import { FaqRtihComponent } from '../faq-rtih/faq-rtih.component'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { StartupToolkit } from "../startup-toolkit/startup-toolkit";

type Metric = { label: string; value: string; };
type Card = { icon?: string; image?: string; title: string; desc?: string; };
type Partner = string;

type Stat = {
  value: string;
  label: string;
  icon: string;    // path to icon
  tone: 'purple' | 'yellow';
  target: number;
  format: 'comma' | 'lakh' | 'plain';
  suffix?: string;
  animatedValue: string;
};

type Item = { title: string; desc: string; icon: string };
type District = { slug: string; label: string };

let portalWelcomeShownThisLoad = false;

@Component({
  selector: 'app-home-rtih',
  
  standalone:true,
    changeDetection: ChangeDetectionStrategy.OnPush,
imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    FooterRtihComponent,
    HeaderRtihComponent,
    BannerRtihComponent,
    FocusSegmentsComponent,
    PartnerWithUsComponent,
    StartupToolkit,
    FaqRtihComponent
],
  templateUrl: './home-rtih.html',
  styleUrl: './home-rtih.scss'
})
export class HomeRtih implements AfterViewInit, OnDestroy {
  showWelcomePopup = !portalWelcomeShownThisLoad;
  private statsObserver?: IntersectionObserver;
  private routerSub?: Subscription;
  private statsAnimated = false;
  private skipInitialFragmentScroll = false;

  closeWelcomePopup() {
    this.showWelcomePopup = false;
  }

  constructor(private router: Router,private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
    portalWelcomeShownThisLoad = true;
  }
  //ABOUT IMG SCROLL
   @ViewChild('galleryEl', { static: false }) galleryEl?: ElementRef<HTMLDivElement>;
   @ViewChild('statsSection', { static: false }) statsSection?: ElementRef<HTMLElement>;

  scrollGallery(dir: number) {
    const el = this.galleryEl?.nativeElement;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.clientWidth + 12 : 300; // approximate width + gap
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  }

  // List of clickable names
  districts: District[] = [
    { slug: 'vijayawada',      label: 'Vijayawada' },
    { slug: 'rajahmundry',     label: 'Rajamahendravaram' },
    { slug: 'visakhapatnam',   label: 'Visakhapatnam' },
    { slug: 'tirupati',        label: 'Tirupati' },
    { slug: 'anantapur',       label: 'Ananthapuramu' },
  ];

  // optional: use this to highlight related shapes on hover
  hover: string | null = null;

  //STATS SCROLL
  // stats: Stat[] = [
  //   { value: '20,000', label: 'Start-Ups to be created',        icon: 'assets/icons/supported-icon.svg',  tone: 'purple' },
  //   { value: '1 lakh', label: 'Jobs to be created by 2029',       icon: 'assets/icons/jobs-icon.svg',    tone: 'yellow' },
  //   { value: '20+',    label: 'Soonicorns to be Enabled',         icon: 'assets/icons/soonicorns-icon.svg',  tone: 'purple' },
  //   { value: '10+',    label: 'Unicorns to be Enabled',           icon: 'assets/icons/unicorns-icon.svg', tone: 'purple' },
  //   { value: '',    label: 'Build Centers of Excellence in emerging technologies',           icon: 'assets/icons/unicorns-icon.svg', tone: 'purple' },
  // ];

  stats: Stat[] = [
  {
    value: '20,000',
    label: 'Start-Ups to be created',
    icon: 'assets/icons/supported-icon.svg',
    tone: 'yellow',
    target: 20000,
    format: 'comma',
    animatedValue: '0'
  },
  {
    value: '100,000',
    label: 'Jobs to be created by 2029',
    icon: 'assets/icons/jobs-icon.svg',
    tone: 'yellow',
    target: 100000,
    format: 'comma',
    animatedValue: '0'
  },
  {
    value: '20+',
    label: 'Enable 20+ Soonicorns',
    icon: 'assets/icons/soonicorns-icon.svg',
    tone: 'purple',
    target: 20,
    format: 'plain',
    suffix: '+',
    animatedValue: '0'
  },
  {
    value: '10+',
    label: 'Enable 10+ Unicorns',
    icon: 'assets/icons/unicorns-icon.svg',
    tone: 'purple',
    target: 10,
    format: 'plain',
    suffix: '+',
    animatedValue: '0'
  },
  {
    value: '10',
    label: 'Centers of Excellence in emerging technologies',
    icon: 'assets/icons/build-icon.svg',
    tone: 'purple',
    target: 10,
    format: 'plain',
    animatedValue: '0'
  }
];

ngAfterViewInit(): void {
    const initialFragment = this.route.snapshot.fragment;
    this.skipInitialFragmentScroll = !!initialFragment && this.isReloadNavigation();

    if (this.skipInitialFragmentScroll) {
      this.clearUrlFragment();
      this.scrollToHero();
    }

    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (this.skipInitialFragmentScroll && event.id === 1) {
          this.skipInitialFragmentScroll = false;
          this.scrollToHero();
          return;
        }
        this.skipInitialFragmentScroll = false;

        const fragment = this.route.snapshot.fragment;
        if (fragment) {
          const el = document.getElementById(fragment);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
          }
        }
      });

    this.setupStatsAnimation();
  }

  ngOnDestroy(): void {
    this.statsObserver?.disconnect();
    this.routerSub?.unsubscribe();
  }

  private setupStatsAnimation(): void {
    const section = this.statsSection?.nativeElement;
    if (!section || typeof IntersectionObserver === 'undefined') {
      this.finishStatsAnimation();
      return;
    }

    this.statsObserver = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          this.animateStats();
          this.statsObserver?.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    this.statsObserver.observe(section);
  }

  private animateStats(): void {
    if (this.statsAnimated) return;
    this.statsAnimated = true;

    const duration = 1300;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      this.stats = this.stats.map(stat => ({
        ...stat,
        animatedValue: this.formatStat(Math.round(stat.target * eased), stat)
      }));
      this.cdr.markForCheck();

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        this.finishStatsAnimation();
      }
    };

    requestAnimationFrame(tick);
  }

  private finishStatsAnimation(): void {
    this.stats = this.stats.map(stat => ({
      ...stat,
      animatedValue: stat.value
    }));
    this.cdr.markForCheck();
  }

  private isReloadNavigation(): boolean {
    if (typeof performance === 'undefined' || !performance.getEntriesByType) {
      return false;
    }

    const [navigation] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    return navigation?.type === 'reload';
  }

  private clearUrlFragment(): void {
    if (typeof window === 'undefined' || !window.history?.replaceState) {
      return;
    }

    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  }

  private scrollToHero(): void {
    if (typeof window === 'undefined') {
      return;
    }

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  }

  private formatStat(value: number, stat: Stat): string {
    if (stat.format === 'lakh') {
      return value >= stat.target ? '1 lakh' : value.toLocaleString('en-IN');
    }

    const formattedValue = stat.format === 'comma'
      ? value.toLocaleString('en-IN')
      : value.toString();

    return `${formattedValue}${stat.suffix ?? ''}`;
  }

  // If you wire it into a real carousel later:
  prev() {/* optional */}
  next() {/* optional */}

  //waht makes AP section
  left: Item[] = [
    { title: 'Hub & Spoke Model', desc: 'Centralized coordination with district-level execution for maximum reach and impact.', icon: 'assets/icons/hub-icon.svg' },
    { title: 'Inclusivity & Diversity', desc: 'Empowering women, rural entrepreneurs, and underrepresented communities.', icon: 'assets/icons/diversity-icon.svg' },
    { title: 'Digital Integration', desc: 'Seamless Startup One portal for simplified processes and reduced bureaucracy.', icon: 'assets/icons/digital-icon.svg' },
  ];

  right: Item[] = [
    { title: 'Sectoral Focus', desc: 'Targeted support across agriculture, healthcare, fintech, and emerging technologies.', icon: 'assets/icons/sectoral-icon.svg' },
    { title: 'Academia-Industry Collaboration', desc: 'Strong partnerships between educational institutions and industry leaders.', icon: 'assets/icons/acadamia-icon.svg' },
    { title: 'Policy Targets', desc: 'Clear roadmap with measurable goals for startup ecosystem development.', icon: 'assets/icons/policy-icon.svg' },
  ];

metrics: Metric[] = [
    { value: '20,000+', label: 'Startups supported' },
    { value: '20+',     label: 'Soonicorns by 2029' },
    { value: '10+',     label: 'Unicorns by 2029' },
    { value: '1,00,000',label: 'Jobs enabled' }
  ];

  features: Card[] = [
    { icon: 'assets/icon1-color.svg', title: 'Hub & Spoke', desc: 'Amaravati HQ + regional centers for last-mile reach.' },
    { icon: 'assets/icon2-color.svg', title: 'Single Window', desc: 'Startup One portal: apply, track, manage.' },
    { icon: 'assets/icon3-color.svg', title: 'Inclusive by Design', desc: 'Women, rural innovators, student founders.' },
    { icon: 'assets/icon4-color.svg', title: 'Sector Focus', desc: 'AI, biotech, clean energy, agri/health/fintech.' }
  ];

  programs: Card[] = [
    { icon: 'assets/icon5.svg',  title: 'Incubation', desc: 'Workspace, labs, coaching, milestones.' },
    { icon: 'assets/icon6.svg',  title: 'Mentor Connect', desc: 'Founders, domain experts, operators.' },
    { icon: 'assets/icon7.svg',  title: 'Funding', desc: 'Grants, angel/VC connects, CSR.' },
    { icon: 'assets/icon8.svg',  title: 'Market Access', desc: 'Pilots with corporates & departments.' },
    { icon: 'assets/icon9.svg',  title: 'Skills & Academia', desc: 'Hackathons, challenges, univeristy collabs.' },
    { icon: 'assets/icon10.svg', title: 'Digital Services', desc: 'End-to-end journey on portal.' }
  ];

  sectors: Card[] = [
    { icon: 'assets/icons/hub-icon.svg', title: 'AI & Data' },
    { icon: 'assets/icon12.svg', title: 'Biotech/Health' },
    { icon: 'assets/icon13.svg', title: 'Clean Energy' },
    { icon: 'assets/icon14.svg', title: 'AgriTech' },
    { icon: 'assets/icon15.svg', title: 'FinTech' },
    { icon: 'assets/icon16.svg', title: 'Advanced Mfg.' },
    { icon: 'assets/icon17.svg', title: 'GovTech' },
    { icon: 'assets/icon18.svg', title: 'Space/Other' },
  ];

  partners: Partner[] = [
    'assets/jsw.png','assets/greenco.png','assets/meil.png','assets/bits-pilani.png','assets/iit-madras.png',
    'assets/iim.png','assets/rtgs-logo.png','assets/ap-logo.png','assets/msme.png','assets/l&t.png'
  ];

  aboutGallery = [
    'assets/about-slider1.png',
    'assets/about-slider2.png',
    'assets/about-slider3.png'
  ];

  leadership = [
    { image: 'assets/cm-sir.png',      name: 'Hon’ble Chief Minister', quote: 'Innovation and entrepreneurship to power inclusive growth.' },
    { image: 'assets/lokesh-sir.png',  name: 'Hon’ble Minister (IT/Edu)', quote: 'From AP to the world — build globally competitive startups.' }
  ];

// in the hosting component .ts
go(slug: string) {
  this.router?.navigate(['/location', slug]);
}



}
